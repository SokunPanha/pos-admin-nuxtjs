import { h } from "vue";
import { UButton } from "#components";
import { defineProTableColumns } from "~/components/ui/table/utils";
import { PERMISSIONS } from "~~/shared/constants";
import type { RoleItemType } from "~~/shared/types/ApiResponseType";

interface RoleColumnActions {
  onEdit: (role: RoleItemType) => void;
  onDelete: (role: RoleItemType) => void;
  onAssignPermissions: (role: RoleItemType) => void;
}

export function useRoleColumns(actions: RoleColumnActions) {
  const { t, locale } = useI18n();
  const { hasPermission, hasAnyPermission } = usePermission();

  const hasAnyAction = hasAnyPermission([
    PERMISSIONS.ROLE_ASSIGN_PERMISSIONS,
    PERMISSIONS.ROLE_UPDATE,
    PERMISSIONS.ROLE_DELETE,
  ]);

  return () => {
    const cols: any[] = [
      {
        accessorKey: "name",
        header: t("tableColumn.roleName"),
        title: t("tableColumn.roleName"),
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
        accessorKey: "isSystem",
        header: t("tableColumn.isSystem"),
        title: t("tableColumn.isSystem"),
        cell: ({ row }: any) => {
          const isSystem = row.getValue("isSystem");
          const color = isSystem === "Y" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800";
          const label = isSystem === "Y" ? t("label.yes") : t("label.no");
          return h("span", { class: `px-2 py-1 rounded-full text-xs font-medium ${color}` }, label);
        },
      },
      {
        accessorKey: "permissions",
        header: t("tableColumn.permissions"),
        title: t("tableColumn.permissions"),
        cell: ({ row }: any) => {
          const permissions = row.getValue("permissions") as any[];
          return h("span", { class: "text-sm text-gray-500" }, `${permissions?.length || 0} ${t("label.permissions")}`);
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
    ];

    if (hasAnyAction) {
      cols.push({
        id: "actions",
        header: t("tableColumn.actions"),
        title: t("tableColumn.actions"),
        fixed: true,
        cell: ({ row }: any) => {
          const role = row.original as RoleItemType;
          const buttons: any[] = [];

          if (hasPermission(PERMISSIONS.ROLE_ASSIGN_PERMISSIONS)) {
            buttons.push(
              h(UButton, {
                icon: "i-lucide-shield-check",
                variant: "ghost",
                color: "primary",
                size: "xs",
                onClick: () => actions.onAssignPermissions(role),
              }),
            );
          }
          if (hasPermission(PERMISSIONS.ROLE_UPDATE)) {
            buttons.push(
              h(UButton, {
                icon: "i-lucide-pencil",
                variant: "ghost",
                color: "neutral",
                size: "xs",
                onClick: () => actions.onEdit(role),
              }),
            );
          }
          if (hasPermission(PERMISSIONS.ROLE_DELETE)) {
            buttons.push(
              h(UButton, {
                icon: "i-lucide-trash-2",
                variant: "ghost",
                color: "error",
                size: "xs",
                onClick: () => actions.onDelete(role),
              }),
            );
          }

          return h("div", { class: "flex items-center gap-1" }, buttons);
        },
        meta: {
          class: {
            th: "text-center",
            td: "text-center",
          },
        },
      });
    }

    return defineProTableColumns(cols);
  };
}
