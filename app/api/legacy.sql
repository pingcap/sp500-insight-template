-- Not used SQL before

-- indexes/[symbol]/sector_comparison
SELECT
  sector,
  COUNT(*) AS companies,
  SUM(market_cap) AS total_market_cap,
  AVG(revenue_growth) AS avg_revenue_growth
FROM companies c
WHERE
    stock_symbol IN (SELECT stock_symbol FROM index_compositions WHERE index_symbol = ?)
GROUP BY sector
ORDER BY avg_revenue_growth DESC

-- indexes/[symbol]
SELECT index_symbol, short_name
FROM indexes
WHERE
    index_symbol = ?
