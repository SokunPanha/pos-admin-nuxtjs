export function useMediaUpload() {
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await $fetch<{ url: string }>("/api/admin/media/upload-image", {
      method: "POST",
      body: formData,
    });

    return res.url;
  };

  return { uploadImage };
}
