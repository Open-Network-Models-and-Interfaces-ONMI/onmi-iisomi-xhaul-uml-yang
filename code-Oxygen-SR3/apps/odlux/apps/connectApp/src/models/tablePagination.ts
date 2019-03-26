/**
* Represents Table pagination.
*/
export interface IEnhancedTablePage {
  classes: any,
  count: number,
  onChangePage: Function,
  page: number,
  rowsPerPage: number,
  theme: any
}
