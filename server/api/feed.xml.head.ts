export default defineEventHandler((event) => {
  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'cache-control', 'public, s-maxage=3600, stale-while-revalidate=86400')
  setResponseStatus(event, 200)
  return ''
})
