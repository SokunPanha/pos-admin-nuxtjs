export default defineEventHandler(async (event) => {
  const { apiUrlBase } = useRuntimeConfig();
  const cookie = getHeader(event, "cookie") || "";

  const parts = await readMultipartFormData(event);
  if (!parts || parts.length === 0) {
    throw createError({ statusCode: 400, statusMessage: "No file provided" });
  }

  const formData = new FormData();
  for (const part of parts) {
    if (part.filename) {
      formData.append(
        part.name ?? "file",
        new Blob([new Uint8Array(part.data)], { type: part.type }),
        part.filename
      );
    } else {
      formData.append(part.name ?? "field", part.data.toString());
    }
  }

  try {
    const response = await $fetch.raw<{ data: any }>(`${apiUrlBase}/media/upload-image`, {
      method: "POST",
      headers: { cookie },
      body: formData,
    });
    console.log("🚀 ~ response:", response._data)

    const setCookies = response.headers.getSetCookie();
    for (const c of setCookies) {
      appendResponseHeader(event, "Set-Cookie", c);
    }

    return response._data?.data;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      try {
        const refreshResponse = await $fetch.raw(`${apiUrlBase}/auth/refresh`, {
          method: "POST",
          headers: { cookie },
        });

        const refreshSetCookies = refreshResponse.headers.getSetCookie();
        for (const c of refreshSetCookies) {
          appendResponseHeader(event, "Set-Cookie", c);
        }

        const updatedCookie = refreshSetCookies.length > 0
          ? `${cookie}; ${refreshSetCookies.map((c) => c.split(";")[0]).join("; ")}`
          : cookie;

        const retryResponse = await $fetch.raw(`${apiUrlBase}/media/upload-image`, {
          method: "POST",
          headers: { cookie: updatedCookie },
          body: formData,
        });

        const retrySetCookies = retryResponse.headers.getSetCookie();
        for (const c of retrySetCookies) {
          appendResponseHeader(event, "Set-Cookie", c);
        }

        return retryResponse._data;
      } catch {
        throw error;
      }
    }
    throw error;
  }
});
