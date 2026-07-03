// Insider Trading Feed (SEC Form 4) — Insider buys & sells for any US-listed stock, with roles, share counts and totals.
// Docs & pricing: https://apify.com/jdepablos/insider-trading-feed
const token = process.env.APIFY_TOKEN;
if (!token) throw new Error('Set APIFY_TOKEN (free account at https://apify.com)');

const res = await fetch(
  'https://api.apify.com/v2/acts/jdepablos~insider-trading-feed/run-sync-get-dataset-items?timeout=300',
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
  "tickers": [
    "NVDA",
    "TSLA"
  ],
  "daysBack": 30
}),
  },
);
const items = await res.json();
console.log(JSON.stringify(items, null, 2));
