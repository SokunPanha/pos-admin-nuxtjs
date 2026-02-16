import type { VNode } from "vue";

export const TableFilterType = {
  TEXT: "text",
  NUMBER: "number",
  SELECT: "select",
  SELECT_MENU: "selectMenu",
  TEXTAREA: "textarea",
  CHECKBOX: "checkbox",
  TOGGLE: "toggle",
  DATE: "date",
  DATE_RANGE: "dateRange",
  RADIO: "radio",
  CUSTOM: "custom",
} as const;


export interface FilterFieldType {
  label: string;
  index: string;
  valueType: FilterTypeValue;
  options?: { label: string; value: string }[];
  render?: (filter: Record<string, any>) => VNode;
}
export interface TablePaginationType {
  paginationOptions?: number[];
  onPageChange?: (page: number) => void;

}


export type FilterTypeValue = (typeof TableFilterType)[keyof typeof TableFilterType];

export interface FilterSchemaItem {
  label: string;
  index: string;
  valueType: FilterTypeValue;
  options?: { label: string; value: string }[];
  render?: (filter: Record<string, any>) => VNode;
}

// ProTable specific types
export type DensityType = "compact" | "default" | "comfortable";

export interface ToolbarOptions {
  reload?: boolean;
  export?: boolean;
  density?: boolean;
  columnSettings?: boolean;
  fullscreen?: boolean;
}

export interface RowSelectionOptions {
  onChange?: (selectedRows: any[], selectedRowKeys: (string | number)[]) => void;
  selectedRowKeys?: (string | number)[];
  getRowKey?: (row: any) => string | number;
}

export interface ProTableOptions {
  toolbar?: boolean | ToolbarOptions;
  rowSelection?: boolean | RowSelectionOptions;
  defaultDensity?: DensityType;
  exportFilename?: string;
  tableId?: string; // Unique ID for localStorage persistence
}
