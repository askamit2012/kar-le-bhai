export type NativeAlarmEvent =
  | "scheduled"
  | "fired"
  | "snoozed"
  | "dismissed"
  | "verified"
  | "permissionChanged"
  | "scheduleFailed";

export interface NativeAlarmScheduleRequest {
  alarmId: string;
  scheduleVersion: number;
  fireAtUtc: string;
  timezone: string;
  escalationAtUtc: string;
  verificationType: "task" | "qr";
}

/** Kotlin and Swift will implement this TurboModule; JavaScript never owns alarm firing. */
export interface NativeAlarmModule {
  schedule(request: NativeAlarmScheduleRequest): Promise<void>;
  cancel(alarmId: string): Promise<void>;
  getStatus(alarmId: string): Promise<"scheduled" | "failed" | "unknown">;
  addListener(event: NativeAlarmEvent, listener: () => void): () => void;
}
