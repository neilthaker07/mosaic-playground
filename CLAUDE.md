# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Context

This repo is used for an AI-assisted coding test for a Senior Software Engineer
candidate/role.

## Project state

This is a stock Vite `react-ts` scaffold (React 19 + TypeScript + Vite). No router or state
management has been added — treat additions as new architectural decisions rather than
following an established pattern. A test framework (Jest) has been added — see below.

## Commands

- `npm run dev` — start the Vite dev server with HMR (default: http://localhost:5173)
- `npm run build` — type-check (`tsc -b`) then production-build (`vite build`) into `dist/`
- `npm run preview` — serve the built `dist/` locally to sanity-check a production build
- `npm run lint` — run oxlint (see `.oxlintrc.json`)
- `npm run test` — run the Jest test suite once (`npx jest <name>` to run one file/pattern)
- `npm run test:watch` — run Jest in watch mode, rerunning on file changes

There is no standalone `tsc --noEmit` script; type-checking only happens as part of
`npm run build`, or live via the editor's TS language server. `npm run test` does not
type-check (Babel just strips types) — a type error can pass tests but still fail the build.

## Architecture

- Type-checking and compilation are split across two different tools:
  - `tsc -b` (via `npm run build`) only checks types (`noEmit: true` in both configs) and fails
    the build on type errors.
  - Vite/esbuild (via `@vitejs/plugin-react`) does the actual JSX/TS → JS compilation, both for
    the dev server (per-file, on demand) and for the production bundle (via Rollup). It does not
    check types — a type error will not stop `npm run dev` from serving.
- TypeScript config is split by runtime environment via project references:
  - `tsconfig.json` — root, no settings of its own; just references the two below.
  - `tsconfig.app.json` — covers `src/`, targets the browser (DOM lib, `jsx: react-jsx`).
  - `tsconfig.node.json` — covers `vite.config.ts` only, targets Node (Node types, no DOM).
- Linting uses oxlint (a Rust-based linter), not ESLint. Config lives in `.oxlintrc.json`. Its
  `plugins` list currently includes `react`, `typescript`, and `oxc`, but type-aware rules are
  not enabled — see the README for how to turn those on with `oxlint-tsgolint`.
- Tests run on Jest, not Vitest, deliberately: Vite is unused during `npm run test` entirely.
  `jest.config.cjs` + `babel.config.cjs` (both `.cjs` because `package.json` sets
  `"type": "module"`, and Jest's own config loader needs CommonJS) transform TS/JSX via
  `babel-jest`, independent of the Vite/esbuild pipeline used for `dev`/`build`. This mirrors the
  existing type-check/compile split above: Babel does not check types, so `tsc -b` (via
  `npm run build`) is still the only thing that catches type errors.
  - `jest.config.cjs` maps CSS imports to `identity-obj-proxy` and image imports to
    `src/test/fileMock.cjs`, since Jest (unlike Vite) can't load those file types natively.
  - `src/test/jest.setup.ts` (wired via `setupFilesAfterEnv`) extends `expect` with
    `@testing-library/jest-dom` matchers (`toBeInTheDocument`, `toHaveTextContent`, etc.).
  - `tsconfig.app.json` includes `"jest"` in `types` so `describe`/`it`/`expect`/`jest` type-check
    as globals — no per-file imports needed in test files.
