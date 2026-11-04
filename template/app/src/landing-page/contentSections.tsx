cat << 'EOF' > src/landing-page/contentSections.tsx
import type { GridFeature } from "./components/FeaturesGrid";

export const features: GridFeature[] = [
  {
    name: "Official sources",
    description:
      "Data comes from Companies House and The Gazette, the UK's official public record.",
    emoji: "🏛️",
    size: "medium",
    href: "#",
  },
  {
    name: "Plain-English AI analysis",
    description:
      "Every notice is summarised with the reason it matters to your company.",
    emoji: "🤖",
    size: "medium",
    href: "#",
  },
  {
    name: "Four severity levels",
    description:
      "LOW, MEDIUM, HIGH and CRITICAL, so you know what to read first.",
    emoji: "🚦",
    size: "medium",
    href: "#",
  },
  {
    name: "Director action steps",
    description: "Clear, ordered next steps for every finding.",
    emoji: "✅",
    size: "medium",
    href: "#",
  },
  {
    name: "Instant alerts",
    description: "HIGH and CRITICAL findings reach you by email and Telegram.",
    emoji: "🔔",
    size: "medium",
    href: "#",
  },
  {
    name: "Per-company billing",
    description:
      "Each company has its own 14-day trial and subscription. Teammates can share one company.",
    emoji: "🏢",
    size: "medium",
    href: "#",
  },
];

export const faqs = [
  {
    id: 1,
    question: "Which companies are supported?",
    answer:
      "Any UK company registered at Companies House. You only need its registration number.",
  },
  {
    id: 2,
    question: "How often is my company checked?",
    answer:
      "Automatically every six hours while your trial or subscription is active. You can also press “Sync now” on the company page at any time.",
  },
  {
    id: 3,
    question: "Is this legal advice?",
    answer:
      "No. Findings are AI-generated guidance to help you spot issues early. For decisions about insolvency, filings or disputes, speak to a qualified professional.",
  },
  {
    id: 4,
    question: "What happens when my trial ends?",
    answer:
      "Monitoring pauses until you subscribe. Your existing findings stay visible. Owners and admins can subscribe from the company page.",
  },
  {
    id: 5,
    question: "Where does the data come from?",
    answer:
      "Public records from Companies House and The Gazette. We search The Gazette for notices that mention your company number or name.",
    href: "https://www.thegazette.co.uk",
  },
];

export const footerNavigation = {
  app: [
    { name: "Companies", href: "/companies" },
    { name: "Pricing", href: "/pricing" },
  ],
  company: [
    {
      name: "Companies House",
      href: "https://www.gov.uk/government/organisations/companies-house",
    },
    { name: "The Gazette", href: "https://www.thegazette.co.uk" },
    { name: "Privacy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ],
};
EOF