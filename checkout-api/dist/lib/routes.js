"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_jwt_1 = __importDefault(require("koa-jwt"));
const koa_router_1 = __importDefault(require("koa-router"));
const utils_1 = require("./utils");
exports.createRouter = (options) => {
    const router = new koa_router_1.default();
    // public routes
    router.post("/cats", ctx => {
        ctx.status = 201;
    });
    // protected routes start here
    // authorization
    router.use(koa_jwt_1.default({
        cookie: "loots.at",
        secret: utils_1.whitespaceSeparated(options.JWT_SECRETS),
        audience: options.JWT_AUDIENCE,
        issuer: "loots"
    }));
    router.get("/protected", ctx => {
        ctx.status = 200;
        ctx.body = { hello: "protected" };
    });
    return router;
};
