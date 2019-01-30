import { ApolloError, UserInputError } from "apollo-server";

function errorResponse(message, code, errorType) {
  if (
    errorType.name &&
    (errorType.name === "SequelizeUniqueConstraintError" ||
      errorType.name === "SequelizeValidationError")
  ) {
    const validationErrors = errorType.errors.reduce(
      (acc, { path, message, validatorKey }) => {
        acc[path] = { [validatorKey]: message };
        return acc;
      },
      {}
    );
    return new UserInputError(message, {
      serverResponse: { validationErrors: validationErrors },
      additionalStackTrace: errorType
    });
  } else {
    // when its not validationError throw all others types of Errors
    // map error code to the name
    if (code === 400) return (code = "BAD REQUEST");
    if (code === 404) return (code = "NOT FOUND");
    if (code === 500) return (code = "INTERNAL SERVER ERROR");
    return new ApolloError(message, code, { additionalStackTrace: errorType });
  }
}
function customErrorValidationResponse(
  message,
  validationErrorMessage = "",
  errorType = null
) {
  return new UserInputError(message, {
    serverResponse: { validationErrors: validationErrorMessage },
    additionalStackTrace: errorType
  });
}

function successResponse(responseObj = {}, code, message) {
  return Object.assign({}, responseObj, {
    mutationResponse: {
      success: true,
      code,
      message
    }
  });
}

export { errorResponse, customErrorValidationResponse, successResponse };
