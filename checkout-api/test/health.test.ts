import { World } from "./world";

let world: World;

beforeEach(() => {
  world = new World();
  return world.startService();
});

it("starts healthy", async () => {
  return world.request.get("/health").expect(200);
});

it("becomes unhealthy when there's a crash", async () => {
  process.emit("uncaughtException", new Error());
  return world.request.get("/health").expect(503);
});

afterEach(() => world.destroy());
