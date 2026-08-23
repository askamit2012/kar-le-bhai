export const alarmLifecycle = [
  "draft",
  "invited",
  "accepted",
  "locallyScheduled",
  "fired",
  "verified",
  "escalated",
  "resolved",
] as const;

export type AlarmStatus = (typeof alarmLifecycle)[number];

export type DeviceScheduleStatus =
  | "pending"
  | "scheduled"
  | "fired"
  | "failed"
  | "cancelled";

export interface AlarmIdentity {
  alarmId: string;
  scheduleVersion: number;
}

/**
 * User profile entity representing a registered user in Kar Le Bhai.
 */

export interface UserProfile {
  id: string;
  phoneNumber: string;
  displayName: string;
  avatarUrl?: string;
  timezone: string;
  fcmToken?: string;
  createdAt: string; // ISO 8601 string timestamp
  updatedAt?: string; // ISO 8601 string timestamp
}

export type BuddyStatus = "pending" | "accepted" | "blocked";

/**
 * Relationship entity representing a connection between two users in a trusted circle.
 */

export interface BuddyRelationship {
  id: string;
  userId: string;
  buddyUserId: string;
  status: BuddyStatus;
  createdAt: string;
}