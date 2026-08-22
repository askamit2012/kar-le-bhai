import { oc } from "@orpc/contract";
import { z } from "zod";

export const healthContract = oc
  .route({ method: "GET", path: "/health" })
  .output(
    z.object({
      status: z.literal("ok"),
      service: z.literal("kar-le-bhai-api"),
    }),
  );

export const createAlarmContract = oc
  .route({ method: "POST", path: "/alarms" })
  .input(
    z.object({
      title: z.string().trim().min(1).max(120),
      fireAtUtc: z.string().datetime(),
      timezone: z.string().trim().min(1),
      escalationDelayMinutes: z.number().int().min(1).max(60).default(5),
    }),
  )
  .output(
    z.object({
      id: z.string(),
      status: z.literal("draft"),
      scheduleVersion: z.literal(1),
    }),
  );

export const contract = {
  system: {
    health: healthContract,
  },
  alarm: {
    create: createAlarmContract,
  },
};

export type AppContract = typeof contract;
