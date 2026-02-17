export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return proxyApiRequest(event, "/master-data/roles", { body });
});