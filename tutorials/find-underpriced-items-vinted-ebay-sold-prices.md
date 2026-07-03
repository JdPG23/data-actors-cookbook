# I Built a Bot That Finds Underpriced Game Consoles on Vinted (Using Real eBay Sold Prices)

*Tags: side-hustle, reselling, api, automation, vinted*

Every reseller knows the feeling: you spot a Game Boy Micro for €100 on Vinted, you're *pretty sure* it flips for more on eBay, but by the time you've checked sold listings, filtered out the broken ones and done the fee math, someone else bought it.

The problem isn't finding listings — it's **valuing them fast**. So I automated the whole loop: scan live listings on Vinted, Wallapop and Milanuncios, value each item against **confirmed eBay sold prices** (not asking prices!), subtract every fee, and return only the listings with real profit in them. This tutorial shows you how to run it yourself in 5 minutes, across Spain, France, Germany, Italy or the UK.

## Why most "deal finding" fails

Three traps kill naive flipping bots:

1. **Asking prices lie.** eBay is full of Game Boy Micros *listed* at €400 that never sell. The only truth is `Sold listings` — what buyers actually paid. Any valuation built on active listings is fantasy.
2. **The junk poisons the math.** "GBA cartridge lot", "Game Boy Micro *stand*", "for parts, not working" — if these enter your average, a €2.50 accessory looks like a 2,000% margin deal. (Ask me how I know.)
3. **Fees eat the spread.** Buyer protection (~5% + €0.70 on Vinted), shipping both ways, ~13% marketplace fees when you resell. A "€50 profit" is often €12 after honest math.

The [Second-hand Deal Scanner EU](https://apify.com/jdepablos/second-hand-deal-scanner-es) Actor handles all three: sold-only valuations, aggressive junk/accessory/price-sanity filters (every rejection is counted so you can audit it), and a fee model you can override.

## Run your first scan

Grab a free [Apify](https://apify.com) API token, then:

```javascript
const res = await fetch(
  'https://api.apify.com/v2/acts/jdepablos~second-hand-deal-scanner-es/run-sync-get-dataset-items?timeout=300',
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.APIFY_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: 'Game Boy Micro',
      country: 'ES',        // or FR, DE, IT, UK
      marginMinPct: 25,     // only show ≥25% estimated margin
    }),
  },
);
console.log(await res.json());
```

A real result from my test runs:

```json
{
  "query": "Game Boy Micro",
  "valuation": { "median": 217.47, "n": 184, "confidence": "high", "currency": "EUR" },
  "deals": [
    {
      "source": "vinted",
      "title": "Game Boy micro en perfecto estado",
      "price": 100,
      "url": "https://www.vinted.es/items/...",
      "economics": {
        "estBuyTotal": 108.70,
        "estResaleNet": 162.92,
        "estProfit": 54.22,
        "estMarginPct": 49.65,
        "verdict": "deal"
      }
    }
  ],
  "meta": {
    "listingsScanned": 89,
    "filteredOut": { "titleMismatch": 21, "accessory": 3, "junk": 2, "suspiciouslyCheap": 5 }
  }
}
```

Read that valuation line: **184 confirmed sales, median €217.47, high confidence**. The console at €100 has ~€54 of profit *after* buyer protection, shipping and resale fees. And look at `filteredOut` — 31 listings were rejected (wrong product, accessories, too-cheap-to-be-real). That's the boring machinery that makes the number trustworthy.

## Build a daily watchlist

The real power move: a watchlist of items you know well, scanned every morning.

```json
{
  "items": [
    { "query": "Game Boy Micro" },
    { "query": "PlayStation Vita OLED", "priceMax": 150 },
    { "query": "iPhone 13 128gb", "marginMinPct": 20 },
    { "query": "Lego 75192", "priceMax": 500 }
  ],
  "country": "ES"
}
```

Schedule it in the Apify Console (Actor → Schedule → daily 8:00), wire the webhook to Telegram or Slack, and you'll wake up to a ranked list of real opportunities. Each item scan costs **$0.04 flat** — a 10-item daily watchlist is ~$12/month, or roughly the profit of one decent flip.

## Cross-border mode

Because valuation and scanning are decoupled, you can hunt arbitrage *between* markets: scan French Vinted but value against German eBay (`country: "FR"`, `marketplaceForComps: "ebay.de"`). Retro games routinely price 15-30% apart between EU markets — that spread is the whole business model for some resellers.

## Let your AI agent do the shopping research

The Actor doubles as an **MCP tool**:

```json
{
  "mcpServers": {
    "deal-scanner": {
      "url": "https://mcp.apify.com?tools=jdepablos/second-hand-deal-scanner-es",
      "headers": { "Authorization": "Bearer <APIFY_TOKEN>" }
    }
  }
}
```

Then: *"Is there any Game Boy Micro under €120 in Spain right now that flips for 30%+? Show the math."* The agent runs the scan and reasons over `economics` — no parsing on your side.

## Honest limitations

- Estimates are estimates: condition, completeness (box/charger) and haggling move the final number. The valuation includes the comp URLs so you can verify before buying.
- Wallapop and Milanuncios are Spain-only; outside Spain the scanner uses the local Vinted.
- Zero deals on most days for most items is *correct behavior* — markets are mostly efficient, and the scanner is honest about it. The profit is in the exceptions, which is why you automate the watching.

## Wrap-up

Stop valuing by gut feel. [Try the Deal Scanner](https://apify.com/jdepablos/second-hand-deal-scanner-es) with a query you know well — the first scan costs 4 cents and will probably teach you something about your market. More copy-paste examples (including the standalone [eBay Sold Price Appraiser](https://apify.com/jdepablos/ebay-sold-price-appraiser) that powers the valuations) live in the [cookbook repo](https://github.com/JdPG23/data-actors-cookbook).
