import { describe, expect, it } from "vitest";
import { isFileWithAllowedFileType, validateFile } from "./fileUploading";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_BYTES } from "./validation";

describe("File Upload Validation QA Tests", () => {
  it("should validate file size within limit", () => {
    const validFile = new File(["a".repeat(1024)], "test.png", {
      type: "image/png",
    });
    expect(() => validateFile(validFile)).not.toThrow();
  });

  it("should throw an error when file size exceeds 5MB limit", () => {
    const oversizedFile = new File(
      [new Uint8Array(MAX_FILE_SIZE_BYTES + 1)],
      "large.png",
      { type: "image/png" },
    );
    expect(() => validateFile(oversizedFile)).toThrowError(
      /File size exceeds 5MB limit/,
    );
  });

  it("should allow valid mime types like image/png, image/jpeg, application/pdf", () => {
    const pngFile = new File(["data"], "test.png", { type: "image/png" });
    const jpegFile = new File(["data"], "test.jpg", { type: "image/jpeg" });
    const pdfFile = new File(["data"], "test.pdf", { type: "application/pdf" });

    expect(isFileWithAllowedFileType(pngFile)).toBe(true);
    expect(isFileWithAllowedFileType(jpegFile)).toBe(true);
    expect(isFileWithAllowedFileType(pdfFile)).toBe(true);
  });

  it("should correctly handle wildcard MIME type matching (e.g. text/* for text/plain, text/csv)", () => {
    const textPlain = new File(["content"], "notes.txt", { type: "text/plain" });
    const textCsv = new File(["content"], "data.csv", { type: "text/csv" });

    expect(isFileWithAllowedFileType(textPlain)).toBe(true);
    expect(isFileWithAllowedFileType(textCsv)).toBe(true);
    expect(() => validateFile(textPlain)).not.toThrow();
  });

  it("should reject disallowed file types like application/x-executable", () => {
    const exeFile = new File(["data"], "malicious.exe", {
      type: "application/x-msdownload",
    });
    expect(isFileWithAllowedFileType(exeFile)).toBe(false);
    expect(() => validateFile(exeFile)).toThrowError(/not supported/);
  });
});
