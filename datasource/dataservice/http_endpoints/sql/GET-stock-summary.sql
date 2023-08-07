use sp500insight;
    SELECT stock_symbol,
           DATE(last_day)                                                   AS last_change_day,
           last_close_price,
           last_close_price - last_2nd_close_price                          AS last_change,
           last_2nd_close_price,
           (last_close_price - last_2nd_close_price) / last_2nd_close_price AS last_change_percentage,
           short_name,
           exchange_symbol,
           market_cap,
           revenue_growth
    FROM (SELECT LAST_VALUE(sph.stock_symbol) OVER (PARTITION BY sph.stock_symbol ORDER BY record_date) AS stock_symbol,
                 LAST_VALUE(record_date) OVER (PARTITION BY sph.stock_symbol ORDER BY record_date)      AS last_day,
                 NTH_VALUE(close, 1) OVER (PARTITION BY sph.stock_symbol ORDER BY record_date DESC)     AS last_close_price,
                 NTH_VALUE(close, 2) OVER (PARTITION BY sph.stock_symbol ORDER BY record_date DESC)     AS last_2nd_close_price,
                 ROW_NUMBER() OVER (PARTITION BY sph.stock_symbol ORDER BY record_date DESC)            AS row_num,
                 c.short_name                                                                           as short_name,
                 c.exchange_symbol                                                                      as exchange_symbol,
                 c.market_cap AS market_cap,
                 c.revenue_growth AS revenue_growth
          FROM stock_price_history sph
                   left join companies c on sph.stock_symbol = c.stock_symbol
          WHERE record_date > DATE_SUB((SELECT MAX(record_date) FROM stock_price_history), INTERVAL 2 DAY)
            AND sph.stock_symbol = ${stock_symbol}) sub
    WHERE row_num = 2