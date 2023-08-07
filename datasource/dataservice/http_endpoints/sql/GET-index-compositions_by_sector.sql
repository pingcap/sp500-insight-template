use sp500insight;
WITH index_companies AS (
    SELECT
        c.stock_symbol,
        c.short_name,
        c.exchange_symbol,
        ic.weight,
        c.market_cap AS market_cap,
        c.revenue_growth AS revenue_growth
    FROM companies c
    JOIN index_compositions ic ON c.stock_symbol = ic.stock_symbol
    WHERE index_symbol = ${index_symbol} AND sector = ${sector}
), companies_latest_price AS (
    SELECT
        stock_symbol, DATE(last_day) AS last_change_day, last_close_price, last_2nd_close_price, 
             last_close_price - last_2nd_close_price                          AS last_change,
  (last_close_price - last_2nd_close_price) / last_2nd_close_price AS last_change_percentage
    FROM (
      SELECT
        LAST_VALUE(stock_symbol) OVER (PARTITION BY stock_symbol ORDER BY record_date) AS stock_symbol,
        LAST_VALUE(record_date) OVER (PARTITION BY stock_symbol ORDER BY record_date) AS last_day,
        NTH_VALUE(close, 1) OVER (PARTITION BY stock_symbol ORDER BY record_date DESC) AS last_close_price,
        NTH_VALUE(close, 2) OVER (PARTITION BY stock_symbol ORDER BY record_date DESC) AS last_2nd_close_price,
        ROW_NUMBER() OVER (PARTITION BY stock_symbol ORDER BY record_date DESC) AS row_num
      FROM stock_price_history sph
      WHERE
        record_date > DATE_SUB((SELECT MAX(record_date) FROM stock_price_history), INTERVAL 2 DAY)
        AND sph.stock_symbol IN (SELECT stock_symbol FROM index_companies ic)
    ) sub
    WHERE
        row_num = 2
)
SELECT
    ic.stock_symbol,
    ic.exchange_symbol,
    ic.short_name,
    ic.weight,
  ic.market_cap,
  ic.revenue_growth,
  clp.last_change,
    clp.last_change_day,
    clp.last_close_price,
    clp.last_2nd_close_price,
    clp.last_change_percentage
  
FROM index_companies ic
LEFT JOIN companies_latest_price clp ON ic.stock_symbol = clp.stock_symbol
ORDER BY ic.weight DESC