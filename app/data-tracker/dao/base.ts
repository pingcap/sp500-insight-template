import {createConnection, Connection, RowDataPacket} from 'mysql2/promise';

export interface Stock {
    symbol: string;
    time: string;
    high: number;
    low: number;
    open: number;
    close: number;
    volume: number;
}

export interface Symbol {
    symbol: string;
    createdDate: Date;
    updatedDate: Date;
}

export function getConnection(): Promise<Connection> {
    return createConnection(process.env.DATABASE_URL || "mysql://root:@localhost:4000/sp500insight");
}