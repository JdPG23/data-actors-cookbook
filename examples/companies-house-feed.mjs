// UK Company Data (Companies House) — KYC-grade company checks: profile, officers, beneficial owners, charges, filings + risk flags.
// Docs & pricing: https://apify.com/jdepablos/companies-house-feed
const token = process.env.APIFY_TOKEN;
if (!token) throw new Error('Set APIFY_TOKEN (free account at https://apify.com)');

const res = await fetch(
  'https://api.apify.com/v2/acts/jdepablos~companies-house-feed/run-sync-get-dataset-items?timeout=300',
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
  "companies": [
    "00502851",
    "Tesco"
  ]
}),
  },
);
const items = await res.json();
console.log(JSON.stringify(items, null, 2));
