import { h } from "vue";
import { UButton } from "#components";
import { defineProTableColumns } from "~/components/ui/table/utils";
import type { ProductVariantItemType } from "~~/shared/types/ApiResponseType";
import { PERMISSIONS } from "~~/shared/constants";

interface ProductVariantColumnActions {
  onEdit: (variant: ProductVariantItemType) => void;
  onToggleStatus: (variant: ProductVariantItemType) => void;
  onDelete: (variant: ProductVariantItemType) => void;
}

export function useProductVariantColumns(actions: ProductVariantColumnActions) {
  const { t, locale } = useI18n();
  const { hasPermission, hasAnyPermission } = usePermission();
  const hasAnyAction = hasAnyPermission([
    PERMISSIONS.PRODUCT_VARIANT_UPDATE,
    PERMISSIONS.PRODUCT_VARIANT_UPDATE_STATUS,
    PERMISSIONS.PRODUCT_VARIANT_DELETE,
  ]);

  return () => {
    const cols = defineProTableColumns([
      {
        accessorKey: "name",
        header: t("tableColumn.productVariantName"),
        title: t("tableColumn.productVariantName"),
        cell: ({ row }: any) => {
          const name = row.getValue("name");
          return name?.[locale.value] || name?.en || "-";
        },
      },
      {
        accessorKey: "sku",
        header: t("tableColumn.sku"),
        title: t("tableColumn.sku"),
      },
      {
        accessorKey: "price",
        header: t("tableColumn.price"),
        title: t("tableColumn.price"),
        cell: ({ row }: any) => {
          const price = row.getValue("price");
          return price != null ? `$${Number(price).toFixed(2)}` : "-";
        },
      },
      {
        accessorKey: "promotePrice",
        header: t("tableColumn.promotePrice"),
        title: t("tableColumn.promotePrice"),
        cell: ({ row }: any) => {
          const p = row.getValue("promotePrice");
          return p ? `$${Number(p).toFixed(2)}` : "-";
        },
      },
      {
        accessorKey: "stockQty",
        header: t("tableColumn.stockQty"),
        title: t("tableColumn.stockQty"),
        cell: ({ row }: any) => {
          const qty = row.getValue("stockQty");
          return qty ?? "-";
        },
      },
      {
        accessorKey: "isActive",
        header: t("tableColumn.status"),
        title: t("tableColumn.status"),
        cell: ({ row }: any) => {
          const isActive = row.getValue("isActive");
          return h(
            "span",
            {
              class: `inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                isActive === "Y"
                  ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
              }`,
            },
            isActive === "Y" ? t("label.active") : t("label.inactive"),
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: t("tableColumn.createdAt"),
        title: t("tableColumn.createdAt"),
        cell: ({ row }: any) => {
          return new Date(row.getValue("createdAt")).toLocaleString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
        },
      },
    ] as any);

    if (hasAnyAction) {
      cols.push({
        id: "actions",
        header: t("tableColumn.actions"),
        title: t("tableColumn.actions"),
        fixed: true,
        cell: ({ row }: any) => {
          const buttons: any[] = [];

          if (hasPermission(PERMISSIONS.PRODUCT_VARIANT_UPDATE)) {
            buttons.push(
              h(UButton, {
                icon: "i-lucide-pencil",
                variant: "ghost",
                color: "neutral",
                size: "xs",
                onClick: () => actions.onEdit(row.original as ProductVariantItemType),
              }),
            );
          }
          if (hasPermission(PERMISSIONS.PRODUCT_VARIANT_UPDATE_STATUS)) {
            const isActive = row.original.isActive === "Y";
            buttons.push(
              h(UButton, {
                icon: isActive ? "i-lucide-ban" : "i-lucide-check-circle",
                variant: "ghost",
                color: isActive ? "warning" : "success",
                size: "xs",
                onClick: () => actions.onToggleStatus(row.original as ProductVariantItemType),
              }),
            );
          }
          if (hasPermission(PERMISSIONS.PRODUCT_VARIANT_DELETE)) {
            buttons.push(
              h(UButton, {
                icon: "i-lucide-trash-2",
                variant: "ghost",
                color: "error",
                size: "xs",
                onClick: () => actions.onDelete(row.original as ProductVariantItemType),
              }),
            );
          }

          return buttons.length > 0 ? h("div", { class: "flex justify-center gap-1" }, buttons) : "-";
        },
        meta: {
          class: {
            th: "text-center",
            td: "text-center",
          },
        },
      });
    }

    return cols;
  };
}
