export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const res = await proxyApiRequest(event, "/product/list", { body });
  return {
    items: res.data.items,
    total: res.data.total,
  };
});
