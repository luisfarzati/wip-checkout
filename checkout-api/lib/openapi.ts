import { oas } from "koa-oas3";

export default (path: string) => {
  return oas({
    file: path,
    endpoint: "/openapi.json",
    // only show ui in dev/test environments
    enableUi: process.env.NODE_ENV !== "production",
    uiEndpoint: "/",
    // only validate responses in dev/test environments
    validateResponse: process.env.NODE_ENV !== "production",
    // customize error handler
    errorHandler: (error: any, ctx) => {
      // response validations
      if (error.name === "ResponseValidationError") {
        ctx.throw(501, {
          request: { method: ctx.method, url: ctx.url },
          ...JSON.parse(JSON.stringify(error))
        });
      }
      // don't return 400 for invalid paths, return 404
      else if (error.name === "RequestValidationError" && error.meta.code === 404) {
        ctx.throw(404);
      }
      // throw the error to make it go through the same json error flow
      else if (error.name === "RequestValidationError" && (error.meta.rawErrors || []).length) {
        ctx.throw(400, {
          name: error.name,
          message: error.meta.in + error.meta.rawErrors[0].error
        });
      }
      // throw the error to make it go through the same json error flow
      else {
        ctx.throw(400, error);
      }
    }
  });
};
