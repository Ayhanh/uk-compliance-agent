import { describe, expect, it } from "vitest";

function isAdminEmailHelper(email: string, adminEmails: string[]): boolean {
  const normalizedInput = email.trim().toLowerCase();
  return adminEmails.some(
    (adminEmail) => adminEmail.trim().toLowerCase() === normalizedInput,
  );
}

describe("Auth User Signup Fields QA Tests", () => {
  const adminEmailsList = ["admin@example.com", "super@company.com"];

  it("should return true for exact admin email match", () => {
    expect(isAdminEmailHelper("admin@example.com", adminEmailsList)).toBe(true);
  });

  it("should return true for case-insensitive admin email match (e.g. Admin@Example.com)", () => {
    expect(isAdminEmailHelper("ADMIN@EXAMPLE.COM", adminEmailsList)).toBe(true);
    expect(isAdminEmailHelper(" Admin@example.com ", adminEmailsList)).toBe(true);
  });

  it("should return false for non-admin email", () => {
    expect(isAdminEmailHelper("user@example.com", adminEmailsList)).toBe(false);
  });
});
