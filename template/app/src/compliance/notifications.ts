import { RiskSeverity } from "@prisma/client";
import { env } from "wasp/server";
import { emailSender } from "wasp/server/email";

export interface AlertPayload {
  companyNumber: string;
  companyName: string;
  severity: RiskSeverity;
  eventTitle: string;
  summary: string;
  recommendedActions: string[];
  sourceUrl: string | null;
  dashboardUrl: string;
}

export function isAlertSeverity(severity: RiskSeverity): boolean {
  return severity === RiskSeverity.HIGH || severity === RiskSeverity.CRITICAL;
}

export function formatAlertText(alert: AlertPayload): string {
  const actions = alert.recommendedActions
    .map((action, index) => `${index + 1}. ${action}`)
    .join("\n");
  return [
    `${alert.severity} compliance alert: ${alert.companyName} (${alert.companyNumber})`,
    "",
    alert.eventTitle,
    "",
    alert.summary,
    "",
    "Recommended actions:",
    actions,
    "",
    alert.sourceUrl ? `Source: ${alert.sourceUrl}` : "",
    `Dashboard: ${alert.dashboardUrl}`,
  ]
    .filter((line, index, lines) => line !== "" || lines[index - 1] !== "")
    .join("\n")
    .trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function formatAlertHtml(alert: AlertPayload): string {
  const actions = alert.recommendedActions
    .map((action) => `<li>${escapeHtml(action)}</li>`)
    .join("");
  return `<h2>${escapeHtml(alert.severity)} compliance alert</h2>
<p><strong>${escapeHtml(alert.companyName)}</strong> (${escapeHtml(
    alert.companyNumber,
  )})</p>
<p><strong>${escapeHtml(alert.eventTitle)}</strong></p>
<p>${escapeHtml(alert.summary)}</p>
<h3>Recommended actions</h3><ol>${actions}</ol>
${
  alert.sourceUrl
    ? `<p><a href="${escapeHtml(alert.sourceUrl)}">View official notice</a></p>`
    : ""
}
<p><a href="${escapeHtml(alert.dashboardUrl)}">Open dashboard</a></p>`;
}

export async function sendTelegramAlert(alert: AlertPayload): Promise<boolean> {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.MY_TELEGRAM_ID;
  if (!token || !chatId) return false;

  // Telegram caps messages at 4096 characters. Plain text avoids markup injection.
  const text = formatAlertText(alert).slice(0, 4000);
  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(10_000),
    },
  );
  if (!response.ok) {
    throw new Error(`Telegram sendMessage failed with HTTP ${response.status}`);
  }
  return true;
}

export async function sendEmailAlert(
  recipients: string[],
  alert: AlertPayload,
): Promise<number> {
  let sent = 0;
  for (const to of recipients) {
    await emailSender.send({
      to,
      subject:
        `[${alert.severity}] ${alert.companyName}: ${alert.eventTitle}`.slice(
          0,
          200,
        ),
      text: formatAlertText(alert),
      html: formatAlertHtml(alert),
    });
    sent += 1;
  }
  return sent;
}

/**
 * Sends an alert on every configured channel. Returns true when at least one
 * channel delivered, so the caller can mark the assessment as notified.
 * Channel failures are logged and never thrown.
 */
export async function dispatchAlert(
  recipients: string[],
  alert: AlertPayload,
): Promise<boolean> {
  const results = await Promise.allSettled([
    sendTelegramAlert(alert),
    sendEmailAlert(recipients, alert),
  ]);
  let delivered = false;
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Alert channel failed:", result.reason);
    } else if (result.value) {
      delivered = true;
    }
  }
  return delivered;
}
