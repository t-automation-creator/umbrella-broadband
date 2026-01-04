import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import {
  validateAllRedirects,
  getCachedResults,
  getUnhealthyRedirects,
  getRouteStatus,
} from "../services/url-validation";

export const urlValidationRouter = router({
  /**
   * Run validation on all redirect URLs
   * Public endpoint - can be called by monitoring services
   */
  validateAll: publicProcedure.query(async () => {
    const results = await validateAllRedirects();
    return {
      results,
      timestamp: new Date(),
      hasIssues: results.some((r) => !r.isHealthy),
    };
  }),

  /**
   * Get cached validation results
   * Public endpoint - shows current status without running new checks
   */
  getStatus: publicProcedure.query(() => {
    const results = getCachedResults();
    const unhealthy = getUnhealthyRedirects();
    return {
      results,
      unhealthy,
      hasIssues: unhealthy.length > 0,
      lastUpdated: results.length > 0 ? results[0].lastChecked : null,
    };
  }),

  /**
   * Get status for a specific redirect route
   * Public endpoint
   */
  getRouteStatus: publicProcedure.input(z.string()).query(({ input }) => {
    const status = getRouteStatus(input);
    return status || null;
  }),

  /**
   * Admin endpoint to manually trigger validation
   * Protected - requires admin authentication
   */
  adminValidateAll: protectedProcedure.query(async () => {
    const results = await validateAllRedirects();
    const unhealthy = getUnhealthyRedirects();
    return {
      results,
      unhealthy,
      timestamp: new Date(),
      hasIssues: unhealthy.length > 0,
    };
  }),

  /**
   * Admin dashboard with health summary
   * Protected - requires admin authentication
   */
  adminDashboard: protectedProcedure.query(() => {
    const results = getCachedResults();
    const unhealthy = getUnhealthyRedirects();
    const healthy = results.filter((r) => r.isHealthy);

    return {
      summary: {
        total: results.length,
        healthy: healthy.length,
        unhealthy: unhealthy.length,
        healthPercentage: results.length > 0 ? Math.round((healthy.length / results.length) * 100) : 0,
      },
      routes: results.map((r) => ({
        path: r.route,
        destination: r.destination,
        status: r.status,
        isHealthy: r.isHealthy,
        error: r.error,
        lastChecked: r.lastChecked,
      })),
      unhealthyList: unhealthy.map((r) => ({
        path: r.route,
        destination: r.destination,
        error: r.error,
        status: r.status,
      })),
    };
  }),
});
