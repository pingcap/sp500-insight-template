use sp500insight;
SELECT sector,
       COUNT(*)                                                                      AS companies,
       ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC )                                   AS companies_ranking,
       SUM(market_cap)                                                               AS total_market_cap,
       ROW_NUMBER() OVER (ORDER BY SUM(market_cap) DESC )                            AS total_market_cap_ranking,
       SUM(revenue_growth * weight) / SUM(weight)                                    AS avg_revenue_growth,
       ROW_NUMBER() OVER (ORDER BY SUM(revenue_growth * weight) / SUM(weight) DESC ) AS avg_revenue_growth_ranking
FROM companies
       LEFT JOIN index_compositions ic ON companies.stock_symbol = ic.stock_symbol
WHERE ic.index_symbol = ${index_symbol}
GROUP BY sector
ORDER BY 5 ASC