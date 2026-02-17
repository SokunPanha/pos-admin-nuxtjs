import { defineFilter } from "~/components/ui/table/utils";
import { ROLE_OPTIONS, USER_STATUS_OPTIONS } from "~~/shared/constants";

export function useUserFilters() {
  const { t } = useI18n();

  return defineFilter([
    {
      label: t("tableColumn.username"),
      index: "username",
      valueType: "text",
    },
    {
      label: t("tableColumn.fullName"),
      index: "fullName",
      valueType: "text",
    },
    {
      label: t("tableColumn.status"),
      index: "isActive",
      valueType: "select",
      options: USER_STATUS_OPTIONS.map((o) => ({ ...o, label: t(`label.${o.value === "Y" ? "active" : "inactive"}`) })),
    },
    {
      label: t("tableColumn.role"),
      index: "roleName",
      valueType: "select",
      options: ROLE_OPTIONS,
    },
  ]);
}
