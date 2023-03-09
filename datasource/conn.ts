import mysql from 'mysql2/promise';

export const conn = mysql.createPool({
  uri: process.env.DATABASE_URL,
  decimalNumbers: true,
});