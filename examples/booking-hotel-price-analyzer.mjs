// Booking Hotel Price Analyzer — A city's hotel market from Booking — median and percentile prices, supply depth and the hotel list behind them.
// Docs & pricing: https://apify.com/jdepablos/booking-hotel-price-analyzer
const token = process.env.APIFY_TOKEN;
if (!token) throw new Error('Set APIFY_TOKEN (free account at https://apify.com)');

const res = await fetch(
  'https://api.apify.com/v2/acts/jdepablos~booking-hotel-price-analyzer/run-sync-get-dataset-items?timeout=300',
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
  "location": "Madrid"
}),
  },
);
const items = await res.json();
console.log(JSON.stringify(items, null, 2));
