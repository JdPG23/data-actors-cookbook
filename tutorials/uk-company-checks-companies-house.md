# How to Run a KYC-Grade Check on Any UK Company (Companies House, One Call)

*The official UK company register is free and public. This tutorial turns it into a single-call risk report: profile, officers, beneficial owners, charges, filings and computed red flags.*

Before you sign a contract, extend credit, or onboard a supplier in the UK, the facts you need are already public at [Companies House](https://find-and-update.company-information.service.gov.uk/). The catch: they are spread across five different sections per company, the filing descriptions are slugs like `appoint-person-director-company-with-name-date`, and checking a list of 30 vendors by hand is an afternoon of clicking.

The [UK Company Data Actor](https://apify.com/jdepablos/companies-house-feed) collapses all of it into one call per company, and adds the part the register does not give you: **risk flags computed from register facts**.

## One call, one report

```js
const res = await fetch(
  'https://api.apify.com/v2/acts/jdepablos~companies-house-feed/run-sync-get-dataset-items?timeout=300',
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ companies: ['00502851', 'Tesco'] }),
  },
);
```

Numbers or names both work. Names go through the official search and the best match wins (alternatives are logged so you can catch mismatches). Up to 50 companies per run, which is what turns this from a lookup into a **watchlist**.

## What comes back

A real run against Bank of Scotland (`SC327000`) returns, trimmed:

```json
{
  "companyNumber": "SC327000",
  "companyName": "BANK OF SCOTLAND PLC",
  "status": "active",
  "companyAgeYears": 18.8,
  "accounts": { "nextDue": "2027-06-30", "overdue": false },
  "officersCount": { "active": 14, "total": 71 },
  "personsWithSignificantControl": [
    { "name": "HBOS PLC", "naturesOfControl": ["ownership-of-shares-75-to-100-percent"] }
  ],
  "charges": { "total": 29, "outstanding": 16, "satisfied": 13 },
  "totalFilings": 312,
  "riskFlags": ["outstanding-charges:16"]
}
```

## Reading the risk flags

Every flag is a verifiable register fact, not a score. The ones that matter most in practice:

- **`accounts-overdue`** - the loudest free red flag the register gives you. A company late on statutory accounts is telling you something.
- **`outstanding-charges:N`** - registered charges (mortgages, debentures) not yet satisfied. Someone else has a claim on their assets. Normal for banks, worth a question for a small supplier.
- **`insolvency-history`** - past insolvency proceedings on record.
- **`status:dissolved` / `status:liquidation`** - you would be surprised how often a "supplier" fails this one.
- **`no-active-officers`** - a company with zero active directors cannot lawfully be doing much.

Your policy decides what combination is a dealbreaker; the report just makes the facts impossible to miss.

## Scheduling a vendor watchlist

Put your supplier list in `companies`, schedule the Actor daily on Apify, and diff `recentFilings` between runs. New charges, officer resignations, or a status change show up in the feed the day Companies House registers them, not when you next remember to check.

## Cost

$0.005 per company profile delivered. A daily 30-vendor watchlist costs about $4.50 a month. Companies not found are free, and you can bring your own free Companies House API key if you prefer your own rate limit.

Actor: [UK Company Data on Apify](https://apify.com/jdepablos/companies-house-feed) · Runnable example: [`examples/companies-house-feed.mjs`](../examples/companies-house-feed.mjs)
