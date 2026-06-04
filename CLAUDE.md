# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at localhost:8080 with hot reload
npm run build     # Production build → dist/bundle.js
npm run format    # Prettier format all .js and .ts files
npm run lint      # ESLint check on src/
npm run lint:fix  # ESLint auto-fix on src/
```

There are no tests configured in this project.

## Architecture

**Phaser 3 TypeScript browser game** with Webpack 5 bundling. Entry point is `src/game.ts` which creates the Phaser game instance and registers scenes.

**Scene lifecycle:**
1. `BootScene` — preloads all assets
2. `GameScene` — main game logic (runs after boot completes)

**Custom game objects** live in `src/objects/` and extend Phaser built-ins (e.g., `PhaserImg` extends `Phaser.Physics.Arcade.Image`).

**DI container** lives in `src/shared/containers/`. Uses Awilix with `CLASSIC` injection mode. Register new services in `registerServices.ts` and resolve them in scenes/handlers via `container.resolve<MyService>('myService')`.

**Path aliases** (configured in both `tsconfig.json` and `webpack.config.js` via `tsconfig-paths-webpack-plugin`):
- `@scenes/*` → `src/scenes/`
- `@objects/*` → `src/objects/`
- `@utils/*` → `src/utils/`
- `@assets/*` → `assets/`
- `@maps/*` → `maps/`

**Game config** (in `src/game.ts`): 375×812 resolution, arcade physics (gravity y: 1000), pixel art rendering, no antialiasing.

**Asset loading**: Images are handled by `file-loader` in Webpack. TypeScript types for image imports are declared in `src/global.d.ts`.

## Code Style

Prettier config: single quotes, semicolons, trailing commas (all), 2-space indent, 80-char line width, no arrow parens for single-arg functions, auto line endings.
