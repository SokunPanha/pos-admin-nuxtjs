import { h } from "vue";
import { UButton } from "#components";
import { defineProTableColumns } from "~/components/ui/table/utils";
import { PERMISSIONS } from "~~/shared/constants";
import type { UserItemType } from "~~/shared/types/ApiResponseType";

interface UserColumnActions {
  onEdit: (user: UserItemType) => void;
  onToggleStatus: (user: UserItemType) => void;
  onDelete: (user: UserItemType) => void;
  onAssignRole: (user: UserItemType) => void;
}

export function useUserColumns(actions: UserColumnActions) {
  const { t } = useI18n();
  const { hasPermission, hasAnyPermission } = usePermission();

  const hasAnyAction = hasAnyPermission([
    PERMISSIONS.USER_ASSIGN_ROLE,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_UPDATE_STATUS,
    PERMISSIONS.USER_DELETE,
  ]);

  return () => {
    const cols: any[] = [
      {
        accessorKey: "username",
        header: t("tableColumn.username"),
        title: t("tableColumn.username"),
      },
      {
        accessorKey: "fullName",
        header: t("tableColumn.fullName"),
        title: t("tableColumn.fullName"),
      },
      {
        accessorKey: "phone",
        header: t("tableColumn.phone"),
        title: t("tableColumn.phone"),
        cell: ({ row }: any) => row.getValue("phone") || "-",
      },
      {
        accessorKey: "role",
        header: t("tableColumn.role"),
        title: t("tableColumn.role"),
        cell: ({ row }: any) => {
          const role = row.getValue("role");
          return h(
            "span",
            { class: "px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800" },
            role?.name || "-",
          );
        },
      },
      {
        accessorKey: "isActive",
        header: t("tableColumn.status"),
        title: t("tableColumn.status"),
        cell: ({ row }: any) => {
          const isActive = row.getValue("isActive");
          const color = isActive === "Y" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
          const label = isActive === "Y" ? t("label.active") : t("label.inactive");
          return h("span", { class: `px-2 py-1 rounded-full text-xs font-medium ${color}` }, label);
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
          const user = row.original as UserItemType;
          const buttons: any[] = [];

          if (hasPermission(PERMISSIONS.USER_ASSIGN_ROLE)) {
            buttons.push(
              h(UButton, {
                icon: "i-lucide-shield",
                variant: "ghost",
                color: "primary",
                size: "xs",
                onClick: () => actions.onAssignRole(user),
              }),
            );
          }
          if (hasPermission(PERMISSIONS.USER_UPDATE)) {
            buttons.push(
              h(UButton, {
                icon: "i-lucide-pencil",
                variant: "ghost",
                color: "neutral",
                size: "xs",
                onClick: () => actions.onEdit(user),
              }),
            );
          }
          if (hasPermission(PERMISSIONS.USER_UPDATE_STATUS)) {
            buttons.push(
              h(UButton, {
                icon: user.isActive === "Y" ? "i-lucide-ban" : "i-lucide-check-circle",
                variant: "ghost",
                color: user.isActive === "Y" ? "warning" : "success",
                size: "xs",
                onClick: () => actions.onToggleStatus(user),
              }),
            );
          }
          if (hasPermission(PERMISSIONS.USER_DELETE)) {
            buttons.push(
              h(UButton, {
                icon: "i-lucide-trash-2",
                variant: "ghost",
                color: "error",
                size: "xs",
                onClick: () => actions.onDelete(user),
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
