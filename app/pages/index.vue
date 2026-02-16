<script setup lang="ts">
import { h, resolveComponent } from "vue";
import {
  defineFilter,
  defineProTableColumns,
} from "~/components/ui/table/utils";


const fetchData = async (params?: {
  page?: number;
  limit?: number;
  filter?: any;
}) => {
  try {
    const res: any[] = await $fetch(
      "https://68a419e5c123272fb9b152a2.mockapi.io/api/v1/products",
      {
        query: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          ...params?.filter,
        },
      },
    );

    return {
      data: res,
      total: 50,
      success: true,
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      data: [],
      total: 0,
      success: false,
    };
  }
};

const columns = () => {
  return defineProTableColumns([
    {
      accessorKey: "id",
      title: "Product ID",
      meta: {
        class: {
          th: "text-center",
          td: "text-center",
        },
      },
      header: "ID",
      cell: ({ row }: any) => `#${row.getValue("id")}`,
    },
    {
      accessorKey: "name",
      title: "Product Name",
      header: "Name",
    },
    {
      accessorKey: "price",
      title: "Price",
      meta: {
        class: {
          th: "text-right",
          td: "text-right font-medium",
        },
      },
      cell: ({ row }: any) => {
        const amount = Number.parseFloat(row.getValue("price"));
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "EUR",
        }).format(amount);
      },
    },
    {
      accessorKey: "createdAt",
      title: "Created Date",
      header: "Created At",
      cell: ({ row }: any) => {
        return new Date(row.getValue("createdAt")).toLocaleString("en-US", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      },
    },
    {
      accessorKey: "status",
      title: "Status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status") || "active";
        const statusColors: Record<string, string> = {
          active: "bg-green-100 text-green-800",
          inactive: "bg-gray-100 text-gray-800",
          pending: "bg-yellow-100 text-yellow-800",
        };
        return h(
          "span",
          {
            class: `px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"}`,
          },
          status.charAt(0).toUpperCase() + status.slice(1),
        );
      },
    },
    {
      accessorKey: "description",
      title: "Description",
      header: "Description",
      hideInTable: true, // Hidden by default
    },
  ] as any);
};

const filterField = defineFilter([
  {
    label: "Name",
    index: "name",
    valueType: "text",
  },
  {
    label: "Price",
    index: "price",
    valueType: "number",
  },
  {
    label: "Status",
    index: "status",
    valueType: "select",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Pending", value: "pending" },
    ],
  },
  {
    label: "Created At",
    index: "createdAt",
    valueType: "dateRange",
  },
  {
    label: "Category",
    index: "category",
    valueType: "custom",
    render: (filter: Record<string, any>) =>
      h(resolveComponent("USelect"), {
        modelValue: filter.category,
        "onUpdate:modelValue": (val: any) => (filter.category = val),
        items: [
          { label: "Electronics", value: "electronics" },
          { label: "Clothing", value: "clothing" },
          { label: "Food", value: "food" },
        ],
        placeholder: "Select Category",
      }),
  },
]);

// Handle row selection changes
const handleSelectionChange = (
  selectedRows: any[],
  selectedRowKeys: (string | number)[],
) => {
  console.log("Selected rows:", selectedRows);
  console.log("Selected row keys:", selectedRowKeys);
};
</script>

<template>
  <UiTable
    :filter-field="filterField"
    :pagination="{
      paginationOptions: [10, 20, 50, 100],
    }"
    :columns="columns()"
    :request="fetchData"
    :toolbar="true"
    :row-selection="{
      onChange: handleSelectionChange,
    }"
    default-density="default"
    export-filename="products-export.csv"
    table-id="products-table"
  >
    <template #table-header>
      <h1>test</h1>
    </template>
    <template #toolbar-actions>
      <!-- Add custom toolbar actions here if needed -->
    </template>
  </UiTable>
</template>
