import { Context } from "koa";

type JsonError = {
  name: string;
  message: string;
  hint?: string;
  data?: any;
};

function hasErrorStatus(ctx: Context) {
  return ctx.status >= 400;
}

function hasJsonErrorBody(ctx: Context) {
  return ctx.body && ctx.body.error;
}

function hasJsonError(ctx: Context) {
  return hasErrorStatus(ctx) && hasJsonErrorBody(ctx);
}

export default () => {
  return async function jsonError(ctx: Context, next: () => Promise<any>) {
    try {
      // complete the middleware chain
      await next();

      // no errors thrown and response is not an error, we can ignore the rest
      if (!hasErrorStatus(ctx)) return;

      // response is already a json error, we can ignore the rest
      if (hasJsonError(ctx)) return;

      // rethrow the non-json error response so we handle it below
      ctx.throw(ctx.status);
    } catch (error) {
      let status: number;
      let jsonError: JsonError;

      // unhandled error: normalize response to a handled error (with generic name/message
      // because we don't want to leak potential sensitive error data)
      if (!error.status) {
        status = 500;
        jsonError = {
          name: "InternalServerError",
          message:
            "The server encountered an unexpected condition that prevented it from fulfilling the request"
        };
        // since this was an unhandled error, we want to trigger this event
        process.emit("uncaughtException", error);
      } else {
        status = error.status;
        const { name, message, hint, ...data } = error;
        jsonError = { name, message, hint, data: Object.keys(data).length ? data : undefined };
      }

      ctx.status = status;
      ctx.body = { error: jsonError };
    }
  };
};
