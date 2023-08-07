use sp500insight;

WITH weekly AS (SELECT record_date,
                       YEAR(record_date)                                                  AS y,
                       WEEK(record_date)                                                  AS w,
                       WEEKDAY(record_date)                                               AS d,
                       FIRST_VALUE(`close`)
                                   OVER (
                                     PARTITION BY
                                       YEAR(record_date),
                                       WEEK(record_date)
                                     ORDER BY WEEKDAY(record_date) DESC
                                     )                                                    AS close,
                       FIRST_VALUE(`adj_close`)
                                   OVER (
                                     PARTITION BY
                                       YEAR(record_date),
                                       WEEK(record_date)
                                     ORDER BY WEEKDAY(record_date) DESC
                                     )                                                    AS adj_close,
                       FIRST_VALUE(`open`) OVER (
                         PARTITION BY
                           YEAR(record_date),
                           WEEK(record_date)
                         ORDER BY WEEKDAY(record_date))                                   AS open,
                       MIN(low) OVER (PARTITION BY YEAR(record_date), WEEK(record_date))  AS low,
                       MAX(high) OVER (PARTITION BY YEAR(record_date), WEEK(record_date)) AS high,
                       ROW_NUMBER() OVER (PARTITION BY
                         YEAR(record_date),
                         WEEK(record_date)
                         ORDER BY WEEKDAY(record_date) DESC)                              AS _row
                FROM stock_price_history
                WHERE record_date BETWEEN DATE(${start_date}) AND DATE(${end_date})
                  AND stock_symbol = ${stock_symbol})
SELECT record_date, open, close, low, high, adj_close
FROM weekly
WHERE _row = 1
ORDER BY 1;
