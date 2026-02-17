export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = await proxyApiRequest<{data: {items: any[], total: number}}>(event, "/master-data/roles", { body });
  return {
    items: response.data.items,
    total: response.data.total
  }
});
