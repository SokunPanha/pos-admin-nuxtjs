import { defineFilter } from "~/components/ui/table/utils";
import { STATUS_OPTIONS } from "~~/shared/constants";

export function useProductVariantFilters() {
  const { t } = useI18n();

  return defineFilter([
    {
      label: t("tableColumn.productVariantName"),
      index: "name",
      valueType: "text",
    },
    {
      label: t("tableColumn.status"),
      index: "isActive",
      valueType: "select",
      options: STATUS_OPTIONS.map((o) => ({ ...o, label: t(`label.${o.value === "Y" ? "active" : "inactive"}`) })),
    },
  ]);
}
