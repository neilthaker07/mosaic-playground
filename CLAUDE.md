# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Context

This repo is used for an AI-assisted coding test for a Senior Software Engineer
candidate/role.

## Project state

This is a Vite `react` scaffold (React 19 + JavaScript + Vite), converted from the original
TypeScript scaffold — plain JS/JSX throughout, no `tsc`/tsconfig in the toolchain. No router or
state management has been added — treat additions as new architectural decisions rather than
following an established pattern. A test framework (Jest) has been added — see below.

## Commands

- `npm run dev` — start the Vite dev server with HMR (default: http://localhost:5173)
- `npm run build` — production-build (`vite build`) into `dist/`
- `npm run preview` — serve the built `dist/` locally to sanity-check a production build
- `npm run lint` — run oxlint (see `.oxlintrc.json`)
- `npm run test` — run the Jest test suite once (`npx jest <name>` to run one file/pattern)
- `npm run test:watch` — run Jest in watch mode, rerunning on file changes

## Architecture

- Vite/esbuild (via `@vitejs/plugin-react`) compiles JSX → JS, both for the dev server
  (per-file, on demand) and for the production bundle (via Rollup).
- Linting uses oxlint (a Rust-based linter), not ESLint. Config lives in `.oxlintrc.json`. Its
  `plugins` list currently includes `react` and `oxc`.
- Tests run on Jest, not Vitest, deliberately: Vite is unused during `npm run test` entirely.
  `jest.config.cjs` + `babel.config.cjs` (both `.cjs` because `package.json` sets
  `"type": "module"`, and Jest's own config loader needs CommonJS) transform JS/JSX via
  `babel-jest`, independent of the Vite/esbuild pipeline used for `dev`/`build`.
  - `jest.config.cjs` maps CSS imports to `identity-obj-proxy` and image imports to
    `src/test/fileMock.cjs`, since Jest (unlike Vite) can't load those file types natively.
  - `src/test/jest.setup.js` (wired via `setupFilesAfterEnv`) extends `expect` with
    `@testing-library/jest-dom` matchers (`toBeInTheDocument`, `toHaveTextContent`, etc.).
