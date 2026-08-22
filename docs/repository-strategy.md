# Repository strategy

## Decision

Use a lightweight TypeScript monorepo from day one. The mobile client, Firebase Functions, Cloud Run service, infrastructure configuration, and shared alarm contract will change together during the MVP. Keeping them in one repository avoids versioning and coordination overhead while retaining a clear path to grow.

Use pnpm workspaces for dependency management and Turborepo only for task ordering and build caching at first.

## Target layout

```text
kar-le-bhai/
├─ apps/
│  ├─ mobile/                 # bare React Native app; ios/ and android/ live here
│  └─ admin/                  # optional later: internal support/admin web app
├─ services/
│  └─ api/                    # Cloud Run service, organized as domain modules
├─ functions/                 # Firebase event-triggered functions
├─ packages/
│  ├─ domain/                 # alarm, circle, participant, event/state-machine types
│  ├─ firebase/               # Firestore paths, converters, shared validation
│  └─ config/                 # TypeScript, lint, test configuration
├─ infra/                     # Firebase config, rules, indexes, deployment/IaC
├─ docs/                      # architecture decisions and operational runbooks
├─ pnpm-workspace.yaml
├─ turbo.json
└─ package.json
```

Add `packages/ui` only if an admin/web app has a genuine need for shared UI. Keep Kotlin and Swift alarm implementations inside `apps/mobile`; native alarm behavior is platform infrastructure, not a generic package.

## Shared contract

Define domain types centrally so the client and backend cannot silently disagree about an alarm's lifecycle.

```text
Alarm: Draft -> Invited -> Accepted -> LocallyScheduled -> Fired -> Verified | Escalated -> Resolved
```

Use an explicit versioned command/event contract with UTC timestamps, an IANA timezone for human schedules, actor/device IDs, and idempotency keys. The backend validates all state transitions; the mobile app treats native scheduling confirmation as a distinct event rather than assuming cloud acknowledgement means an alarm exists locally.

## Delivery plan

### Phase 1: foundation

- Initialize the bare React Native app and native Alarm module boundary.
- Set up Firebase projects, Auth, Firestore rules, emulator support, and Crashlytics.
- Add shared domain types, linting, tests, CI, and environment configuration.

### Phase 2: one-time shared alarm MVP

- Circles, invitation/acceptance, local scheduling confirmation, native alarm UI, and verification.
- Cloud Run/Functions flow for status aggregation and Cloud Tasks escalation.
- Device and failure telemetry, plus real-device reliability testing.

### Phase 3: controlled expansion

- Recurrence, richer verification options, admin/support tooling, additional localization, and retention experiments.
- Split packages or services only when independent deployment, ownership, or scaling is proven necessary.

## What not to do yet

- Do not split mobile, backend, and infrastructure into separate repositories.
- Do not create microservices. Start with one Cloud Run service with domain modules.
- Do not turn every folder into a package.
- Do not share native alarm code across platforms artificially.
- Do not adopt a generic notification package as the source of truth for alarm execution.

This setup supports a six-to-eight-week Android-first MVP while leaving a practical route to iOS, an admin console, analytics workers, and future web surfaces.
