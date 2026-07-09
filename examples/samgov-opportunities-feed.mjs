// US Contract Opportunities Feed (SAM.gov) — Live federal contract opportunities with deadlines, set-asides and official contacts.
// Docs & pricing: https://apify.com/jdepablos/samgov-opportunities-feed
const token = process.env.APIFY_TOKEN;
if (!token) throw new Error('Set APIFY_TOKEN (free account at https://apify.com)');

const res = await fetch(
  'https://api.apify.com/v2/acts/jdepablos~samgov-opportunities-feed/run-sync-get-dataset-items?timeout=300',
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
  "keywords": "cybersecurity",
  "dueWithinDays": 30,
  "maxOpportunities": 10
}),
  },
);
const items = await res.json();
console.log(JSON.stringify(items, null, 2));
