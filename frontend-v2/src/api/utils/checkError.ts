const checkError = (res: any) => {
  const { error, statusCode } = res

  if (error || statusCode === 401) {
    throw res
  }
  return res
}
export default checkError
