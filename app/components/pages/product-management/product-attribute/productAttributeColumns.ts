import { h } from "vue";
import { UButton } from "#components";
import { defineProTableColumns } from "~/components/ui/table/utils";
import type { ProductAttributeItemType } from "~~/shared/types/ApiResponseType";
import { PERMISSIONS } from "~~/shared/constants";

interface ProductAttributeColumnActions {
  onEdit: (attribute: ProductAttributeItemType) => void;
  onDelete: (attribute: ProductAttributeItemType) => void;
}

export function useProductAttributeColumns(actions: ProductAttributeColumnActions) {
  const { t, locale } = useI18n();
  const { hasPermission, hasAnyPermission } = usePermission();
  const hasAnyAction = hasAnyPermission([
    PERMISSIONS.PRODUCT_ATTRIBUTE_UPDATE,
    PERMISSIONS.PRODUCT_ATTRIBUTE_DELETE,
  ]);

  return () => {
    const cols = defineProTableColumns([
      {
        accessorKey: "name",
        header: t("tableColumn.attributeName"),
        title: t("tableColumn.attributeName"),
        cell: ({ row }: any) => {
          const name = row.getValue("name");
          return name?.[locale.value] || name?.en || "-";
        },
      },
      {
        accessorKey: "values",
        header: t("tableColumn.attributeValues"),
        title: t("tableColumn.attributeValues"),
        cell: ({ row }: any) => {
          const values: Array<{ uuid: string; value: Record<string, unknown> }> = row.getValue("values") || [];
          if (!values.length) return "-";
          return h(
            "div",
            { class: "flex flex-wrap gap-1" },
            values.map((v) =>
              h(
                "span",
                {
                  key: v.uuid,
                  class: "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
                },
                String(v.value?.[locale.value] || v.value?.en || ""),
              ),
            ),
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

          if (hasPermission(PERMISSIONS.PRODUCT_ATTRIBUTE_UPDATE)) {
            buttons.push(
              h(UButton, {
                icon: "i-lucide-pencil",
                variant: "ghost",
                color: "neutral",
                size: "xs",
                onClick: () => actions.onEdit(row.original as ProductAttributeItemType),
              }),
            );
          }
          if (hasPermission(PERMISSIONS.PRODUCT_ATTRIBUTE_DELETE)) {
            buttons.push(
              h(UButton, {
                icon: "i-lucide-trash-2",
                variant: "ghost",
                color: "error",
                size: "xs",
                onClick: () => actions.onDelete(row.original as ProductAttributeItemType),
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
