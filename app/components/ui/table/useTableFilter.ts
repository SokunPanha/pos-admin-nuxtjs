import { ref, reactive, computed } from "vue";
import type { FilterFieldType } from "./type";

export function useTableFilter(
  filterField: FilterFieldType[] | undefined,
  fetchData: (filter?: any) => Promise<void>,
) {
  const isCollapseFilter = ref(true);
  const loading = ref(false);

  const filterItems = computed(() =>
    isCollapseFilter.value ? filterField : filterField?.slice(0, 3),
  );

  type FilterKeys = FilterFieldType["index"];
  const getDefaultValue = (valueType: string) => {
    if (valueType === "date" || valueType === "dateRange") return undefined;
    if (valueType === "checkbox" || valueType === "toggle") return false;
    return "";
  };

  const filter = reactive(
    (filterField ?? []).reduce(
      (acc, item) => {
        acc[item.index] = getDefaultValue(item.valueType);
        return acc;
      },
      {} as Record<FilterKeys, any>,
    ),
  );

  const onFilter = async () => {
    await fetchData(filter);
  };

  const resetFilter = async () => {
    filterField?.forEach((item) => {
      filter[item.index] = getDefaultValue(item.valueType);
    });
    await fetchData(filter);
  };

  return {
    filter,
    filterItems,
    isCollapseFilter,
    loading,
    onFilter,
    resetFilter,
  };
}
