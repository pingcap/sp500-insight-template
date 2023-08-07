use sp500insight;
SELECT
    country_code,
    COUNT(*) AS companies
FROM
    companies c
WHERE
    stock_symbol IN (SELECT stock_symbol FROM index_compositions WHERE index_symbol = ${index_symbol})
GROUP BY
    country_code
ORDER BY
    companies DESC