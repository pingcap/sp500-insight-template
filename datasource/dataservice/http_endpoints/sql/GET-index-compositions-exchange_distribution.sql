use sp500insight;
SELECT
    exchange_symbol,
    COUNT(*) AS companies
FROM
    companies c
WHERE
    stock_symbol IN (SELECT stock_symbol FROM index_compositions WHERE index_symbol = ${index_symbol})
GROUP BY
    exchange_symbol
ORDER BY
    companies DESC