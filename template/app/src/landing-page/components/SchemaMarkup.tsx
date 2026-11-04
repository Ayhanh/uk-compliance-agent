// JSON-LD structured data for SEO. Replace the url placeholders with your production domain.
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://your-saas-app.com/#software",
      name: "UK ComplianceAgent AI",
      description:
        "AI-powered compliance and risk radar for UK limited companies, monitoring Companies House and The Gazette.",
      url: "https://your-saas-app.com",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Cross-platform",
    },
    {
      "@type": "WebSite",
      "@id": "https://your-saas-app.com/#website",
      url: "https://your-saas-app.com",
      name: "UK ComplianceAgent AI",
    },
  ],
};

export function SchemaMarkup() {
  return <script type="application/ld+json">{JSON.stringify(schema)}</script>;
}
