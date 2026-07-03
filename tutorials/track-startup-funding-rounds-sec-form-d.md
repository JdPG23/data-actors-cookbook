# How to Track US Startup Funding Rounds in Real Time (Before TechCrunch Writes About Them)

*Tags: startups, data, api, sales, webscraping*

Every week, **over 1,300 US companies file a funding round with the SEC** — and most of them never appear in the tech press. If your job involves selling to funded startups, tracking competitors' war chests, or spotting investment trends, you're probably relying on funding newsletters and databases that are days late and hundreds of dollars per seat.

There's a better way: go to the primary source. In this tutorial you'll build a **real-time startup funding feed from SEC Form D filings** — the regulatory document every US company must file when it raises private capital. You'll get exact amounts, industries, locations and investor counts, as clean JSON, for a fraction of a cent per round.

## Why Form D beats funding news

When a startup raises money under Regulation D (the exemption used by virtually all US venture rounds), it must file **Form D** with the SEC within 15 days of the first sale. That filing includes:

- The **exact amount sold so far** — not a journalist's "sources say" estimate
- The total offering size (or whether it's open-ended)
- Industry group, city and state
- Number of investors who participated
- Date of first sale and year of incorporation

Compare that to funding news: TechCrunch covers a tiny, PR-driven slice. Databases like Crunchbase aggregate press and manual research — comprehensive over time, but late and expensive. **Form D is the ground truth both of them chase.**

The catch? EDGAR (the SEC's database) is built for lawyers, not for automation. The filings are XML documents scattered across an archive, discoverable only through a quirky full-text search API with hidden rate limits. That's the part we'll automate.

## The 5-minute setup

We'll use the [Startup Funding Feed](https://apify.com/jdepablos/startup-funding-feed) Actor — it handles EDGAR's discovery API, XML parsing, rate limits and pagination, and returns one JSON record per filing. It's pay-per-event: **$0.002 per filing returned** (a full weekly sweep of all US rounds costs ~$2.60; a filtered slice costs cents). Failed fetches are never charged.

1. Create a free [Apify account](https://apify.com) and grab your API token from Settings → API & Integrations.
2. That's it. No servers, no cron, no XML parsing.

## Your first funding sweep

Let's get every round in California or New York from the last 7 days that already raised at least $1M:

```javascript
const res = await fetch(
  'https://api.apify.com/v2/acts/jdepablos~startup-funding-feed/run-sync-get-dataset-items?timeout=300',
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.APIFY_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      daysBack: 7,
      states: ['CA', 'NY'],
      minAmountSold: 1000000,
      maxFilings: 100,
    }),
  },
);
const rounds = await res.json();
```

Each record looks like this:

```json
{
  "company": "Acme Robotics, Inc.",
  "filedAt": "2026-07-02",
  "industry": "Other Technology",
  "city": "SAN FRANCISCO",
  "stateDescription": "CALIFORNIA",
  "totalOfferingUsd": 15000000,
  "totalSoldUsd": 12500000,
  "investorsCount": 14,
  "minInvestmentUsd": 25000,
  "yearOfIncorporation": "2024",
  "url": "https://www.sec.gov/Archives/edgar/data/..."
}
```

Every record links back to the official SEC document, so anything surprising is one click from verifiable.

## Recipe 1: A weekly leads feed for your CRM

Companies that just raised have two things your sales team loves: **budget and urgency**. A weekly filtered sweep, piped into your CRM, is one of the highest-signal lead sources that exists:

```javascript
// Monday morning: fintech + healthtech rounds over $2M, nationwide
const input = {
  daysBack: 7,
  industries: ['banking', 'insurance', 'health'],
  minAmountSold: 2000000,
  includeAmendments: false,   // only NEW rounds, not updates
};
```

Filter, dedupe against your CRM by company name, and enrich with your usual tools. The `investorsCount` and `minInvestmentUsd` fields are great qualifiers: 40 investors at $25k minimum is a party round; 2 investors at $2M is institutional conviction.

## Recipe 2: Watch your competitive landscape

VCs and corp-dev teams: replace "check Crunchbase weekly" with a filtered feed of your thesis area. Because Form D arrives **before or without press coverage**, you'll regularly see rounds nobody has written about — which is exactly when a cold email is most welcome.

## Recipe 3: Ask your AI agent instead

The Actor is exposed as an **MCP tool**, so agents like Claude can call it directly:

```json
{
  "mcpServers": {
    "funding-feed": {
      "url": "https://mcp.apify.com?tools=jdepablos/startup-funding-feed",
      "headers": { "Authorization": "Bearer <APIFY_TOKEN>" }
    }
  }
}
```

Then just ask: *"Which biotech companies in Massachusetts raised over $5M this month? Give me the SEC links."* The agent picks the filters, runs the feed, and reads the structured output — no glue code.

## Scheduling it (the set-and-forget part)

In the Apify Console, open the Actor → **Schedule**, pick weekly (Mondays 8:00 work well — Form D filings cluster early in the week), and connect the run to wherever you want the data: a webhook to your CRM, a Google Sheet via the integrations tab, or Slack.

Total cost of a serious weekly setup: filtered feeds usually return 20-80 filings → **under $0.20 per week**.

## What you can't get from Form D (honesty section)

- **Valuations** — Form D discloses amounts raised, not share prices.
- **Investor names** — the filing lists officers/directors/promoters, not fund names. (The linked document sometimes reveals more.)
- **Non-US rounds** — this is SEC data; it covers US offerings, including foreign issuers that file with the SEC.

For most sales, research and monitoring workflows, none of that matters: the *who/where/how much/when* is the signal.

## Wrap-up

You now have a primary-source funding feed that runs itself: official data, exact amounts, days ahead of the press, at pay-per-use prices. Try the [Startup Funding Feed on Apify](https://apify.com/jdepablos/startup-funding-feed) — the first runs cost pennies, and the [cookbook repo](https://github.com/JdPG23/data-actors-cookbook) has copy-paste examples for this and seven other official-source data APIs (insider trading, trademarks, clinical trials and more).

Questions or feature requests? The Issues tab on the Actor page gets answered within a day.
