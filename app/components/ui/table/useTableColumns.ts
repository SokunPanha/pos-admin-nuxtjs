import { ref, computed, watch, type Ref } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";

export type ProTableColumn = ColumnDef<any, any> & {
  hideInTable?: boolean;  // Default hidden
  title?: string;          // Display name in settings
  fixed?: boolean;         // Cannot be hidden
};

const STORAGE_KEY_PREFIX = "pro-table-columns-";

export function useTableColumns(
  columns: Ref<ProTableColumn[]> | ProTableColumn[],
  tableId?: string, // Unique ID for localStorage
) {
  const columnsRef = ref(columns) as Ref<ProTableColumn[]>;

  // Column visibility state
  const columnVisibility = ref<Record<string, boolean>>({});

  // Column order state (array of accessor keys)
  const columnOrder = ref<string[]>([]);

  // Initialize visibility and order from localStorage or defaults
  const initializeColumns = () => {
    const cols = columnsRef.value;

    // Try to load from localStorage
    if (tableId && typeof window !== "undefined") {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${tableId}`);
      if (stored) {
        try {
          const { visibility, order } = JSON.parse(stored);
          columnVisibility.value = visibility || {};
          columnOrder.value = order || [];
          return;
        } catch (e) {
          console.warn("Failed to parse stored column settings", e);
        }
      }
    }

    // Initialize defaults
    const visibility: Record<string, boolean> = {};
    const order: string[] = [];

    cols.forEach((col: any) => {
      const key = (col.accessorKey as string) || col.id || "";
      if (key) {
        // Set visibility (default to true unless hideInTable is set)
        visibility[key] = !col.hideInTable;
        order.push(key);
      }
    });

    columnVisibility.value = visibility;
    columnOrder.value = order;
  };

  // Save to localStorage
  const saveToLocalStorage = () => {
    if (tableId && typeof window !== "undefined") {
      const data = {
        visibility: columnVisibility.value,
        order: columnOrder.value,
      };
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${tableId}`, JSON.stringify(data));
    }
  };

  // Watch for changes and save
  watch([columnVisibility, columnOrder], () => {
    saveToLocalStorage();
  }, { deep: true });

  // Get visible columns in correct order
  const visibleColumns = computed(() => {
    const cols = columnsRef.value;
    const orderedCols: ProTableColumn[] = [];

    // First, add columns in the saved order
    columnOrder.value.forEach((key) => {
      const col = cols.find(
        (c: any) => (c.accessorKey as string) === key || c.id === key
      );
      if (col && columnVisibility.value[key] !== false) {
        orderedCols.push(col);
      }
    });

    // Then add any new columns that aren't in the order array
    cols.forEach((col: any) => {
      const key = (col.accessorKey as string) || col.id || "";
      if (key && !columnOrder.value.includes(key)) {
        if (columnVisibility.value[key] !== false) {
          orderedCols.push(col);
        }
      }
    });

    return orderedCols;
  });

  // Get all columns with visibility info (for settings UI)
  const columnsWithVisibility = computed(() => {
    return columnsRef.value.map((col: any) => {
      const key = (col.accessorKey as string) || col.id || "";
      const headerValue = typeof col.header === "function" ? "" : col.header;
      return {
        ...col,
        key,
        visible: columnVisibility.value[key] !== false,
        title: col.title || headerValue?.toString() || key,
      };
    });
  });

  // Toggle column visibility
  const toggleColumn = (columnKey: string) => {
    const col = columnsRef.value.find(
      (c: any) => (c.accessorKey as string) === columnKey || c.id === columnKey
    );

    // Don't toggle if column is fixed
    if (col?.fixed) return;

    columnVisibility.value[columnKey] = !columnVisibility.value[columnKey];
  };

  // Set column visibility
  const setColumnVisibility = (columnKey: string, visible: boolean) => {
    const col = columnsRef.value.find(
      (c: any) => (c.accessorKey as string) === columnKey || c.id === columnKey
    );

    if (col?.fixed) return;

    columnVisibility.value[columnKey] = visible;
  };

  // Reorder columns
  const reorderColumns = (newOrder: string[]) => {
    columnOrder.value = newOrder;
  };

  // Reset to defaults
  const resetColumns = () => {
    const cols = columnsRef.value;
    const visibility: Record<string, boolean> = {};
    const order: string[] = [];

    cols.forEach((col: any) => {
      const key = (col.accessorKey as string) || col.id || "";
      if (key) {
        visibility[key] = !col.hideInTable;
        order.push(key);
      }
    });

    columnVisibility.value = visibility;
    columnOrder.value = order;
  };

  // Show all columns
  const showAllColumns = () => {
    const cols = columnsRef.value;
    cols.forEach((col: any) => {
      const key = (col.accessorKey as string) || col.id || "";
      if (key) {
        columnVisibility.value[key] = true;
      }
    });
  };

  // Initialize on mount
  initializeColumns();

  return {
    columnVisibility,
    columnOrder,
    visibleColumns,
    columnsWithVisibility,
    toggleColumn,
    setColumnVisibility,
    reorderColumns,
    resetColumns,
    showAllColumns,
  };
}
