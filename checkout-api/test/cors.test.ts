import { World } from "./world";

let world: World;

beforeEach(() => {
  world = new World();
  return world.startService({ JWT_SECRETS: "", CORS_ALLOW_METHODS: "POST" });
});

it("CORS is enabled for GET requests", () => {
  return world.request
    .get("/health")
    .set("origin", "https://test")
    .expect("access-control-allow-origin", "https://test");
});

it("CORS is enabled for preflight requests", () => {
  return world.request
    .options("/health")
    .set("origin", "https://test")
    .set("access-control-request-method", "POST")
    .expect("access-control-allow-origin", "https://test")
    .expect("access-control-allow-methods", "POST");
});

it("CORS is enabled for error responses", () => {
  return world.request
    .get("/invalid-endpoint")
    .set("origin", "https://test")
    .expect("access-control-allow-origin", "https://test");
});

afterEach(() => world.destroy());
