use sp500insight;
WITH last_1st_price AS (
    SELECT record_date, price
    FROM index_price_history
    WHERE
        index_symbol = ${index_symbol}
        -- TODO: remove
        -- AND record_date > DATE_SUB(NOW(), INTERVAL 3 MONTH)
    ORDER BY record_date DESC
    LIMIT 1
), last_2nd_price AS (
    SELECT record_date, price
    FROM index_price_history
    WHERE
        index_symbol = ${index_symbol}
        -- TODO: remove
        -- AND record_date > DATE_SUB(NOW(), INTERVAL 3 MONTH)
    ORDER BY record_date DESC
    LIMIT 1, 1
)
SELECT
    l1p.record_date AS last_updated_at,
    l1p.price AS last_1st_price,
    l2p.price AS last_2nd_price,
    ((l1p.price - l2p.price) / l2p.price) AS last_changes 
FROM
    last_1st_price l1p, last_2nd_price l2p
