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

**Custom game objects** live in `src/objects/` and extend Phaser built-ins.

**DI container** lives in `src/containers/`. Uses Awilix with `CLASSIC` injection mode. Register new services in `registerServices.ts` and resolve them in scenes via `container.resolve<MyService>('myService')`. Never call `container.resolve()` inside `update()` — resolve once in `create()` and store the reference.

**Path aliases** (configured in `tsconfig.json`, resolved by `tsconfig-paths-webpack-plugin`):
- `@scenes/*` → `src/scenes/`
- `@objects/*` → `src/objects/`
- `@services/*` → `src/services/`
- `@utils/*` → `src/utils/`
- `@assets/*` → `assets/`
- `@maps/*` → `maps/`

**Game config** (in `src/game.ts`): 1280×720, `Scale.RESIZE` (fills window), arcade physics (gravity y: 1000), pixel art rendering.

**Asset loading**: Images handled by `file-loader`. TypeScript types declared in `src/types/global.d.ts`.

## Player Spritesheet

`assets/player.png` — LPC format, 64×64 per frame, 13 columns × 54 rows. Frame index = `row * 13 + col`. Full mapping in `src/objects/player/PlayerAnimations.ts`.

Direction order within each animation group: `+0=up`, `+1=left`, `+2=down`, `+3=right`.

| Animation | Rows | Frames | Descrição |
|---|---|---|---|
| `walk` | 8–11 | 9 | Andar |
| `run` | 38–41 | 8 | Correr |
| `idle` | 22–25 | 2 | Parado |
| `jump` | 26–29 | 4 | Pular/cair |
| `hurt` | 20 | 6 | Tomar dano (1 dir) |
| `climb` | 21 | 6 | Escalar (1 dir) |
| `sit` | 30–33 | 3 | Sentar |
| `emote` | 34–37 | 3 | Gesto/emoção |
| `combat_idle` | 42–45 | 2 | Parado em combate |
| `spellcast` | 0–3 | 7 | Lançar magia |
| `slash` | 12–15 | 6 | Ataque horizontal |
| `thrust` | 4–7 | 8 | Ataque frontal |
| `shoot` | 16–19 | 13 | Atirar com arco |
| `slash_1h` | 50–53 | 13 | Ataque diagonal baixo |
| `backslash_1h` | 54–57 | 13 | Ataque diagonal cima |
| `halfslash_1h` | 58–61 | 13 | Ataque médio diagonal |
| `watering` | 46–49 | 7 | Regar |

## Code Style

Prettier config: single quotes, semicolons, trailing commas (all), 2-space indent, 80-char line width, no arrow parens for single-arg functions, auto line endings.
