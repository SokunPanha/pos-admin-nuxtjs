import { ref, onMounted, type Ref } from "vue";
import type { TablePaginationType } from "./type";

interface RequestParams {
  page?: number;
  limit?: number;
  filter?: any;
}

type RequestFn = (params?: RequestParams) => Promise<{ data: any[]; total: number; success: boolean } | any>;

export function useTableData(
  requestFn: RequestFn | undefined,
  paginationOptions: TablePaginationType["paginationOptions"],
) {
  const tableLoading = ref(false);
  const data: Ref<any[]> = ref([]);

  const pagination = ref({
    total: 10,
    page: 1,
    limit: paginationOptions?.[0] || 10,
  });

  const fetchData = async (filter?: any) => {
    if (!requestFn) return;
    try {
      tableLoading.value = true;
      const res = await requestFn({
        page: pagination.value.page,
        limit: pagination.value.limit,
        filter,
      });
      if (res?.success) {
        data.value = res.data || [];
        pagination.value.total = res.total || 0;
      } else {
        data.value = [];
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      data.value = [];
    } finally {
      tableLoading.value = false;
    }
  };

  onMounted(() => fetchData());

  return {
    tableLoading,
    data,
    pagination,
    fetchData,
  };
}
