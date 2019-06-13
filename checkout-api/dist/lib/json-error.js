"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
function hasErrorStatus(ctx) {
    return ctx.status >= 400;
}
function hasJsonErrorBody(ctx) {
    return ctx.body && ctx.body.error;
}
function hasJsonError(ctx) {
    return hasErrorStatus(ctx) && hasJsonErrorBody(ctx);
}
exports.default = () => {
    return async function jsonError(ctx, next) {
        try {
            // complete the middleware chain
            await next();
            // no errors thrown and response is not an error, we can ignore the rest
            if (!hasErrorStatus(ctx))
                return;
            // response is already a json error, we can ignore the rest
            if (hasJsonError(ctx))
                return;
            // rethrow the non-json error response so we handle it below
            ctx.throw(ctx.status);
        }
        catch (error) {
            let status;
            let jsonError;
            // unhandled error: normalize response to a handled error (with generic name/message
            // because we don't want to leak potential sensitive error data)
            if (!error.status) {
                status = 500;
                jsonError = {
                    name: "InternalServerError",
                    message: "The server encountered an unexpected condition that prevented it from fulfilling the request"
                };
                // since this was an unhandled error, we want to trigger this event
                process.emit("uncaughtException", error);
            }
            else {
                status = error.status;
                const { name, message, hint } = error, data = __rest(error, ["name", "message", "hint"]);
                jsonError = { name, message, hint, data: Object.keys(data).length ? data : undefined };
            }
            ctx.status = status;
            ctx.body = { error: jsonError };
        }
    };
};
