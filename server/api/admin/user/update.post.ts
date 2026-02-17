export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return proxyApiRequest(event, "/user/update", { body });
});
