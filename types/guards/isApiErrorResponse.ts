interface ApiErrorResponse {
  response: {
    data: {
      error: {
        message: string;
      };
    };
  };
}

interface ApiZodErrorResponse {
  response: {
    data: {
      issues: Array<{
        message: string;
      }>;
    };
  };
}

export function isApiErrorResponse(error: unknown): error is ApiErrorResponse {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "error" in error.response.data &&
    typeof error.response.data.error === "object" &&
    error.response.data.error !== null
  );
}

export function isApiZodErrorResponse(
  error: unknown,
): error is ApiZodErrorResponse {
  return (
    typeof error === "object" &&
    error !== null &&

    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&

    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&

    "issues" in error.response.data &&
    Array.isArray(error.response.data.issues)
  );
}
