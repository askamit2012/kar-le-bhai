# Firebase and Google Cloud architecture

## Decision

Use Firebase and Google Cloud for identity, coordination, durable shared state, escalation orchestration, observability, and protected APIs. The cloud coordinates people and state; each recipient device remains responsible for locally scheduling and firing its authorized alarm.

## Service boundaries

| Need | Service | Notes |
| --- | --- | --- |
| Sign-in | Firebase Authentication | Start with phone and/or Google sign-in. |
| Shared operational state | Cloud Firestore | Invitations, circles, alarms, participant state, device capability, and audit events. |
| Client protection | Firebase App Check | Protect public backend resources from abuse. |
| Mobile notifications | Firebase Cloud Messaging + APNs | Coordination and escalation only; never the sole alarm trigger. |
| Small event reactions | Cloud Functions for Firebase | Firestore-triggered validation and fan-out. |
| Protected business workflows | Cloud Run | Schedule changes, escalation policy evaluation, and API endpoints. |
| Deferred escalation | Cloud Tasks | Schedule retryable escalation work; design handlers for at-least-once execution. |
| Time-based scans | Cloud Scheduler | Reconcile overdue schedules and trigger worker scans. |
| Media, if later needed | Cloud Storage | Use only for explicit proof uploads with short retention. |
| Reliability telemetry | Crashlytics, Performance Monitoring, Cloud Logging | Separate permission/scheduling failures from normal product analytics. |

## Data model

Use Firestore documents with subcollections and explicit server timestamps. Suggested collections:

```text
users/{userId}
devices/{deviceId}
circles/{circleId}
circles/{circleId}/members/{userId}
alarms/{alarmId}
alarms/{alarmId}/participants/{userId}
alarms/{alarmId}/deviceSchedules/{deviceId}
alarms/{alarmId}/events/{eventId}
escalationRuns/{runId}
auditEvents/{eventId}
```

Store UTC instants for all events and retain the IANA timezone (for example, `Asia/Kolkata`) plus recurrence definition for a recurring alarm. This avoids incorrect behavior when people travel or daylight-saving rules change.

Important fields:

- `alarms`: creator, label, `fireAtUtc`, timezone, recurrence, version, verification and escalation policy.
- `participants`: role, invitation/acceptance state, visibility consent, verification state.
- `deviceSchedules`: platform, capability snapshot, local native schedule ID, version, `scheduled`/`fired`/`failed` status, last synchronization time.
- `events`: append-only, idempotency key, source device/service, server timestamp, and result.
- `escalationRuns`: deadline, deduplication key, outcome, attempts, and recipients.

## Core flows

### Create and accept a shared alarm

1. Creator writes a draft alarm and invites selected people.
2. Each invitee accepts explicitly and registers a device capability snapshot.
3. Client receives the current alarm version and asks the native module to schedule locally.
4. Client writes a schedule-confirmation event only after the native module succeeds.
5. Backend updates aggregate group status; it does not assume a push notification created a local alarm.

### Fire and verify

1. Native device fires the local alarm and records a local event.
2. The app presents the verification task and records verification locally.
3. When online, the client syncs idempotent events to Firestore.
4. Firestore/Cloud Run derives the shared status from accepted events.

### Escalate

1. Cloud Tasks schedules a job for the escalation deadline when the alarm becomes locally scheduled.
2. The worker checks the latest state, permissions, and idempotency key.
3. If not verified, it creates one escalation run, sends FCM/APNs notifications, and exposes manual one-tap call/message actions.
4. A retry must observe the existing escalation run and must not alert contacts twice.

## Security and privacy

- Firestore Security Rules restrict reads/writes to authenticated circle members and permitted roles.
- Clients can write only validated event shapes for themselves; privileged changes and escalation dispatch run through Cloud Run/Functions.
- Use App Check and rate limits for invite, verification, and escalation endpoints.
- Validate authorization server-side even when Security Rules apply.
- Store no raw contact book by default. Make media proof optional, encrypt in transit, use short retention, and allow deletion.
- Keep audit events for permission-sensitive changes: invite, acceptance, revocation, policy change, and escalation.

## Reliability rules

- All mutable workflows use `alarmId` + `scheduleVersion` and idempotency keys.
- Cloud Tasks delivery is at least once; every worker must be safe to repeat.
- FCM/APNs delivery is not a wake-up guarantee.
- A background reconciliation job can identify devices that did not report local schedule confirmation, but must never claim a device will wake a person without confirmation.
- Track permission changes and native scheduling failures as first-class operational events.

## Initial deployment

Use separate Firebase/GCP projects for development, staging, and production. Version Firestore rules, indexes, Functions configuration, Cloud Run deployment settings, and environment definitions in the repository. Begin with a single Cloud Run service organized by domain modules, not microservices.
