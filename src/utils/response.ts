export const sendResponse = (
  status: number = 500,
  message: string = 'Internal Server Error',
  data: unknown = null
): Response => {
  const success = status >= 200 && status < 300;

  const responseBody = {
    status: success,
    message,
    ...(data !== null && { data }),
  };

  return new Response(JSON.stringify(responseBody), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};