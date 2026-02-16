import { ref, computed, type Ref } from "vue";

export interface RowSelectionOptions {
  onChange?: (selectedRows: any[], selectedRowKeys: (string | number)[]) => void;
  selectedRowKeys?: (string | number)[];
  getRowKey?: (row: any) => string | number; // Function to get unique key from row
}

export function useTableSelection(
  data: Ref<any[]>,
  options?: RowSelectionOptions,
) {
  const selectedRowKeys = ref<Set<string | number>>(
    new Set(options?.selectedRowKeys || [])
  );

  // Get row key (default to 'id' field or index)
  const getRowKey = (row: any, index: number): string | number => {
    if (options?.getRowKey) {
      return options.getRowKey(row);
    }
    return row.id ?? row._id ?? index;
  };

  // Check if all rows are selected
  const isAllSelected = computed(() => {
    if (data.value.length === 0) return false;
    return data.value.every((row, index) =>
      selectedRowKeys.value.has(getRowKey(row, index))
    );
  });

  // Check if some (but not all) rows are selected
  const isIndeterminate = computed(() => {
    const selectedCount = data.value.filter((row, index) =>
      selectedRowKeys.value.has(getRowKey(row, index))
    ).length;
    return selectedCount > 0 && selectedCount < data.value.length;
  });

  // Get selected rows
  const selectedRows = computed(() => {
    return data.value.filter((row, index) =>
      selectedRowKeys.value.has(getRowKey(row, index))
    );
  });

  // Get selected count
  const selectedCount = computed(() => selectedRowKeys.value.size);

  // Toggle single row selection
  const toggleRow = (row: any, index: number) => {
    const key = getRowKey(row, index);
    if (selectedRowKeys.value.has(key)) {
      selectedRowKeys.value.delete(key);
    } else {
      selectedRowKeys.value.add(key);
    }
    // Trigger callback
    if (options?.onChange) {
      options.onChange(selectedRows.value, Array.from(selectedRowKeys.value));
    }
  };

  // Check if row is selected
  const isRowSelected = (row: any, index: number): boolean => {
    return selectedRowKeys.value.has(getRowKey(row, index));
  };

  // Toggle all rows
  const toggleAll = () => {
    if (isAllSelected.value) {
      // Deselect all
      selectedRowKeys.value.clear();
    } else {
      // Select all
      data.value.forEach((row, index) => {
        selectedRowKeys.value.add(getRowKey(row, index));
      });
    }
    // Trigger callback
    if (options?.onChange) {
      options.onChange(selectedRows.value, Array.from(selectedRowKeys.value));
    }
  };

  // Select specific rows
  const selectRows = (keys: (string | number)[]) => {
    selectedRowKeys.value = new Set(keys);
    if (options?.onChange) {
      options.onChange(selectedRows.value, Array.from(selectedRowKeys.value));
    }
  };

  // Clear selection
  const clearSelection = () => {
    selectedRowKeys.value.clear();
    if (options?.onChange) {
      options.onChange([], []);
    }
  };

  // Select row
  const selectRow = (row: any, index: number) => {
    const key = getRowKey(row, index);
    selectedRowKeys.value.add(key);
    if (options?.onChange) {
      options.onChange(selectedRows.value, Array.from(selectedRowKeys.value));
    }
  };

  // Deselect row
  const deselectRow = (row: any, index: number) => {
    const key = getRowKey(row, index);
    selectedRowKeys.value.delete(key);
    if (options?.onChange) {
      options.onChange(selectedRows.value, Array.from(selectedRowKeys.value));
    }
  };

  return {
    selectedRowKeys: computed(() => Array.from(selectedRowKeys.value)),
    selectedRows,
    selectedCount,
    isAllSelected,
    isIndeterminate,
    toggleRow,
    isRowSelected,
    toggleAll,
    selectRows,
    clearSelection,
    selectRow,
    deselectRow,
  };
}
