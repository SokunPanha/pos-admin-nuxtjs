import { h } from "vue";
import { UButton } from "#components";
import { defineProTableColumns } from "~/components/ui/table/utils";
import type { PermissionItemType } from "~~/shared/types/ApiResponseType";

interface PermissionColumnActions {
  onEdit: (permission: PermissionItemType) => void;
  onDelete: (permission: PermissionItemType) => void;
}

export function usePermissionColumns(actions: PermissionColumnActions) {
  const { t, locale } = useI18n();

  return () =>
    defineProTableColumns([
      {
        accessorKey: "code",
        header: t("tableColumn.permissionCode"),
        title: t("tableColumn.permissionCode"),
        cell: ({ row }: any) => {
          return h("code", { class: "px-2 py-1 rounded bg-gray-100 text-sm font-mono" }, row.getValue("code"));
        },
      },
      {
        accessorKey: "resource",
        header: t("tableColumn.resource"),
        title: t("tableColumn.resource"),
        cell: ({ row }: any) => {
          return h("span", { class: "px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800" }, row.getValue("resource"));
        },
      },
      {
        accessorKey: "action",
        header: t("tableColumn.action"),
        title: t("tableColumn.action"),
        cell: ({ row }: any) => {
          return h("span", { class: "px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800" }, row.getValue("action"));
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
      {
        id: "actions",
        header: t("tableColumn.actions"),
        title: t("tableColumn.actions"),
        fixed: true,
        cell: ({ row }: any) => {
          const permission = row.original as PermissionItemType;
          return h("div", { class: "flex items-center gap-1" }, [
            h(UButton, {
              icon: "i-lucide-pencil",
              variant: "ghost",
              color: "neutral",
              size: "xs",
              onClick: () => actions.onEdit(permission),
            }),
            h(UButton, {
              icon: "i-lucide-trash-2",
              variant: "ghost",
              color: "error",
              size: "xs",
              onClick: () => actions.onDelete(permission),
            }),
          ]);
        },
        meta: {
          class: {
            th: "text-center",
            td: "text-center",
          },
        },
      },
    ] as any);
}
