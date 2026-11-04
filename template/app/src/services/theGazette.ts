import { env } from "wasp/server";
import { ExternalApiError, fetchJson } from "./apiErrors";

const MAX_PAGE_SIZE = 100;
const MAX_PAGES = 10;

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface GazetteComplianceEvent {
  provider: "THE_GAZETTE";
  externalId: string;
  companyNumber: string;
  title: string;
  sourceUrl: string;
  publishedAt: Date | null;
  fetchedAt: Date;
  payload: { [key: string]: JsonValue };
  analysisText: string;
}

export interface FetchGazetteNoticesOptions {
  companyNumber: string;
  companyName: string;
  since?: Date;
  categoryCodes?: string[];
  pageSize?: number;
  maxPages?: number;
}

interface GazetteNoticeFeedEntry {
  id?: unknown;
  title?: unknown;
  published?: unknown;
  content?: unknown;
  category?: unknown;
  link?: unknown;
  [key: string]: unknown;
}

export async function fetchGazetteNoticesForCompany({
  companyNumber,
  companyName,
  since,
  categoryCodes = [],
  pageSize = MAX_PAGE_SIZE,
  maxPages = 3,
}: FetchGazetteNoticesOptions): Promise<GazetteComplianceEvent[]> {
  const normalizedCompanyNumber = normalizeCompanyNumber(companyNumber);
  const normalizedCompanyName = companyName.trim();
  if (!normalizedCompanyName) {
    throw new ExternalApiError(
      "The Gazette",
      "invalid_input",
      "company name must not be empty",
    );
  }
  if (since && Number.isNaN(since.getTime())) {
    throw new ExternalApiError(
      "The Gazette",
      "invalid_input",
      "since must be a valid date",
    );
  }
  validateOptions(categoryCodes, pageSize, maxPages);

  const terms = [...new Set([normalizedCompanyNumber, normalizedCompanyName])];
  const noticesById = new Map<string, GazetteComplianceEvent>();
  const fetchedAt = new Date();

  for (const searchTerm of terms) {
    for (let page = 1; page <= maxPages; page += 1) {
      const feed = await fetchGazetteFeedPage({
        searchTerm,
        since,
        categoryCodes,
        pageSize,
        page,
      });

      for (const rawEntry of getEntries(feed)) {
        const event = normalizeNoticeEntry(
          rawEntry,
          normalizedCompanyNumber,
          normalizedCompanyName,
          fetchedAt,
        );
        if (event) {
          noticesById.set(event.externalId, event);
        }
      }

      if (!hasNextPage(feed)) {
        break;
      }
    }
  }

  return [...noticesById.values()].sort(
    (left, right) =>
      (right.publishedAt?.getTime() ?? 0) - (left.publishedAt?.getTime() ?? 0),
  );
}

async function fetchGazetteFeedPage({
  searchTerm,
  since,
  categoryCodes,
  pageSize,
  page,
}: {
  searchTerm: string;
  since?: Date;
  categoryCodes: string[];
  pageSize: number;
  page: number;
}): Promise<Record<string, unknown>> {
  const url = new URL(
    "/all-notices/notice/data.json",
    env.THE_GAZETTE_API_BASE_URL,
  );
  url.searchParams.set("text", searchTerm);
  if (categoryCodes.length > 0) {
    url.searchParams.set("categorycode", categoryCodes.join("+"));
  }
  url.searchParams.set("results-page-size", String(pageSize));
  url.searchParams.set("results-page", String(page));
  url.searchParams.set("sort-by", "latest-date");
  if (since) {
    url.searchParams.set(
      "start-publish-date",
      since.toISOString().slice(0, 10),
    );
  }

  const response = await fetchJson("The Gazette", url, {
    headers: { Accept: "application/json" },
  });
  if (!isRecord(response)) {
    throw invalidFeedResponse();
  }
  return response;
}

function normalizeNoticeEntry(
  entry: GazetteNoticeFeedEntry,
  companyNumber: string,
  companyName: string,
  fetchedAt: Date,
): GazetteComplianceEvent | null {
  const id = asNonEmptyString(entry.id);
  const title = asNonEmptyString(entry.title);
  if (!id || !title) {
    throw invalidFeedResponse();
  }

  const noticeIdMatch = /\/(?:id\/)?notice\/([^/?#]+)\/?$/.exec(id);
  if (!noticeIdMatch) {
    return null;
  }

  const externalId = noticeIdMatch[1];
  if (!externalId) {
    throw invalidFeedResponse();
  }

  const content = cleanHtml(asNonEmptyString(entry.content) ?? "");
  const searchableText = normalizeSearchText(`${title} ${content}`);
  const hasCompanyNumber = new RegExp(
    `(^|[^A-Z0-9])${escapeRegExp(companyNumber)}([^A-Z0-9]|$)`,
    "i",
  ).test(`${title} ${content}`);
  const hasCompanyName = searchableText.includes(
    normalizeSearchText(companyName),
  );
  if (!hasCompanyNumber && !hasCompanyName) {
    return null;
  }

  const category = isRecord(entry.category)
    ? asNonEmptyString(entry.category["@term"])
    : null;
  const analysisText = [title, category, content]
    .filter((part): part is string => Boolean(part))
    .join("\n\n");

  return {
    provider: "THE_GAZETTE",
    externalId,
    companyNumber,
    title,
    sourceUrl: new URL(
      `/notice/${encodeURIComponent(externalId)}`,
      env.THE_GAZETTE_API_BASE_URL,
    ).toString(),
    publishedAt: parseDate(entry.published),
    fetchedAt,
    payload: toJsonObject(entry),
    analysisText,
  };
}

function getEntries(feed: Record<string, unknown>): GazetteNoticeFeedEntry[] {
  const entries = feed.entry;
  if (entries === undefined || entries === null) {
    return [];
  }

  const candidates = Array.isArray(entries) ? entries : [entries];
  if (candidates.some((candidate) => !isRecord(candidate))) {
    throw invalidFeedResponse();
  }
  return candidates.filter(isRecord);
}

function hasNextPage(feed: Record<string, unknown>) {
  const links = Array.isArray(feed.link) ? feed.link : [];
  return links.some(
    (link) =>
      isRecord(link) &&
      link["@rel"] === "next" &&
      typeof link["@href"] === "string",
  );
}

function validateOptions(
  categoryCodes: string[],
  pageSize: number,
  maxPages: number,
) {
  if (categoryCodes.some((code) => !/^\d{2}$/.test(code))) {
    throw new ExternalApiError(
      "The Gazette",
      "invalid_input",
      "category codes must be one or more two-digit values",
    );
  }
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > MAX_PAGE_SIZE) {
    throw new ExternalApiError(
      "The Gazette",
      "invalid_input",
      `page size must be between 1 and ${MAX_PAGE_SIZE}`,
    );
  }
  if (!Number.isInteger(maxPages) || maxPages < 1 || maxPages > MAX_PAGES) {
    throw new ExternalApiError(
      "The Gazette",
      "invalid_input",
      `maximum pages must be between 1 and ${MAX_PAGES}`,
    );
  }
}

function normalizeCompanyNumber(companyNumber: string): string {
  const normalized = companyNumber.trim().toUpperCase();
  if (!/^[A-Z0-9]{1,10}$/.test(normalized)) {
    throw new ExternalApiError(
      "The Gazette",
      "invalid_input",
      "company number must contain only letters and numbers",
    );
  }
  return normalized;
}

function invalidFeedResponse(): ExternalApiError {
  return new ExternalApiError(
    "The Gazette",
    "invalid_response",
    "notice feed response has an unexpected shape",
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function parseDate(value: unknown): Date | null {
  if (typeof value !== "string") {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function cleanHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSearchText(value: string): string {
  return value
    .toLocaleLowerCase("en-GB")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toJsonObject(value: Record<string, unknown>): {
  [key: string]: JsonValue;
} {
  const result: { [key: string]: JsonValue } = {};
  for (const [key, item] of Object.entries(value)) {
    const jsonValue = toJsonValue(item);
    if (jsonValue !== undefined) {
      result[key] = jsonValue;
    }
  }
  return result;
}

function toJsonValue(value: unknown): JsonValue | undefined {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (Array.isArray(value)) {
    return value
      .map(toJsonValue)
      .filter((item): item is JsonValue => item !== undefined);
  }
  if (isRecord(value)) {
    return toJsonObject(value);
  }
  return undefined;
}
