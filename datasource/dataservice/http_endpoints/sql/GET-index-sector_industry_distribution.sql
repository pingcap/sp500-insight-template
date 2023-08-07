use sp500insight;
with today_prices as (select *
                          from stock_price_history
                          where record_date = (select max(record_date) from stock_price_history))
    select industry, sector, ic.stock_symbol, c.short_name, c.market_cap, weight, SIGN(tp.close - tp.open) as trend
    from index_compositions ic
             left join companies c on ic.stock_symbol = c.stock_symbol
             left join today_prices tp on c.stock_symbol = tp.stock_symbol
    where ic.index_symbol = ${index_symbol};