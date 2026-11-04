import { describe, expect, it } from "vitest";
import { z } from "zod";

// Wasp HttpError sınıfını simüle eden hafif hata sınıfı
class MockHttpError extends Error {
  statusCode: number;
  cause?: unknown;
  constructor(statusCode: number, message: string, options?: { cause?: unknown }) {
    super(message);
    this.statusCode = statusCode;
    this.cause = options?.cause;
  }
}

// ensureArgsSchemaOrThrowHttpError fonksiyonunu gerçek dosyadan alıyoruz
import { ensureArgsSchemaOrThrowHttpError } from "./validation";

describe("Server Arguments Validation QA Tests", () => {
  const sampleSchema = z.object({
    email: z.string().email(),
    age: z.number().min(18),
  });

  it("should return parsed data when raw input satisfies schema", () => {
    const validRawArgs = { email: "user@example.com", age: 25 };
    const result = ensureArgsSchemaOrThrowHttpError(sampleSchema, validRawArgs);
    expect(result).toEqual({ email: "user@example.com", age: 25 });
  });

  it("should handle null and undefined raw arguments gracefully", () => {
    expect(() =>
      ensureArgsSchemaOrThrowHttpError(sampleSchema, null),
    ).toThrow();
    expect(() =>
      ensureArgsSchemaOrThrowHttpError(sampleSchema, undefined),
    ).toThrow();
  });
});