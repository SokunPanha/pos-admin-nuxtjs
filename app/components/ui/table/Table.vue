<script setup lang="ts">
import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import {
  type FilterFieldType,
  type TablePaginationType,
  type ProTableOptions,
  type ToolbarOptions,
  type RowSelectionOptions,
  type DensityType,
} from "./type";
import { useTableData } from "./useTableData";
import { useTableFilter } from "./useTableFilter";
import { useTableColumns, type ProTableColumn } from "./useTableColumns";
import { useTableDensity } from "./useTableDensity";
import { useTableFullscreen } from "./useTableFullscreen";
import { useTableSelection } from "./useTableSelection";
import { useTableExport } from "./useTableExport";
import TableToolbar from "./TableToolbar.vue";
import DatePicker from "./DatePicker.vue";
import DateRangePicker from "./DateRangePicker.vue";

const props = defineProps({
  columns: {
    type: Array as () => (ColumnDef<any> | ProTableColumn)[],
    required: false,
  },
  request: {
    type: Function as unknown as PropType<
      (params?: {
        page?: number;
        limit?: number;
        filter?: any;
      }) => Promise<{ data: any[]; total: number; success: boolean } | any>
    >,
    required: false,
  },
  dataSource: {
    type: Array,
    required: false,
  },
  pagination: {
    type: Object as unknown as PropType<TablePaginationType>,
    default: () => ({
      paginationOptions: [10, 20, 50, 100],
    }),
    required: false,
  },
  filterField: {
    type: Object as unknown as PropType<FilterFieldType[]>,
    required: false,
  },
  // ProTable specific props
  toolbar: {
    type: [Boolean, Object] as PropType<boolean | ToolbarOptions>,
    default: true,
  },
  rowSelection: {
    type: [Boolean, Object] as PropType<boolean | RowSelectionOptions>,
    default: false,
  },
  defaultDensity: {
    type: String as PropType<DensityType>,
    default: "default",
  },
  exportFilename: {
    type: String,
    default: "table-export.csv",
  },
  tableId: {
    type: String,
    default: "pro-table",
  },
});

// Data fetching and pagination
const { tableLoading, data, pagination, fetchData } = useTableData(
  props.request,
  props.pagination.paginationOptions,
);

// Filter management
const {
  filter,
  filterItems,
  isCollapseFilter,
  loading,
  onFilter,
  resetFilter,
} = useTableFilter(props.filterField, fetchData);

// Column management
const columnsRef = computed(() => props.columns as ProTableColumn[]);
const {
  visibleColumns,
  columnsWithVisibility,
  toggleColumn,
  reorderColumns,
  resetColumns,
  showAllColumns,
} = useTableColumns(columnsRef, props.tableId);

// Density management
const { density, setDensity, densityOptions, cellClasses, headerClasses } =
  useTableDensity(props.defaultDensity, props.tableId);

// Fullscreen management
const {
  isFullscreen,
  toggleFullscreen,
  containerClasses,
  fullscreenIcon,
  fullscreenTooltip,
} = useTableFullscreen();

// Row selection management
const selectionOptions = computed<RowSelectionOptions | undefined>(() => {
  if (!props.rowSelection) return undefined;
  if (typeof props.rowSelection === "boolean") {
    return {};
  }
  return props.rowSelection;
});

const {
  selectedRows,
  selectedCount,
  isAllSelected,
  isIndeterminate,
  toggleRow,
  isRowSelected,
  toggleAll,
} = useTableSelection(data, selectionOptions.value);

// Export management
const { isExporting, exportCurrentPage } = useTableExport();

// Watch pagination changes
watch(
  () => [pagination.value.page, pagination.value.limit],
  () => fetchData(filter),
);

// Computed columns with selection column if needed
const finalColumns = computed(() => {
  const cols = [...visibleColumns.value];

  // Add selection column if row selection is enabled
  if (props.rowSelection) {
    const selectionColumn: any = {
      id: "selection",
      accessorKey: "_selection",
      fixed: true,
      header: () =>
        h("div", { class: "flex items-center justify-center" }, [
          h("input", {
            type: "checkbox",
            class: "h-4 w-4 rounded border-gray-300 cursor-pointer",
            checked: isAllSelected.value,
            indeterminate: isIndeterminate.value,
            onChange: toggleAll,
          }),
        ]),
      cell: ({ row }: any) => {
        const index = row.index;
        const rowData = row.original;
        return h("div", { class: "flex items-center justify-center" }, [
          h("input", {
            type: "checkbox",
            class: "h-4 w-4 rounded border-gray-300 cursor-pointer",
            checked: isRowSelected(rowData, index),
            onChange: () => toggleRow(rowData, index),
          }),
        ]);
      },
      meta: {
        class: {
          th: "w-12 text-center " + headerClasses.value,
          td: "w-12 text-center " + cellClasses.value,
        },
      },
    };
    cols.unshift(selectionColumn);
  }

  return cols;
});

// Apply density classes to all columns
const columnsWithDensity = computed(() => {
  return finalColumns.value.map((col: any) => ({
    ...col,
    meta: {
      ...col.meta,
      class: {
        th:
          (col.meta?.class?.th || "") +
          " " +
          (!col.id || col.id !== "selection" ? headerClasses.value : ""),
        td:
          (col.meta?.class?.td || "") +
          " " +
          (!col.id || col.id !== "selection" ? cellClasses.value : ""),
      },
    },
  }));
});

// Toolbar handlers
const handleReload = async () => {
  await fetchData(filter);
};

const handleExport = () => {
  exportCurrentPage(data.value, visibleColumns.value, props.exportFilename);
};
</script>

<template>
  <div :class="[containerClasses, 'h-screen overflow-hidden']">
    <main class="p-10 h-full flex flex-col">
      <!-- Toolbar -->
      <TableToolbar
        v-if="toolbar"
        :options="toolbar"
        :on-reload="handleReload"
        :reloading="tableLoading"
        :on-export="handleExport"
        :exporting="isExporting"
        :density="density"
        :density-options="densityOptions"
        :on-density-change="setDensity"
        :columns="columnsWithVisibility"
        :on-column-toggle="toggleColumn"
        :on-column-reorder="reorderColumns"
        :on-columns-reset="resetColumns"
        :on-show-all-columns="showAllColumns"
        :is-fullscreen="isFullscreen"
        :fullscreen-icon="fullscreenIcon"
        :fullscreen-tooltip="fullscreenTooltip"
        :on-toggle-fullscreen="toggleFullscreen"
        :selected-count="selectedCount"
      >
        <template #toolbar-actions>
          <slot name="toolbar-actions" />
        </template>
      </TableToolbar>

      <!-- Filter Form -->
      <header v-if="filterField && filterField.length > 0">
        <div
          class="flex justify-between items-end border-b border-accented py-3.5 px-4"
        >
          <div class="flex gap-3 flex-wrap flex-1">
            <div
              v-for="item in filterItems"
              :key="item.index"
              class="min-w-[200px]"
            >
              <label class="text-sm font-medium mb-1 block">{{
                item.label
              }}</label>
              <UInput
                v-if="item.valueType === 'text'"
                v-model="filter[item.index]"
                :placeholder="`Enter ${item.label}`"
              />
              <UInput
                v-else-if="item.valueType === 'number'"
                v-model="filter[item.index]"
                type="number"
                :placeholder="`Enter ${item.label}`"
              />
              <USelect
                v-else-if="
                  item.valueType === 'select' || item.valueType === 'selectMenu'
                "
                v-model="filter[item.index]"
                :items="item.options || []"
                :placeholder="`Select ${item.label}`"
              />
              <DatePicker
                v-else-if="item.valueType === 'date'"
                v-model="filter[item.index]"
              />
              <DateRangePicker
                v-else-if="item.valueType === 'dateRange'"
                v-model="filter[item.index]"
              />
              <UTextarea
                v-else-if="item.valueType === 'textarea'"
                v-model="filter[item.index]"
                :placeholder="`Enter ${item.label}`"
              />
              <UCheckbox
                v-else-if="item.valueType === 'checkbox'"
                v-model="filter[item.index]"
                :label="item.label"
              />
              <USwitch
                v-else-if="item.valueType === 'toggle'"
                v-model="filter[item.index]"
                :label="item.label"
              />
              <URadioGroup
                v-else-if="item.valueType === 'radio'"
                v-model="filter[item.index]"
                :items="item.options || []"
              />
              <component
                v-else-if="item.valueType === 'custom' && item.render"
                :is="() => item.render!(filter)"
              />
            </div>
          </div>
          <div class="flex gap-3 ml-4">
            <UButton
              variant="solid"
              class="h-fit w-fit"
              @click="onFilter"
              :loading="loading"
              :disabled="loading"
            >
              Search
            </UButton>
            <UButton
              variant="outline"
              class="h-fit w-fit"
              @click="resetFilter"
              :disabled="loading"
            >
              Reset
            </UButton>
            <UButton
              v-if="filterField.length > 3"
              :label="isCollapseFilter ? 'Expand' : 'Collapse'"
              :icon="
                isCollapseFilter
                  ? 'i-heroicons-chevron-down'
                  : 'i-heroicons-chevron-up'
              "
              @click="isCollapseFilter = !isCollapseFilter"
            />
          </div>
        </div>
      </header>

      <!-- Table Header Slot -->
      <div class="py-3">
        <slot name="table-header" />
      </div>
      <!-- Table -->
      <UTable
        class="flex-1"
        :columns="columnsWithDensity"
        :data="data"
        :loading="tableLoading"
        loading-animation="carousel"
        :sticky="true"
      />

      <!-- Pagination -->
      <div class="flex justify-end border-t border-default pt-4 px-4">
        <UPagination
          :page="pagination.page"
          :items-per-page="pagination.limit"
          :total="pagination.total"
          @update:page="(p: any) => (pagination.page = p)"
        />
        <USelect
          :items="props.pagination.paginationOptions || [10, 20, 50, 100]"
          v-on:change="() => (pagination.page = 1)"
          v-model="pagination.limit"
        />
      </div>
    </main>
  </div>
</template>
