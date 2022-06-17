export const formatResponse = (body) => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body, null, 2)
});

export const formatError = (error) => ({
  statusCode: error.statusCode,
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ code: error.code, message: error.message })
});
