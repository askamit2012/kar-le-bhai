import { serve } from "@hono/node-server";

import { app } from "./app.js";

const port = Number(process.env.PORT ?? 8787);

serve({ fetch: app.fetch, port, hostname: "0.0.0.0" }, () => {
  console.log(`Kar Le Bhai API listening on http://0.0.0.0:${port}`);
});
