// Startup Funding Feed (SEC Form D) — US private funding rounds from the primary regulatory source — days before the press.
// Docs & pricing: https://apify.com/jdepablos/startup-funding-feed
const token = process.env.APIFY_TOKEN;
if (!token) throw new Error('Set APIFY_TOKEN (free account at https://apify.com)');

const res = await fetch(
  'https://api.apify.com/v2/acts/jdepablos~startup-funding-feed/run-sync-get-dataset-items?timeout=300',
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
  "daysBack": 7,
  "states": [
    "CA",
    "NY"
  ],
  "minAmountSold": 1000000
}),
  },
);
const items = await res.json();
console.log(JSON.stringify(items, null, 2));
