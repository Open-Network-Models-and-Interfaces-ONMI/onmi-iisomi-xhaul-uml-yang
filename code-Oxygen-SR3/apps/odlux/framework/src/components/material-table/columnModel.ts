
import * as React from 'react';

export enum ColumnType {
  text,
  numeric,
  custom
}

type CustomControl = {
  rowData: {}
}

export type ColumnModel = {
  property: string ;
  title?: string;
  type?: ColumnType;
  disablePadding?: boolean;
  width?: string | number;
  disableSorting?: boolean;
  disableFilter?: boolean;
  customControl?: React.ComponentType<CustomControl>;  
}