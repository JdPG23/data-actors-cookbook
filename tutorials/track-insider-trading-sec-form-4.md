# How to Track Insider Trading for Any Stock (SEC Form 4, No Bloomberg Required)

*Tags: investing, data, api, fintech, automation*

When a CEO buys their own company's stock with their own money, that's one of the most studied signals in finance. When three executives sell the same week, you'd probably like to know too. This data is public — **every insider transaction at a US-listed company must be filed with the SEC within 2 business days** (Form 4) — but reading it means parsing XML filings scattered across EDGAR.

In this tutorial you'll set up an **insider trading feed for any watchlist of stocks**: structured buys and sells with the insider's role, share counts, prices and totals, delivered as JSON for about a cent per company scanned.

## What Form 4 actually tells you

Every Form 4 contains:

- **Who**: the insider's name and role — director, officer (with title), or 10% owner. A CFO buying is a different signal than a passive fund rebalancing.
- **What**: transaction code. The two that matter: `P` (open-market purchase — the bullish one) and `S` (open-market sale). Grants, option exercises and gifts are usually noise.
- **How much**: shares, price per share, and holdings after the transaction.
- **When**: transaction date, filed within 2 business days.

The signal research is decades deep: insider *cluster buying* (multiple insiders, same window) has historically preceded outperformance. Sales are noisier — executives sell for taxes, houses and divorces — which is why role and context matter.

## The setup (one API call)

The [Insider Trading Feed](https://apify.com/jdepablos/insider-trading-feed) Actor handles EDGAR's quirks (ticker→CIK mapping, rate limits, the XML) and pre-filters to open-market trades. Pay-per-event: **$0.015 per company scanned**, failed tickers never charged.

```javascript
const res = await fetch(
  'https://api.apify.com/v2/acts/jdepablos~insider-trading-feed/run-sync-get-dataset-items?timeout=300',
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.APIFY_TOKEN}`,   // free at apify.com
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tickers: ['NVDA', 'TSLA', 'PLTR'],
      daysBack: 30,
    }),
  },
);
const companies = await res.json();
```

Per company you get a summary plus every filing:

```json
{
  "ticker": "NVDA",
  "company": "NVIDIA CORP",
  "summary": {
    "filings": 7,
    "buys": 1, "sells": 6,
    "buyValueUsd": 1250000.00,
    "sellValueUsd": 410580151.38
  },
  "filings": [
    {
      "filedAt": "2026-06-29",
      "insider": { "name": "STEVENS MARK A", "isDirector": true, "officerTitle": null },
      "transactions": [
        { "code": "P", "type": "buy", "shares": 10000, "pricePerShare": 125.0,
          "valueUsd": 1250000, "sharesOwnedAfter": 11544612 }
      ],
      "url": "https://www.sec.gov/Archives/edgar/data/1045810/..."
    }
  ]
}
```

That `summary` is your screener: `buyValueUsd` vs `sellValueUsd` across your watchlist, one glance.

## Recipe: the weekly insider-sentiment sweep

Run your whole portfolio (up to 25 tickers per run) every Monday and alert on two conditions:

```javascript
for (const c of companies) {
  const netUsd = c.summary.buyValueUsd - c.summary.sellValueUsd;
  const clusterBuy = c.filings.filter(f =>
    f.transactions.some(t => t.type === 'buy') &&
    (f.insider.isOfficer || f.insider.isDirector)
  ).length >= 2;

  if (clusterBuy) alert(`🚨 ${c.ticker}: ${c.summary.buys} insider buys — cluster signal`);
  if (netUsd < -50_000_000) alert(`⚠️ ${c.ticker}: net insider selling $${(-netUsd / 1e6).toFixed(0)}M`);
}
```

Schedule it in the Apify Console (Actor → Schedule → weekly) and pipe the webhook to Slack or Telegram. Cost for a 25-ticker weekly sweep: **$0.375/week**.

## Recipe: ask your AI agent

The Actor is an MCP tool, so agents can call it mid-conversation:

```json
{
  "mcpServers": {
    "insider-feed": {
      "url": "https://mcp.apify.com?tools=jdepablos/insider-trading-feed",
      "headers": { "Authorization": "Bearer <APIFY_TOKEN>" }
    }
  }
}
```

*"Did any NVDA or AMD insiders buy in the last 60 days? Who, and how much?"* — the agent picks the inputs and reasons over the structured answer, sources linked.

## Honest limitations

- **Not investment advice.** Insider activity is one input; plenty of insider buys precede nothing at all.
- **US-listed companies only** (that's who files Form 4).
- Option exercises (`M`) often precede sales mechanically — that's why the default filter is `P` and `S` only; you can widen it.

## Wrap-up

Public regulatory data, structured, on your schedule: [try the Insider Trading Feed](https://apify.com/jdepablos/insider-trading-feed) — a full watchlist scan costs less than a coffee refill. More official-source data APIs (startup funding rounds from Form D, global trademark watching, clinical trials) with copy-paste examples in the [cookbook](https://github.com/JdPG23/data-actors-cookbook).
