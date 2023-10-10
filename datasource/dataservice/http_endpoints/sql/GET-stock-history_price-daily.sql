use sp500insight;

SELECT record_date, low, high, open, close, adj_close
FROM stock_price_history
WHERE record_date BETWEEN DATE(${start_date}) AND DATE(${end_date})
  AND stock_symbol = ${stock_symbol}
ORDER BY record_date ASC;
