# Data Actors Cookbook

Ready-to-run examples for a portfolio of **pay-per-event data APIs** (Apify Actors) built on official sources — company registries, court auctions, trademark offices, SEC filings, clinical trials and second-hand marketplaces. Every Actor returns clean, typed JSON and is exposed as an **MCP tool** for AI agents.

| Actor | What it answers | Try it |
|---|---|---|
| [eBay Sold Price Appraiser](https://apify.com/jdepablos/ebay-sold-price-appraiser) | Real market value of any item from confirmed eBay sold listings — median, percentiles, trend, liquidity + cleaned comps. | [`examples/ebay-sold-price-appraiser.mjs`](examples/ebay-sold-price-appraiser.mjs) |
| [Second-hand Deal Scanner EU](https://apify.com/jdepablos/second-hand-deal-scanner-es) | Underpriced Vinted/Wallapop/Milanuncios listings vs real eBay sold prices, ranked by estimated resale profit (ES/FR/DE/IT/UK). | [`examples/second-hand-deal-scanner-es.mjs`](examples/second-hand-deal-scanner-es.mjs) |
| [Spanish Company Feed (BORME)](https://apify.com/jdepablos/borme-company-feed) | Daily structured feed of Spanish Companies Registry acts: incorporations, dissolutions, insolvencies. | [`examples/borme-company-feed.mjs`](examples/borme-company-feed.mjs) |
| [Spain Public Auctions (BOE)](https://apify.com/jdepablos/spain-boe-auctions) | Judicial & tax auctions with auction value, cadastral reference, charges and market comparison. | [`examples/spain-boe-auctions.mjs`](examples/spain-boe-auctions.mjs) |
| [Global Trademark Watch](https://apify.com/jdepablos/trademark-watch-tmview) | New trademark filings across USPTO, EUIPO, WIPO and 70+ offices, with opposition deadlines. | [`examples/trademark-watch-tmview.mjs`](examples/trademark-watch-tmview.mjs) |
| [Insider Trading Feed (SEC Form 4)](https://apify.com/jdepablos/insider-trading-feed) | Insider buys & sells for any US-listed stock, with roles, share counts and totals. | [`examples/insider-trading-feed.mjs`](examples/insider-trading-feed.mjs) |
| [Clinical Trials Watch](https://apify.com/jdepablos/clinical-trials-watch) | New & updated clinical trials by condition, sponsor or drug, from the official registry. | [`examples/clinical-trials-watch.mjs`](examples/clinical-trials-watch.mjs) |
| [Startup Funding Feed (SEC Form D)](https://apify.com/jdepablos/startup-funding-feed) | US private funding rounds from the primary regulatory source — days before the press. | [`examples/startup-funding-feed.mjs`](examples/startup-funding-feed.mjs) |

## Run any example

```bash
export APIFY_TOKEN=your_token   # free account: https://apify.com
node examples/ebay-sold-price-appraiser.mjs
```

Each example uses the plain [run-sync API](https://docs.apify.com/api/v2) — no SDK required.

## Use from AI agents (MCP)

Every Actor is a tool on the [Apify MCP Server](https://mcp.apify.com). One config exposes any of them to Claude, Cursor or any MCP client:

```json
{
  "mcpServers": {
    "data-tools": {
      "url": "https://mcp.apify.com?tools=jdepablos/startup-funding-feed,jdepablos/insider-trading-feed,jdepablos/trademark-watch-tmview",
      "headers": { "Authorization": "Bearer <APIFY_TOKEN>" }
    }
  }
}
```

## Tutorials

- [How to Track US Startup Funding Rounds in Real Time (SEC Form D)](tutorials/track-startup-funding-rounds-sec-form-d.md)
- [Finding Underpriced Items on Vinted Using Real eBay Sold Prices](tutorials/find-underpriced-items-vinted-ebay-sold-prices.md)
- [How to Track Insider Trading for Any Stock (SEC Form 4)](tutorials/track-insider-trading-sec-form-4.md)

## Design principles

- **Official / primary sources** wherever they exist (SEC EDGAR, BOE, TMview, ClinicalTrials.gov) — stable formats, no anti-bot games.
- **Answers, not raw listings**: valuation stats instead of scraped rows, deals ranked by profit, filings parsed into transactions.
- **Pay-per-event**: a flat fee per unit of value (an appraisal, a filing, a scan). Failed items are never charged.
- **Agent-native**: typed output schemas, MCP-ready, defaults that work with zero configuration.
