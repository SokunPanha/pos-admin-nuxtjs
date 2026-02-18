export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const res = await proxyApiRequest<{ data: Record<string, unknown> }>(event, "/dashboard", { body });
  return res.data;
});
