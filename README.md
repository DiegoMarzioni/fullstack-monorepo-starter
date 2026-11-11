<div align="center">
  <h1>Full Stack Monorepo Starter</h1>
  <p>Next.js web app + Expo mobile app sharing types, validation and business logic in one Turborepo.</p>

  <img src="https://img.shields.io/badge/Turborepo-EF4444?style=flat-square&logo=turborepo&logoColor=white" alt="Turborepo"/>
  <img src="https://img.shields.io/badge/pnpm-F69220?style=flat-square&logo=pnpm&logoColor=white" alt="pnpm"/>
  <img src="https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white" alt="Expo"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white" alt="Zod"/>
  <img src="https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white" alt="Vitest"/>
</div>

---

## Why

Most products need a web app **and** a mobile app. Duplicating models and validation in both drifts fast. This starter keeps that logic in one typed package that both apps import, so a rule changes in one place and both clients get it.

The demo is a small "Shared Todos" app: the same Zod schema validates input on web and mobile, and the same pure helpers create, toggle and summarize todos.

## Structure

```
fullstack-monorepo-starter/
├── apps/
│   ├── web/          # Next.js 15 (App Router) + Tailwind CSS
│   └── mobile/       # Expo (React Native)
└── packages/
    ├── shared/       # Zod schemas, types and pure helpers (+ Vitest tests)
    └── tsconfig/     # Shared strict TypeScript config
```

## Getting started

**Requirements:** Node.js 20+ and pnpm 9 (`corepack enable`).

```bash
pnpm install
pnpm --filter @starter/shared build   # build the shared package once

pnpm --filter @starter/web dev        # web on http://localhost:3000
pnpm --filter @starter/mobile dev     # Expo dev server (scan the QR with Expo Go)
```

Run all checks like CI does:

```bash
pnpm turbo run typecheck test
```

## Monorepo notes

- **One React version.** `pnpm.overrides` pins React for the whole workspace, and `apps/mobile/metro.config.js` always resolves `react` / `react-native` from the mobile app. Two React copies in one bundle is the classic cause of "Invalid hook call" crashes in Expo monorepos.
- **Flat `node_modules`.** `.npmrc` uses `node-linker=hoisted`, which Metro handles more reliably than pnpm's symlinked layout.
- **Turborepo pipeline.** `typecheck` and `test` depend on `^build`, so the shared package is always compiled before the apps use it.

## CI

GitHub Actions runs install, typecheck, unit tests and the web production build on every push and pull request.

## Roadmap

- [ ] Shared UI tokens (colors, spacing) consumed by Tailwind and React Native
- [ ] API app (NestJS) using the same schemas for request validation
- [ ] Persist todos on mobile (AsyncStorage)
- [ ] E2E tests

## License

MIT · Made by [Diego Marzioni](https://diegomarzioni.github.io)
