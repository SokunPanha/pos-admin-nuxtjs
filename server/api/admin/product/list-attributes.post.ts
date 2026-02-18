export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const res = await proxyApiRequest<{ data: { items: any[] } }>(event, "/product/list-attributes", { body });
  return { items: res.data.items, total: res.data.items?.length ?? 0 };
});
