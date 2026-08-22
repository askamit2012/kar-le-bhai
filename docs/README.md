# Kar Le Bhai documentation

This directory records the product and technical decisions agreed before implementation.

## Documents

- [Product feasibility](product-feasibility.md): problem, target users, market signal, product boundary, and MVP.
- [Mobile architecture](mobile-architecture.md): React Native boundary and the native alarm engine.
- [Firebase and Google Cloud architecture](firebase-gcp-architecture.md): data flow, services, data model, security, and reliability.
- [Repository strategy](repository-strategy.md): the lightweight monorepo layout and delivery approach.

## Non-negotiable principle

Firebase coordinates people and state. The recipient device schedules and fires its own native alarm.

A remote push notification or server job must never be the only mechanism responsible for waking a person.
