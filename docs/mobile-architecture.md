# Mobile and native alarm architecture

## Decision

Use React Native with TypeScript for the shared product experience, backed by a small, serious native alarm engine in Kotlin (Android) and Swift (iOS). Use a bare React Native app with the New Architecture/Turbo Modules; do not make the core alarm depend on JavaScript, a generic notifications library, a remote push, or a running app process.

React Native owns onboarding, authentication, circles, alarm creation, invite and verification screens, backend synchronization, escalation UI, analytics, and payments. Native code owns platform scheduling, alarm presentation, audio behavior, permissions, persistence, reboot recovery, and alarm events.

## Platform responsibilities

### Android / Kotlin

- Exact alarm eligibility and user education.
- AlarmManager scheduling with a persisted native schedule ID.
- Full-screen alarm activity and foreground-service behavior where required.
- Alarm audio, notification channel, and DND-policy handling within user and platform permissions.
- Boot and app-update rescheduling.
- A durable local event log when the app or network is unavailable.
- Device-capability checks for OEM battery restrictions and revoked permissions.

### iOS / Swift

- AlarmKit authorization and scheduling where available and authorized by the user.
- Local alarm lifecycle, state persistence, and callbacks to the app.
- Clear fallback behavior when an alarm capability or authorization is unavailable.
- Synchronization of completed local events once connectivity returns.

Do not promise that iOS allows remote silent-switch, ringer-volume, or arbitrary call control. Do not infer that an Android capability is available on every device.

## Native module contract

Keep the JavaScript boundary small and versioned.

```ts
NativeAlarm.schedule({
  alarmId,
  scheduleVersion,
  fireAtUtc,
  timezone,
  escalationAtUtc,
  soundProfile,
  verificationType,
})

NativeAlarm.cancel(alarmId)
NativeAlarm.getStatus(alarmId)
NativeAlarm.addListener(
  "scheduled" | "fired" | "snoozed" | "dismissed" |
  "verified" | "permissionChanged" | "scheduleFailed"
)
```

`alarmId` and `scheduleVersion` are authoritative. When the server changes a time or an invitation is revoked, the native layer replaces or cancels the matching local version; it must never leave duplicate alarms behind.

## Two reliability paths

### Wake-up path: local and offline-first

1. The accepted device validates permissions and saves the schedule locally.
2. Native code schedules and fires the alarm at the local device.
3. The native layer records `fired`, `snoozed`, `dismissed`, or `verified` durably.
4. The app syncs those events to the backend when possible.

This path must work without a network connection.

### Social path: cloud-connected

Invitations, acceptance, group status, escalation notifications, proof uploads, and analytics use the backend. Push messages are useful coordination signals but never the only trigger for waking someone.

## Alarm state machine

```text
Draft -> Invited -> Accepted -> LocallyScheduled
                                  |
                                Fired -> Verified
                                  |
                              Escalated -> Resolved
```

Each transition must be idempotent. The device can retry an event after being offline without making duplicate schedules, alerts, or escalation runs.

## Test matrix before launch

Test real devices—not only emulators—for:

- App force-closed and device locked.
- No network and network restoration.
- Reboot after schedule creation.
- Low-power/battery-saver modes.
- Permission denied, revoked, or changed after scheduling.
- Silent/Focus/DND behavior as supported by each platform.
- Timezone travel and daylight-saving changes.
- Reschedule, cancellation, and multiple-device acceptance.
- Duplicate delivery and delayed synchronization.

The core UX must expose a clear "local alarm scheduled" and "permission needs attention" state before an important alarm is trusted.
