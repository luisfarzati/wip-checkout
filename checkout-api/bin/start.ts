import { createService } from "../lib/service";
import { ServiceOptions } from "../lib/types";

const service = createService((process.env as unknown) as ServiceOptions);
const server = service.listen(3001, process.env.HTTP_HOST);

process.on("SIGTERM", () => {
  service.emit("shutdown");
  server.close();
});
