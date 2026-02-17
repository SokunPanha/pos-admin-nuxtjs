import { h } from "vue";
import { UButton } from "#components";
import { defineProTableColumns } from "~/components/ui/table/utils";
import type { ProductCategoryItemType } from "~~/shared/types/ApiResponseType";
import { PERMISSIONS } from "~~/shared/constants";

interface ProductCategoryColumnActions {
  onEdit: (category: ProductCategoryItemType) => void;
  onDelete: (category: ProductCategoryItemType) => void;
}

export function useProductCategoryColumns(
  actions: ProductCategoryColumnActions,
) {
  const { t, locale } = useI18n();
  const { hasPermission, hasAnyPermission } = usePermission();
  const hasAnyAction = hasAnyPermission([
    PERMISSIONS.PRODUCT_CATEGORY_UPDATE,
    PERMISSIONS.PRODUCT_CATEGORY_DELETE,
  ]);

  return () => {
    const cols = defineProTableColumns([
      {
        accessorKey: "name",
        header: t("tableColumn.categoryName"),
        title: t("tableColumn.categoryName"),
        cell: ({ row }: any) => {
          const name = row.getValue("name");
          return name?.[locale.value] || name?.en || "-";
        },
      },
      {
        accessorKey: "description",
        header: t("tableColumn.description"),
        title: t("tableColumn.description"),
        cell: ({ row }: any) => {
          const desc = row.getValue("description");
          return desc?.[locale.value] || desc?.en || "-";
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

    if(hasAnyAction){
      cols.push(
        {
        id: "actions",
        header: t("tableColumn.actions"),
        title: t("tableColumn.actions"),
        fixed: true,
        cell: ({ row }: any) => {
          const buttons: any[] = [];

          if (hasPermission(PERMISSIONS.PRODUCT_CATEGORY_UPDATE)) {
            buttons.push(
              h(UButton, {
                icon: "i-lucide-pencil",
                variant: "ghost",
                color: "neutral",
                size: "xs",
                onClick: () =>
                  actions.onEdit(row.original as ProductCategoryItemType),
              }),
            );
          }
          if (hasPermission(PERMISSIONS.PRODUCT_CATEGORY_DELETE)) {
            buttons.push(
              h(UButton, {
                icon: "i-lucide-trash-2",
                variant: "ghost",
                color: "error",
                size: "xs",
                onClick: () =>
                  actions.onDelete(row.original as ProductCategoryItemType),
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
      },
      )
    }

    return cols
  };
}
