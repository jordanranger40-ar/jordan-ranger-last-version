// server.ts
import { createServer } from "http";
import next from "next";

import { clearExpiredCart } from "./app/models/db/lib/services/cart";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // start cron when server boots
  clearExpiredCart();

  const server = createServer((req, res) => {
    handle(req, res);
  });

  const port = Number(process.env.PORT || 3000);
  server.listen(port, () => {
    console.log(`> Server listening on http://localhost:${port}`);
  });
});
