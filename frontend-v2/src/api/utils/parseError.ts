const fakeError = {
  statusCode: 400,
  message: "Unknown error",
  error: "Unknown",
}

const parseError = (error: Error) => error?.message || fakeError
export default parseError
