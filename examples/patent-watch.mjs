// Patent Watch — New patent publications by keyword or company, worldwide, as structured data.
// Docs & pricing: https://apify.com/jdepablos/patent-watch
const token = process.env.APIFY_TOKEN;
if (!token) throw new Error('Set APIFY_TOKEN (free account at https://apify.com)');

const res = await fetch(
  'https://api.apify.com/v2/acts/jdepablos~patent-watch/run-sync-get-dataset-items?timeout=300',
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
  "term": "solid state battery",
  "daysBack": 90
}),
  },
);
const items = await res.json();
console.log(JSON.stringify(items, null, 2));
