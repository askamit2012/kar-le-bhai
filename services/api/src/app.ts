import { RPCHandler } from "@orpc/server/fetch";
import { onError } from "@orpc/server";
import { Hono } from "hono";

import { router } from "./router.js";

const rpcHandler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export const app = new Hono();

app.get("/health", (context) =>
  context.json({ status: "ok", service: "kar-le-bhai-api" }),
);

app.use("/rpc/*", async (context, next) => {
  const result = await rpcHandler.handle(context.req.raw, {
    prefix: "/rpc",
    context: {},
  });

  if (result.matched) {
    return context.newResponse(result.response.body, result.response);
  }

  await next();
});
