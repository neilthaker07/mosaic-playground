# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Context

This repo is used for an AI-assisted coding test by Mosaic for a Senior Software Engineer
candidate/role.

## Project state

This is a stock Vite `react-ts` scaffold (React 19 + TypeScript + Vite). No router, state
management, or test framework has been added yet — treat additions as new architectural
decisions rather than following an established pattern.

## Commands

- `npm run dev` — start the Vite dev server with HMR (default: http://localhost:5173)
- `npm run build` — type-check (`tsc -b`) then production-build (`vite build`) into `dist/`
- `npm run preview` — serve the built `dist/` locally to sanity-check a production build
- `npm run lint` — run oxlint (see `.oxlintrc.json`)

There is no test runner configured. There is no standalone `tsc --noEmit` script; type-checking
only happens as part of `npm run build`, or live via the editor's TS language server.

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
