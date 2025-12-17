import { describe, it, expect } from "vitest";

describe("Admin Authentication", () => {
  it("should have ADMIN_USERNAME environment variable set", () => {
    expect(process.env.ADMIN_USERNAME).toBeDefined();
    expect(process.env.ADMIN_USERNAME).toBe("admin.x.admin");
  });

  it("should have ADMIN_PASSWORD environment variable set", () => {
    expect(process.env.ADMIN_PASSWORD).toBeDefined();
    expect(process.env.ADMIN_PASSWORD).toBeTruthy();
  });

  it("should have password with correct length", () => {
    const password = process.env.ADMIN_PASSWORD;
    expect(password).toBeDefined();
    // Password should be "Xtd1982!" which is 8 characters
    expect(password!.length).toBe(8);
  });

  it("should verify credentials match expected values", () => {
    expect(process.env.ADMIN_USERNAME).toBe("admin.x.admin");
    expect(process.env.ADMIN_PASSWORD).toBe("Xtd1982!");
  });
});
