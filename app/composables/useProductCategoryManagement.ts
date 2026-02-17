import type {
  CreateProductCategoryRequestType,
  UpdateProductCategoryRequestType,
  ProductCategoryItemType,
  ProductCategoryListResponseType,
} from "~~/shared/types/ApiResponseType";

export function useProductCategoryManagement() {
  const fetchProductCategories = async (params?: {
    page?: number;
    limit?: number;
    filter?: any;
  }) => {
    try {
      const res = await $fetch<ProductCategoryListResponseType>("/api/admin/product-category/list", {
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
      console.error("Failed to fetch product categories:", error);
      return { data: [], total: 0, success: false };
    }
  };

  const createProductCategory = async (data: CreateProductCategoryRequestType) => {
    return $fetch<ProductCategoryItemType>("/api/admin/product-category/create", {
      method: "POST",
      body: data,
    });
  };

  const updateProductCategory = async (data: UpdateProductCategoryRequestType) => {
    return $fetch<ProductCategoryItemType>("/api/admin/product-category/update", {
      method: "POST",
      body: data,
    });
  };

  const deleteProductCategory = async (uuid: string) => {
    return $fetch("/api/admin/product-category/delete", {
      method: "POST",
      body: { uuid },
    });
  };

  return {
    fetchProductCategories,
    createProductCategory,
    updateProductCategory,
    deleteProductCategory,
  };
}
