"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (options) => {
    let isHealthy = options.startsHealthy;
    // unexpected error -- become unhealthy
    process.on("uncaughtException", () => (isHealthy = false));
    process.on("unhandledRejection", () => (isHealthy = false));
    return function health(ctx, next) {
        if (ctx.url !== "/health")
            return next();
        if (isHealthy) {
            ctx.status = 200;
            ctx.body = { status: "OK" };
        }
        else {
            ctx.status = 503;
            ctx.body = {
                error: {
                    name: "ServiceUnavailable",
                    message: "The server is not ready to handle the request"
                }
            };
        }
        return;
    };
};
