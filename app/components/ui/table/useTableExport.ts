import { ref } from "vue";
import type { ProTableColumn } from "./useTableColumns";

export interface ExportOptions {
  filename?: string;
  includeHeaders?: boolean;
  dateFormat?: string;
}

export function useTableExport() {
  const isExporting = ref(false);

  // Convert value to CSV-safe string
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) {
      return "";
    }

    // Handle dates
    if (value instanceof Date) {
      return value.toISOString();
    }

    // Handle objects/arrays
    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    // Handle strings with special characters
    const stringValue = String(value);
    if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
      // Escape double quotes and wrap in quotes
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  };

  // Extract value from row using column accessor
  const extractValue = (row: any, column: ProTableColumn): any => {
    const col = column as any;
    const accessor = (col.accessorKey || col.id) as string;
    if (!accessor) return "";

    // Support nested accessors like "user.name"
    const keys = accessor.split(".");
    let value = row;
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) break;
    }

    return value;
  };

  // Export data to CSV
  const exportToCSV = (
    data: any[],
    columns: ProTableColumn[],
    options: ExportOptions = {}
  ) => {
    const {
      filename = "table-export.csv",
      includeHeaders = true,
    } = options;

    isExporting.value = true;

    try {
      const rows: string[] = [];

      // Add headers
      if (includeHeaders) {
        const headers = columns.map((col: any) => {
          const headerValue = typeof col.header === "function" ? "" : col.header;
          const header = col.title || headerValue?.toString() || (col.accessorKey as string) || col.id || "";
          return formatValue(header);
        });
        rows.push(headers.join(","));
      }

      // Add data rows
      data.forEach((row) => {
        const values = columns.map((col) => {
          const value = extractValue(row, col);
          return formatValue(value);
        });
        rows.push(values.join(","));
      });

      // Create CSV content
      const csvContent = rows.join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");

      if (link.download !== undefined) {
        // Create download link
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export failed:", error);
      throw error;
    } finally {
      isExporting.value = false;
    }
  };

  // Export current page
  const exportCurrentPage = (
    data: any[],
    columns: ProTableColumn[],
    filename?: string
  ) => {
    return exportToCSV(data, columns, { filename });
  };

  // Export all data (requires all data to be passed)
  const exportAllData = (
    allData: any[],
    columns: ProTableColumn[],
    filename?: string
  ) => {
    return exportToCSV(allData, columns, { filename });
  };

  return {
    isExporting,
    exportToCSV,
    exportCurrentPage,
    exportAllData,
  };
}
