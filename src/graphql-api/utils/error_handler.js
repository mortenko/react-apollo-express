import { ApolloError } from "apollo-server";

function validationErrorResponse(code, serverError) {
  const { name, errors } = serverError;
  if (
    name === "SequelizeUniqueConstraintError" ||
    name === "SequelizeValidationError"
  ) {
    const response = errors.reduce((acc, { path, message, validatorKey }) => {
      acc[path] = { [validatorKey]: message };
      return acc;
    }, {});
    throw new ApolloError(name, code, { response });
  } else {
    // when its not validationError throw all others types of exceptions
    throw new ApolloError(name, 400, { response: serverError });
  }
}
function validationSuccessResponse(responseObj = null, code, message) {
  return Object.assign({}, responseObj, {
    mutationResponse: {
      success: true,
      code,
      message
    }
  });
}
function customErrorResponse(
  apolloMessage = "INTERNAL_SERVER_ERROR",
  apolloCode = 500,
  { message, code, trace }
) {
  throw new ApolloError(apolloMessage, apolloCode, {
    name,
    message,
    code,
    trace,
    success: false
  });
}

export {
  validationErrorResponse,
  validationSuccessResponse,
  customErrorResponse
};
