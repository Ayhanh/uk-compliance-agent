export class HttpError extends Error {
  statusCode: number;
  cause?: unknown;
  constructor(statusCode: number, message: string, options?: { cause?: unknown }) {
    super(message);
    this.statusCode = statusCode;
    this.cause = options?.cause;
  }
}