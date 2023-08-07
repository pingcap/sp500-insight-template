use sp500insight;

SELECT stock_symbol,
           short_name,
           long_name,
           long_business_summary,
           sector,
           industry,
           city,
           state,
           country,
           full_time_employees,
           market_cap,
           revenue_growth,
           ebitda
    FROM companies
    WHERE stock_symbol = ${stock_symbol}
    ;