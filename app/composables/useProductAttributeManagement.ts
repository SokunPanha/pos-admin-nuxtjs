import type {
  ProductAttributeItemType,
  ProductAttributeListResponseType,
  CreateProductAttributeRequestType,
  UpdateProductAttributeRequestType,
} from "~~/shared/types/ApiResponseType";

export function useProductAttributeManagement({ productId }: { productId?: string } = {}) {
  const fetchProductAttributes = async (params?: { page?: number; limit?: number; filter?: any }) => {
    try {
      const res = await $fetch<ProductAttributeListResponseType & { total: number }>("/api/admin/product/list-attributes", {
        method: "POST",
        body: {
          productUuid: productId,
          ...params?.filter,
        },
      });
      return {
        data: res.items || [],
        total: res.total ?? res.items?.length ?? 0,
        success: true,
      };
    } catch (error) {
      console.error("Failed to fetch product attributes:", error);
      return { data: [], total: 0, success: false };
    }
  };

  const createProductAttribute = async (data: CreateProductAttributeRequestType) => {
    return $fetch<ProductAttributeItemType>("/api/admin/product/create-attribute", {
      method: "POST",
      body: data,
    });
  };

  const updateProductAttribute = async (data: UpdateProductAttributeRequestType) => {
    return $fetch<ProductAttributeItemType>("/api/admin/product/update-attribute", {
      method: "POST",
      body: data,
    });
  };

  const deleteProductAttribute = async (uuid: string) => {
    return $fetch("/api/admin/product/delete-attribute", {
      method: "POST",
      body: { uuid },
    });
  };

  return {
    fetchProductAttributes,
    createProductAttribute,
    updateProductAttribute,
    deleteProductAttribute,
  };
}
