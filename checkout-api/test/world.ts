import { createService } from "../lib/service";
import { ServiceOptions } from "../lib/types";
import { Server } from "http";
import supertest from "supertest";

export class World {
  service?: import("koa")<any, any>;
  server?: Server;

  constructor() {}

  async startService(options: ServiceOptions = { JWT_SECRETS: "test" }) {
    this.service = createService(options);
    this.server = await new Promise<Server>(resolve => {
      const server = this.service!.listen(0, "127.0.0.1", () => resolve(server));
    });
  }

  get request() {
    return supertest(this.server);
  }

  destroy() {
    return new Promise(resolve => this.server!.close(resolve));
  }
}
