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

// --- User Contracts ---
export const getProfileContract = oc
  .route({ method: "GET", path: "/users/profile" })
  .input(
    z.object({
      id: z.string().optional(), // If omitted, resolves to current user
    })
  )
  .output(
    z.object({
      id: z.string(),
      phoneNumber: z.string(),
      displayName: z.string(),
      avatarUrl: z.string().optional(),
      timezone: z.string(),
      fcmToken: z.string().optional(),
      createdAt: z.string(),
      updatedAt: z.string().optional()
    })
  )

export const syncProfileContract = oc
  .route({ method: "POST", path: "/users/profile/sync" })
  .input(
    z.object({
      displayName: z.string().trim().min(1).max(50),
      timezone: z.string().trim().min(1),
      fcmToken: z.string().trim().optional()
    })
  )
  .output(
    z.object({
      id: z.string(),
      phoneNumber: z.string(),
      displayName: z.string(),
      avatarUrl: z.string().optional(),
      timezone: z.string(),
      fcmToken: z.string().optional(),
      createdAt: z.string(),
      updatedAt: z.string().optional()
    })
  )

export const searchUsersContract = oc
  .route({ method: "GET", path: "/users/search" })
  .input(
    z.object({
      phoneNumber: z.string().trim().min(1)
    })
  )
  .output(
    z.array(
      z.object({
        id: z.string(),
        phoneNumber: z.string(),
        displayName: z.string(),
        avatarUrl: z.string().optional()
      })
    )
  )

// --- Central Router Contract Export ---

export const contract = {
  system: {
    health: healthContract,
  },
  alarm: {
    create: createAlarmContract,
  },
  user: {
    getProfile: getProfileContract,
    syncProfile: syncProfileContract,
    search: searchUsersContract
  }
};

export type AppContract = typeof contract;
