use sp500insight;
WITH last_days AS (SELECT FIRST_VALUE(record_date)
                                      OVER (
                                        PARTITION BY
                                          YEAR(record_date),
                                          WEEK(record_date)
                                        ORDER BY WEEKDAY(record_date) DESC
                                        ) AS day
                   FROM index_price_history)
SELECT record_date, price
FROM index_price_history
WHERE record_date IN (SELECT day FROM last_days)
  AND record_date BETWEEN DATE(${start_date}) AND DATE(${end_date})
  AND index_symbol = ${index_symbol}
ORDER BY record_date DESC;
