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
