export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = await proxyApiRequest(event, "/master-data/categories", { body });
  return {
    items: response.data.items,
    total: response.data.total
  }
});
