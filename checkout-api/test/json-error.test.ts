import { World } from "./world";

let world: World;

beforeEach(() => {
  world = new World();
  return world.startService({ JWT_SECRETS: "" });
});

it("error is returned as JSON", () => {
  return world.request
    .get("/invalid")
    .expect(404)
    .expect({ error: { name: "NotFoundError", message: "Not Found" } });
});

it("error is returned as JSON", () => {
  process.emit("uncaughtException", new Error());
  return world.request
    .get("/health")
    .expect(503)
    .expect({
      error: {
        name: "ServiceUnavailable",
        message: "The server is not ready to handle the request"
      }
    });
});

afterEach(() => world.destroy());
