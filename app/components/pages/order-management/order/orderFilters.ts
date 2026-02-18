import { defineFilter } from "~/components/ui/table/utils";

export function useOrderFilters() {
  const { t } = useI18n();

  return defineFilter([
    {
      label: t("tableColumn.status"),
      index: "status",
      valueType: "select",
      options: [
        { label: "Completed", value: "COMPLETED" },
        { label: "Pending", value: "PENDING" },
        { label: "Cancelled", value: "CANCELLED" },
      ],
    },
    {
      label: t("tableColumn.createdAt"),
      index: "range",
      valueType: "dateRange",
    },
  ]);
}
