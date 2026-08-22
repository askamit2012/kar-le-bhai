# Kar Le Bhai

Kar Le Bhai is a trusted-circle wake-up accountability app. The app uses a local native alarm for wake-up reliability, while Firebase/Google Cloud coordinate invitations, verification, and escalation.

## Workspace

```text
apps/mobile                 React Native app and future Kotlin/Swift alarm TurboModule
services/api                Cloud Run-ready Hono API hosting the oRPC router
packages/domain             Shared alarm lifecycle and domain types
packages/api-contract       Contract-first oRPC procedures and Zod schemas
packages/config             Shared TypeScript configuration
infra                       Firebase/GCP configuration (added when the Firebase project is provisioned)
```

The API is deliberately **contract-first**: `packages/api-contract` defines request, response, validation, and HTTP route metadata; `services/api` implements it; `apps/mobile` consumes the same contract through a typed oRPC client. This follows oRPC's recommended workspace layout and avoids duplicating request types.

## Prerequisites

- Node.js 22+
- Corepack-enabled pnpm 11
- Android Studio/JDK for Android development; Xcode for iOS development

## Start locally

```powershell
pnpm install
pnpm --filter @kar-le-bhai/api dev
pnpm --filter @kar-le-bhai/mobile android
```

The Android emulator reaches the local API through `http://10.0.2.2:8787/rpc`. A physical-device and iOS configuration will use environment-specific API URLs before release.

## Verify

```powershell
pnpm typecheck
```

## Next implementation milestones

1. Provision Firebase dev/staging/production projects and add Auth, App Check, Firestore rules, indexes, and emulators under `infra/`.
2. Add Firebase ID-token verification to the oRPC context and enforce circle membership in procedures.
3. Implement the Android Kotlin alarm TurboModule, including exact-alarm checks, native persistence, boot recovery, and full-screen alarm handling.
4. Replace the in-memory `alarm.create` scaffold with Firestore persistence and idempotency keys.
5. Add Cloud Tasks-backed escalation and FCM/APNs notification fan-out; neither replaces local alarm scheduling.
