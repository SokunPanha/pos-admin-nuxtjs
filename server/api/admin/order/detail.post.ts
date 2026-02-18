export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const res = await proxyApiRequest(event, '/order/detail', {body})

  return res.data
})
