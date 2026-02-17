import { defineFilter } from "~/components/ui/table/utils";
import { USER_STATUS_OPTIONS } from "~~/shared/constants";

export function useProductFilters() {
  const { t } = useI18n();

  return defineFilter([
    {
      label: t("tableColumn.productName"),
      index: "name",
      valueType: "text",
    },
    {
      label: t("tableColumn.status"),
      index: "isActive",
      valueType: "select",
      options: USER_STATUS_OPTIONS,
    },
  ]);
}
