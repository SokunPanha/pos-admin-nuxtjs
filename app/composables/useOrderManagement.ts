import type {
  ListOrderRequestType,
  OrderListResponseType,
  OrderItemType,
  OrderDetailResponseType,
} from "~~/shared/types/ApiResponseType";

export function useOrderManagement() {
  const fetchOrders = async (params?: {
    page?: number;
    limit?: number;
    filter?: any;
  }) => {
    try {
      const res = await $fetch<OrderListResponseType>("/api/admin/order/list", {
        method: "POST",
        body: {
          page: params?.page || 1,
          pageSize: params?.limit || 10,
          ...params?.filter,
        },
      });

      return {
        data: res.items || [],
        total: res.total || 0,
        success: true,
      };
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      return { data: [], total: 0, success: false };
    }
  };

  const fetchOrderDetail = async (uuid: string) => {
    try {
      const res = await $fetch<OrderDetailResponseType>("/api/admin/order/detail", {
        method: "POST",
        body: { uuid },
      });

      return res
    } catch (error) {
      console.error("Failed to fetch order detail:", error);
      return null;
    }
  };

  return {
    fetchOrders,
    fetchOrderDetail,
  };
}
