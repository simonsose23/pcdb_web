export type Schema = [[key: string], [key: string]];

export type ParsedSchema = Array<Column>;

export interface Column {
  name: string;
  type: string;
}
