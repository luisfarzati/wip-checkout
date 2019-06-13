"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("../lib/service");
const service = service_1.createService(process.env);
const server = service.listen(3001, process.env.HTTP_HOST);
process.on("SIGTERM", () => {
    service.emit("shutdown");
    server.close();
});
