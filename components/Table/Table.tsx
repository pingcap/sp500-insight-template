import { ReactElement } from 'react';

export interface TableProps<T extends Record<string, any>> {
  columns: TableColumn<T, string & keyof T>[];
  rows: T[];
  keyField: keyof T;
}

export type FieldColumn<T, K extends string & keyof T> = {
  custom?: false
  key: K
  title: string
  formatter?: (value: T[K]) => string
  render?: (value: T[K], row: T, index: number) => ReactElement
}

export type CustomColumn<T> = {
  custom: true
  key: string
  title: string
  render: (value: string, row: T, index: number) => ReactElement
}

export type TableColumn<T, K extends string & keyof T> = CustomColumn<T> | FieldColumn<T, K>

const Table = <T extends Record<string, any>> ({ columns, rows, keyField }: TableProps<T>) => {
  return (
    <table>
      <thead>
      <tr>
        {columns.map(column => (
          <th key={column.key}>{renderHeader(column)}</th>
        ))}
      </tr>
      </thead>
      <tbody>
      {rows.map((row, index) => (
        <tr key={String(row[keyField])}>
          {columns.map(column => (
            <td key={column.key}>
              {renderColumn(row, column, index)}
            </td>
          ))}
        </tr>
      ))}
      </tbody>
    </table>
  );
};

function renderHeader (column: TableColumn<any, any>) {
  return <>{column.title}</>;
}

function renderColumn<T> (row: T, column: TableColumn<T, string & keyof T>, index: number) {
  if (column.custom) {
    return column.render(column.key, row, index);
  } else {
    if (column.render) {
      return column.render(row[column.key], row, index);
    } else if (column.formatter) {
      return <>{column.formatter(row[column.key])}</>;
    } else {
      return <>{String(row[column.key] ?? '--')}</>;
    }
  }
}

export default Table;
