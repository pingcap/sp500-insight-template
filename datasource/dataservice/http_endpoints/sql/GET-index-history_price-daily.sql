use sp500insight;

SELECT record_date, price
FROM index_price_history
WHERE record_date BETWEEN DATE(${start_date}) AND DATE(${end_date})
  AND index_symbol = ${index_symbol}
ORDER BY record_date DESC;
