# One API Call to Price Any Luxury Watch (Median, Percentiles, Market Depth)

> Originally published [on dev.to](https://dev.to/jdpg23/one-api-call-to-price-any-luxury-watch-median-percentiles-market-depth-4odn).

Every watch-price tool I found gives you the same thing: a pile of raw listings. Scrape Chrono24, get 60 JSON objects, and now *you* write the median logic, *you* filter out the "strap only" listings poisoning your stats, *you* figure out that the first cards on the page are promoted ads for a different model entirely.

I wanted the opposite: **one call in, one market analysis out.** So I built it.

## What "analyzed" means

Ask for `"Rolex Submariner 16610"` and you get back a single structured answer:

```json
{
  "analysis": {
    "n": 46,
    "currency": "EUR",
    "median": 9150,
    "p10": 8000, "p25": 8690, "p75": 11400, "p90": 13465,
    "priceBasis": "asking",
    "marketDepth": 1181,
    "certifiedSharePct": 21.7,
    "dealerCountryMix": [
      { "country": "IT", "count": 10 },
      { "country": "ES", "count": 7 }
    ],
    "confidence": "high"
  }
}
```

Plus the cleaned comps behind every number, so you can audit the math.

The cleaning is where the real work happens. Before any statistics run, the pipeline drops:

- **Promoted cards.** On chrono24.com they can be up to two thirds of the page, and they are often a *different model* than what you searched.
- **Accessories.** A "strap for Submariner" contains every token of your query and costs 95% less. Keyword matching fails here: in watch land, "Blue Dial" and "Box & Papers" are descriptors of a complete watch, not accessory listings. The filter is positional instead: a title that *starts* with "strap", or matches "bezel **for** ...", is an accessory; a title that merely *mentions* a bezel is not.
- **Parts, defective, replica listings and duplicates.**

Skip the cleaning and your median moves by hundreds of euros. I measured it.

## Honest data: asks, not sales

Every price here is a live **asking price** (`priceBasis: "asking"` is stamped on every response). Asking prices tell you where the market is priced *today*: what you'd pay right now, how deep supply is (`marketDepth`), how spread the market is (`p10` to `p90`).

What they don't tell you is what buyers actually pay. For that you want confirmed sales, like eBay sold listings. Comparing the two gives you the ask-vs-sold gap, which is where negotiation lives. (I run a [sold-side appraiser](https://apify.com/jdepablos/ebay-sold-price-appraiser) for exactly that; point both at the same model and you have both sides of the market.)

Tools that blur this distinction produce numbers that look precise and mean nothing. Label your price basis.

## Try it

The analyzer runs on Apify as [chrono24-watch-analyzer](https://apify.com/jdepablos/chrono24-watch-analyzer). One HTTP call:

```bash
curl -s -X POST \
  "https://api.apify.com/v2/acts/jdepablos~chrono24-watch-analyzer/run-sync-get-dataset-items?token=$APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "Omega Speedmaster Professional", "domain": "chrono24.com"}'
```

Batch mode takes up to 25 models per run. Six Chrono24 domains are supported (`.com`/`.es`/`.de`/`.fr`/`.it`/`.co.uk`), which sets the currency.

Pricing is per analysis ($0.02, comps included), and an analysis that returns no data is never charged. That last part took real plumbing: the actor distinguishes "this query genuinely has zero listings" from "the site soft-blocked this request", retries the latter with a different proxy, and only bills when you get numbers.

## Wiring it into an AI agent (MCP)

If you're building agents, this is one line of config via Apify's MCP server:

```plaintext
https://mcp.apify.com?tools=jdepablos/chrono24-watch-analyzer
```

Your agent gets a `chrono24-watch-analyzer` tool that answers "what's this watch worth on the open market?" with structured, self-describing data. No pagination, no post-processing, no HTML. The output schema ships with the actor, so the agent knows what `marketDepth` and `certifiedSharePct` mean without you writing glue.

Agent use cases I'm already seeing work:

- **Deal triage**: agent receives a watch listing (marketplace, auction, classifieds), pulls the ask distribution, flags anything under `p25` for human review.
- **Collection valuation**: batch-run 25 references, sum medians, track weekly.
- **Negotiation prep**: `median` and `p10` in hand before you make an offer.

## What I learned building it

Two bugs worth sharing so you don't repeat them:

1. **Regex money parsing**: my price regex `\d{1,3}(?:[.,\s]\d{3})*` silently truncated "5590 €" to "559". The first alternative matched a prefix and stopped. Chrono24 omits decimals and thousands separators under 10k; eBay always emits decimals, so the same bug sat latent in another parser for weeks. Make the thousands group mandatory (`+`) and fall through to plain `\d+`.
2. **Keyword-based accessory filters break on watches**: "Box & Papers" is a *good* sign in a watch listing, not an accessory. Domain vocabulary matters; test your filters against real cards before trusting your medians.

Questions, feature requests (multi-page sampling and reference-number input are next), weird edge cases: comments are open.
