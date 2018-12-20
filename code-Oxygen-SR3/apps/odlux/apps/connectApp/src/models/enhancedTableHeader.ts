/**
* Represents Header cells.
*/
export interface IHeaderCell {
  id: string,
  numeric: boolean,
  label: string
}

/**
* Represents sortable Header.
*/
export interface IEnhancedTableHeader {
  onRequestSort: Function,
  order: 'asc' | 'desc' | undefined,
  orderBy: string,
  headerColumns: IHeaderCell[]
}
