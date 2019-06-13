"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("@koa/cors"));
const koa_1 = __importDefault(require("koa"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const pino_1 = __importDefault(require("pino"));
const health_1 = __importDefault(require("./health"));
const json_error_1 = __importDefault(require("./json-error"));
const openapi_1 = __importDefault(require("./openapi"));
const routes_1 = require("./routes");
const utils_1 = require("./utils");
exports.createService = (options) => {
    const process = options.process || global.process;
    // create logger
    const log = pino_1.default({
        enabled: process.env.NODE_ENV !== "test",
        level: options.LOG_LEVEL || "info",
        customLevels: { event: 65 },
        useLevelLabels: true,
        base: null // we don't need pid or hostname
    });
    const app = new koa_1.default();
    app.proxy = true;
    // JSON errors
    app.use(json_error_1.default());
    // CORS
    app.use(cors_1.default({
        allowHeaders: utils_1.whitespaceSeparated(options.CORS_ALLOW_HEADERS),
        allowMethods: utils_1.whitespaceSeparated(options.CORS_ALLOW_METHODS),
        exposeHeaders: utils_1.whitespaceSeparated(options.CORS_EXPOSE_HEADERS),
        origin: options.CORS_ORIGIN,
        keepHeadersOnError: true
    }));
    // body parser
    // restrict to JSON only since all our services are json apis
    app.use(koa_bodyparser_1.default({ enableTypes: ["json"] }));
    // health check
    app.use(health_1.default({ startsHealthy: true }));
    // provide logger in routes
    app.use(function logger(ctx, next) {
        ctx.log = log;
        return next();
    });
    // validate with openapi
    app.use(openapi_1.default(__dirname + "/../openapi.yaml"));
    // routes
    const router = routes_1.createRouter(options);
    app.use(router.routes());
    app.use(router.allowedMethods());
    // become unhealthy when unhandled errors
    // TODO: this is probably redundant happen since the json error middleware should catch everything
    app.on("error", error => !error.status && process.emit("uncaughtException", error));
    // log unhandled errors
    process.on("uncaughtException", error => log.fatal(error));
    // clean up and dispose resources
    app.on("shutdown", () => {
        log.info("Shutdown request");
    });
    return app;
};
