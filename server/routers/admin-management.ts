import { router, adminProcedure } from "../_core/trpc";
import { z } from "zod";
import * as bcrypt from "bcryptjs";
import {
  getAllAdminAccounts,
  getAdminAccountById,
  getAdminAccountByUsername,
  createAdminAccount,
  updateAdminAccount,
  deleteAdminAccount,
  countActiveAdminAccounts,
} from "../db";
import { TRPCError } from "@trpc/server";

export const adminManagementRouter = router({
  list: adminProcedure.query(async () => {
    try {
      const accounts = await getAllAdminAccounts();
      return accounts.map((acc) => ({
        id: acc.id,
        username: acc.username,
        name: acc.name,
        email: acc.email,
        isActive: acc.isActive,
        createdAt: acc.createdAt,
        updatedAt: acc.updatedAt,
      }));
    } catch (error) {
      console.error("[Admin Management] Failed to list accounts:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to list admin accounts",
      });
    }
  }),

  create: adminProcedure
    .input(
      z.object({
        username: z.string().min(3).max(100),
        password: z.string().min(8),
        name: z.string().optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Check if username already exists
        const existing = await getAdminAccountByUsername(input.username);
        if (existing) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Username already exists",
          });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(input.password, 10);

        // Create account
        const id = await createAdminAccount({
          username: input.username,
          passwordHash,
          name: input.name || null,
          email: input.email || null,
          isActive: 1,
        });

        return {
          id,
          username: input.username,
          name: input.name,
          email: input.email,
          message: "Admin account created successfully",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Admin Management] Failed to create account:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create admin account",
        });
      }
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        password: z.string().min(8).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const account = await getAdminAccountById(input.id);
        if (!account) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Admin account not found",
          });
        }

        const updateData: any = {};
        if (input.name !== undefined) updateData.name = input.name;
        if (input.email !== undefined) updateData.email = input.email;
        if (input.password !== undefined) {
          updateData.passwordHash = await bcrypt.hash(input.password, 10);
        }

        await updateAdminAccount(input.id, updateData);

        return {
          id: input.id,
          message: "Admin account updated successfully",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Admin Management] Failed to update account:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update admin account",
        });
      }
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Prevent self-deletion
        const account = await getAdminAccountById(input.id);
        if (!account) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Admin account not found",
          });
        }

        // Prevent self-deletion by checking if the account being deleted matches current admin
        // For now, we'll allow deletion but add a warning
        // In a production system, you'd track which admin account is logged in
        // and prevent deletion of that specific account

        // Prevent deletion of last admin account
        const activeCount = await countActiveAdminAccounts();
        if (activeCount <= 1) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot delete the last admin account",
          });
        }

        await deleteAdminAccount(input.id);

        return {
          id: input.id,
          message: "Admin account deleted successfully",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Admin Management] Failed to delete account:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete admin account",
        });
      }
    }),
});
