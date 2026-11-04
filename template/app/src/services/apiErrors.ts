export type ExternalApiService =
  | "Companies House"
  | "The Gazette"
  | "Gemini"
  | "Dodo Payments";

export type ExternalApiErrorCode =
  | "invalid_input"
  | "network_error"
  | "rate_limited"
  | "not_found"
  | "unauthorized"
  | "upstream_error"
  | "invalid_response"
  | "output_truncated";

export class ExternalApiError extends Error {
  constructor(
    public readonly service: ExternalApiService,
    public readonly code: ExternalApiErrorCode,
    message: string,
    public readonly statusCode?: number,
    public readonly retryAfterSeconds?: number,
    options?: ErrorOptions,
  ) {
    super(`${service}: ${message}`, options);
    this.name = "ExternalApiError";
  }
}

export async function fetchJson(
  service: ExternalApiService,
  url: URL,
  init?: RequestInit,
): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    throw new ExternalApiError(
      service,
      "network_error",
      "request failed before a response was received",
      undefined,
      undefined,
      { cause: error },
    );
  }

  if (!response.ok) {
    const retryAfterSeconds = getRetryAfterSeconds(
      response.headers.get("Retry-After"),
    );
    const code: ExternalApiErrorCode =
      response.status === 429
        ? "rate_limited"
        : response.status === 404
          ? "not_found"
          : response.status === 401 || response.status === 403
            ? "unauthorized"
            : "upstream_error";
    const retryMessage =
      retryAfterSeconds === undefined
        ? ""
        : ` Retry after ${retryAfterSeconds} seconds.`;

    throw new ExternalApiError(
      service,
      code,
      `request returned HTTP ${response.status}.${retryMessage}`,
      response.status,
      retryAfterSeconds,
    );
  }

  try {
    return await response.json();
  } catch (error) {
    throw new ExternalApiError(
      service,
      "invalid_response",
      "response was not valid JSON",
      response.status,
      undefined,
      { cause: error },
    );
  }
}

function getRetryAfterSeconds(value: string | null): number | undefined {
  if (value === null) {
    return undefined;
  }

  const seconds = Number(value);
  if (Number.isFinite(seconds)) {
    return Math.max(0, Math.ceil(seconds));
  }

  const retryAt = Date.parse(value);
  return Number.isNaN(retryAt)
    ? undefined
    : Math.max(0, Math.ceil((retryAt - Date.now()) / 1000));
}
