export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const res = await proxyApiRequest<{ data: { items: any[]; total: number } }>(event, "/role/list", { body });
  return {
    items: res.data.items,
    total: res.data.total,
  };
});