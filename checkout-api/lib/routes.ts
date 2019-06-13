import jwt from "koa-jwt";
import Router from "koa-router";
import { ServiceOptions } from "./types";
import { whitespaceSeparated } from "./utils";

type Order = {
  customerId: string;
  productId: string;
};

export const createRouter = (options: ServiceOptions) => {
  const router = new Router();

  // public routes
  router.post("/orders", ctx => {
    ctx.status = 201;
  });

  // protected routes start here
  // authorization
  router.use(
    jwt({
      cookie: "loots.at",
      secret: whitespaceSeparated(options.JWT_SECRETS),
      audience: options.JWT_AUDIENCE,
      issuer: "loots"
    })
  );

  router.get("/protected", ctx => {
    ctx.status = 200;
    ctx.body = { hello: "protected" };
  });

  return router;
};
