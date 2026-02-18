
export function useProductVariantManagement({productId}: { productId?: string } = {}) {
  const fetchProductsVariant = async (params?: {
    page?: number;
    limit?: number;
    filter?: any;
  }) => {
    try {
      const res = await $fetch<ProductVariantListResponseType>("/api/admin/product/list-variants", {
        method: "POST",
        body: {
          page: params?.page || 1,
          pageSize: params?.limit || 10,
          productUuid: productId,
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

  const createProductVariant = async (data: CreateProductVariantRequestType) => {
    return $fetch<ProductVariantItemType>("/api/admin/product/create-variant", {
      method: "POST",
      body: data,
    });
  };

  const updateProductVariant = async (data: UpdateProductVariantRequestType) => {
    return $fetch<ProductVariantItemType>("/api/admin/product/update-variant", {
      method: "POST",
      body: data,
    });
  };

  const deleteProductVariant = async (uuid: string) => {
    return $fetch("/api/admin/product/delete-variant", {
      method: "POST",
      body: { uuid },
    });
  };

  const updateProductVariantStatus = async (uuid: string, isActive: "Y" | "N") => {
    return $fetch<ProductVariantItemType>("/api/admin/product/update-variant-status", {
      method: "POST",
      body: { uuid, isActive },
    });
  };

  return {
    fetchProductsVariant,
    createProductVariant,
    updateProductVariant,
    deleteProductVariant,
    updateProductVariantStatus,
  };
}
