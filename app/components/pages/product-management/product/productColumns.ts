import { h } from "vue";
import { UButton } from "#components";
import { defineProTableColumns } from "~/components/ui/table/utils";
import type { ProductItemType } from "~~/shared/types/ApiResponseType";
import { PERMISSIONS } from "~~/shared/constants";

interface ProductColumnActions {
  onEdit: (product: ProductItemType) => void;
  onToggleStatus: (product: ProductItemType) => void;
  onDelete: (product: ProductItemType) => void;
}

export function useProductColumns(actions: ProductColumnActions) {
  const router = useRouter();
  const { t, locale } = useI18n();
  const { hasPermission, hasAnyPermission } = usePermission();
  const hasAnyAction = hasAnyPermission([
    PERMISSIONS.PRODUCT_UPDATE,
    PERMISSIONS.PRODUCT_UPDATE_STATUS,
    PERMISSIONS.PRODUCT_DELETE,
  ]);

  return () => {
    const cols = defineProTableColumns([
      {
        accessorKey: "name",
        header: t("tableColumn.productName"),
        title: t("tableColumn.productName"),
        cell: ({ row }: any) => {
          const name = row.getValue("name");
          return name?.[locale.value] || name?.en || "-";
        },
      },
      {
        accessorKey: "category",
        header: t("tableColumn.category"),
        title: t("tableColumn.category"),
        cell: ({ row }: any) => {
          const category = row.getValue("category");
          if (!category) return "-";
          return category.name?.[locale.value] || category.name?.en || "-";
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

          if (hasPermission(PERMISSIONS.PRODUCT_UPDATE)) {
            buttons.push(
              h(UButton, {
                icon: "i-lucide-pencil",
                variant: "ghost",
                color: "neutral",
                size: "xs",
                onClick: () => actions.onEdit(row.original as ProductItemType),
              }),
            );
          }
          if (hasPermission(PERMISSIONS.PRODUCT_VARIANT_VIEW)) {
            buttons.push(
              h(UButton, {
                icon: "i-lucide-layers",
                variant: "ghost",
                color: "neutral",
                size: "xs",
                title: t("label.productVariants"),
                onClick: async () => {
                  await router.push(`/product-management/products/variants/${row.original.uuid}`);
                },
              }),
            );
          }
          if (hasPermission(PERMISSIONS.PRODUCT_ATTRIBUTE_VIEW)) {
            buttons.push(
              h(UButton, {
                icon: "i-lucide-tag",
                variant: "ghost",
                color: "neutral",
                size: "xs",
                title: t("label.productAttributes"),
                onClick: async () => {
                  await router.push(`/product-management/products/attributes/${row.original.uuid}`);
                },
              }),
            );
          }
          if (hasPermission(PERMISSIONS.PRODUCT_UPDATE_STATUS)) {
            const isActive = row.original.isActive === "Y";
            buttons.push(
              h(UButton, {
                icon: isActive ? "i-lucide-ban" : "i-lucide-check-circle",
                variant: "ghost",
                color: isActive ? "warning" : "success",
                size: "xs",
                onClick: () => actions.onToggleStatus(row.original as ProductItemType),
              }),
            );
          }
          if (hasPermission(PERMISSIONS.PRODUCT_DELETE)) {
            buttons.push(
              h(UButton, {
                icon: "i-lucide-trash-2",
                variant: "ghost",
                color: "error",
                size: "xs",
                onClick: () => actions.onDelete(row.original as ProductItemType),
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
