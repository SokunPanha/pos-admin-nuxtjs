import { type FilterSchemaItem, type ProTableOptions } from "./type";
import type { ColumnDef } from "@tanstack/vue-table";
import type { ProTableColumn } from "./useTableColumns";

export const defineFilter = (filter: FilterSchemaItem[]) => {
  return filter;
};

export const defineColumns = (columns: ColumnDef<any>[]) => {
  return columns;
};

/**
 * Define ProTable columns with additional metadata
 */
export const defineProTableColumns = (columns: ProTableColumn[]) => {
  return columns;
};

/**
 * Define ProTable options
 */
export const defineProTableOptions = (options: ProTableOptions) => {
  return options;
};