# Product feasibility and MVP

## Decision

Build Kar Le Bhai as a trusted-circle wake-up accountability app, not as a remote phone-control app.

A person creates an important alarm (for example, a train, exam, shift, or gym commitment) and invites one to three trusted contacts. The recipient explicitly accepts, their device schedules an authorized local alarm, and the group can see only the minimum status required to coordinate. If the sleeper does not confirm that they are awake by the agreed deadline, trusted contacts receive an escalation alert and can choose to call or send a wake-up message.

## Why this problem is worth testing

Oversleeping and repeated snoozing are common, relatable problems, especially when a missed alarm has an immediate cost. Existing apps prove demand for forceful alarms and wake-up tasks, while social-accountability products show a smaller but meaningful interest in friends, couples, roommates, and teams helping one another follow through.

This should be positioned as a focused accountability product rather than a generic alarm-clock replacement. The clearest early users are:

- Students travelling for exams, classes, buses, or trains.
- Gym and running partners.
- Couples and roommates.
- Shift workers.
- Small travel groups with an early departure.

The core promise is: **a trusted person has your back when an important alarm needs follow-through.**

## Product boundary

Do not promise that another person can take control of a phone. iOS does not permit an app to remotely change another device's ringer state, system volume, or silent switch. Android behavior also varies by OS version, OEM settings, permissions, and policy. Automatic calls, disabling silent mode, unrestricted volume control, or permanent device-control permissions would introduce safety, privacy, reliability, and store-review risk.

Use opt-in, pre-authorized behavior instead:

- Each recipient schedules its own local alarm after accepting an invitation.
- The user chooses the alarm sound and required permissions on their own device.
- A backup local alarm can be scheduled a few minutes after the primary alarm.
- Buddies receive an escalation notification and can manually place a call or send a wake-up message.
- A user can revoke a buddy's access at any time.

## MVP scope

1. Sign in and create a trusted circle.
2. Create a one-time shared alarm with an IANA timezone and clear deadline.
3. Invite one to three contacts; require explicit acceptance.
4. Schedule a native local alarm on every accepted device.
5. Ask the sleeper to verify waking up using a simple check-in; start with a task or QR/barcode scan rather than a selfie.
6. Show the group only `scheduled`, `fired`, `not confirmed`, `verified`, or `escalated` status.
7. Notify trusted buddies after the escalation deadline and provide one-tap calling.
8. Maintain a simple private history of alarms and outcomes.

Defer recurring alarms, sleep tracking, AI, public leaderboards, automatic calls, remote volume controls, contact-book uploads, and advanced social gamification.

## Trust and privacy rules

- Every circle invitation and escalation policy is explicit and revocable.
- Do not upload contacts by default.
- Treat wake status, recordings, photos, and location as sensitive data; collect the minimum needed and set retention limits.
- Store audit events for invitations, acceptance, schedule changes, revocations, verification, and escalation.
- Avoid shaming mechanics. The app should feel supportive and predictable.

## Success metrics

The primary product metric is not downloads: it is the share of important alarms that are verified before escalation. Track activation (created alarm -> accepted invite -> local schedule confirmed), delivery of escalation alerts, verification time, repeat shared-alarm use, and permission failures.

## Rollout recommendation

Start Android-first for a six-to-eight-week MVP, because Android lets the team validate exact-alarm reliability and the social workflow quickly. Add iOS once the core workflow is proven, using AlarmKit and its user-authorized alarm capability. Test on locked devices, no-network conditions, reboot, low battery, silent/DND settings, and common Android OEM battery-management configurations before claiming reliability.
