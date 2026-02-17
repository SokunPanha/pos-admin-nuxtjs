import type {
  CreateProductRequestType,
  UpdateProductRequestType,
  ProductItemType,
  ProductListResponseType,
} from "~~/shared/types/ApiResponseType";

export function useProductManagement() {
  const fetchProducts = async (params?: {
    page?: number;
    limit?: number;
    filter?: any;
  }) => {
    try {
      const res = await $fetch<ProductListResponseType>("/api/admin/product/list", {
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
      console.error("Failed to fetch products:", error);
      return { data: [], total: 0, success: false };
    }
  };

  const createProduct = async (data: CreateProductRequestType) => {
    return $fetch<ProductItemType>("/api/admin/product/create", {
      method: "POST",
      body: data,
    });
  };

  const updateProduct = async (data: UpdateProductRequestType) => {
    return $fetch<ProductItemType>("/api/admin/product/update", {
      method: "POST",
      body: data,
    });
  };

  const deleteProduct = async (uuid: string) => {
    return $fetch("/api/admin/product/delete", {
      method: "POST",
      body: { uuid },
    });
  };

  const updateProductStatus = async (uuid: string, isActive: "Y" | "N") => {
    return $fetch<ProductItemType>("/api/admin/product/update-status", {
      method: "POST",
      body: { uuid, isActive },
    });
  };

  return {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus,
  };
}
