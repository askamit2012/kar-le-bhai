import { contract } from "@kar-le-bhai/api-contract";
import { implement } from "@orpc/server";

const os = implement(contract);

export const router = os.router({
  system: {
    health: os.system.health.handler(() => ({
      status: "ok",
      service: "kar-le-bhai-api",
    })),
  },
  alarm: {
    create: os.alarm.create.handler(({ input }) => ({
      id: crypto.randomUUID(),
      status: "draft",
      scheduleVersion: 1,
    })),
  },
});
