import cors from "@koa/cors";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import pino from "pino";
import health from "./health";
import jsonError from "./json-error";
import openapi from "./openapi";
import { createRouter } from "./routes";
import { ServiceOptions } from "./types";
import { whitespaceSeparated } from "./utils";

export const createService = (options: ServiceOptions) => {
  const process = options.process || global.process;

  // create logger
  const log = pino({
    enabled: process.env.NODE_ENV !== "test", // be silent when running tests
    level: options.LOG_LEVEL || "info",
    customLevels: { event: 65 }, // for metrics
    useLevelLabels: true, // prefer "info" than "40"
    base: null // we don't need pid or hostname
  });

  const app = new Koa();
  app.proxy = true;

  // JSON errors
  app.use(jsonError());

  // CORS
  app.use(
    cors({
      allowHeaders: whitespaceSeparated(options.CORS_ALLOW_HEADERS),
      allowMethods: whitespaceSeparated(options.CORS_ALLOW_METHODS),
      exposeHeaders: whitespaceSeparated(options.CORS_EXPOSE_HEADERS),
      origin: options.CORS_ORIGIN,
      keepHeadersOnError: true
    })
  );

  // body parser
  // restrict to JSON only since all our services are json apis
  app.use(bodyParser({ enableTypes: ["json"] }));

  // health check
  app.use(health({ startsHealthy: true }));

  // provide logger in routes
  app.use(function logger(ctx, next) {
    ctx.log = log;
    return next();
  });

  // validate with openapi
  app.use(openapi(__dirname + "/../openapi.yaml"));

  // routes
  const router = createRouter(options);
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
