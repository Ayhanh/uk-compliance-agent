import { env } from "wasp/server";
import { ExternalApiError, fetchJson } from "./apiErrors";

const COMPANIES_HOUSE_API_URL =
  "https://api.company-information.service.gov.uk";

export interface CompaniesHouseCompanyProfile {
  companyNumber: string;
  name: string;
  registrationStatus: string;
  sicCodes: string[];
  address: Record<string, string> | null;
  incorporationDate: Date | null;
}

interface CompaniesHouseProfileResponse {
  company_number?: unknown;
  company_name?: unknown;
  company_status?: unknown;
  registered_office_address?: unknown;
  date_of_creation?: unknown;
  sic_codes?: unknown;
}

export async function fetchCompanyProfile(
  companyNumber: string,
): Promise<CompaniesHouseCompanyProfile> {
  const normalizedCompanyNumber = normalizeCompanyNumber(companyNumber);
  const url = new URL(
    `/company/${encodeURIComponent(normalizedCompanyNumber)}`,
    COMPANIES_HOUSE_API_URL,
  );
  const credentials = Buffer.from(`${env.COMPANIES_HOUSE_API_KEY}:`).toString(
    "base64",
  );
  const response = await fetchJson("Companies House", url, {
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${credentials}`,
    },
  });

  if (!isRecord(response)) {
    throw invalidProfileResponse();
  }

  const profile = response as CompaniesHouseProfileResponse;
  const returnedCompanyNumber = asNonEmptyString(profile.company_number);
  const name = asNonEmptyString(profile.company_name);
  const registrationStatus = asNonEmptyString(profile.company_status);
  if (!returnedCompanyNumber || !name || !registrationStatus) {
    throw invalidProfileResponse();
  }

  return {
    companyNumber: returnedCompanyNumber,
    name,
    registrationStatus,
    sicCodes: asStringArray(profile.sic_codes),
    address: asStringRecord(profile.registered_office_address),
    incorporationDate: parseDate(profile.date_of_creation),
  };
}

function normalizeCompanyNumber(companyNumber: string): string {
  const normalized = companyNumber.trim().toUpperCase();
  if (!/^[A-Z0-9]{1,10}$/.test(normalized)) {
    throw new ExternalApiError(
      "Companies House",
      "invalid_input",
      "company number must contain only letters and numbers",
    );
  }
  return normalized;
}

function invalidProfileResponse(): ExternalApiError {
  return new ExternalApiError(
    "Companies House",
    "invalid_response",
    "company profile response is missing required fields",
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

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function asStringRecord(value: unknown): Record<string, string> | null {
  if (!isRecord(value)) {
    return null;
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
}

function parseDate(value: unknown): Date | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
    ? null
    : date;
}
