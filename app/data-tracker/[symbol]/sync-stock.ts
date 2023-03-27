import {Stock} from '../dao/base';
import {insertStocks} from '../dao/stock';

export async function requestStockInfoAndSave(symbol: string): Promise<Stock[]> {
    let url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&`+
    `symbol=${symbol}&interval=1min&apikey=${process.env.ALPLA_VANTAGE_API_KEY}&`+
    `datatype=json&outputsize=full`

    const res = await fetch(url, {cache: "no-cache"});
    const respData = await res.json();

    let stocks: Stock[] = [];
    Object.keys(respData["Time Series (1min)"]).forEach(timeStr => {
        let value: {
            "1. open": string,
            "2. high": string,
            "3. low": string,
            "4. close": string,
            "5. volume": string
        } = respData["Time Series (1min)"][timeStr];
        stocks.push({
            symbol: symbol,
            time: timeStr,
            open: parseFloat(value["1. open"]),
            high: parseFloat(value["2. high"]),
            low: parseFloat(value["3. low"]),
            close: parseFloat(value["4. close"]),
            volume: parseFloat(value["5. volume"])
        });
    });
    await insertStocks(stocks);

    return stocks;
}