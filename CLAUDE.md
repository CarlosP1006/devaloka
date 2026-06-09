# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANTE — Ler no início de toda conversa

Sempre ler `IDEIAS_FUTURAS.TXT` na raiz do projeto e lembrar o usuário das ideias pendentes registradas lá.

## IMPORTANTE — Geração de imagens / prompts para IA

Sempre que o usuário pedir um prompt para gerar imagem, consultar os padrões abaixo antes de escrever o prompt.

### Resoluções e padrões de assets

**Resolução da sala:** 2560 × 720px (2 telas de 1280px)

**Background:**
- Resolução: 2560 × 720px
- Formato: PNG ou JPG, imagem única sem divisórias, não precisa de transparência

**Tile de chão:**
- Tamanho final: 2322 × 739px
- Após receber da IA: redimensionar para 2322×739 com PowerShell

**Objetos decorativos (árvores, pedras, props):**
- PNG com fundo transparente real (alpha channel)
- Hard pixel edges, sem anti-aliasing, sem semi-transparência
- Tamanho livre — escala é controlada no código via `setScale()`
- Física feita com retângulo invisível separado da imagem visual

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

**Phaser 3 TypeScript browser game** com Webpack 5. Entry point: `src/game.ts`.

**Estrutura de pastas:**
```
src/
  game.ts                        # Entry point, config do Phaser
  containers/                    # DI container (Awilix)
  objects/                       # Objetos físicos do jogo (estendem Phaser)
    player/
      PlayerObject.ts            # Sprite do player, funções de movimento
      PlayerAnimations.ts        # Mapeamento de frames do spritesheet LPC
      PlayerLoader.ts            # Registra animações no Phaser
  scenes/                        # Cenas do jogo, organizadas por área
    swamp/
      SwampLoadingScene.ts       # Carrega assets do Swamp
      SwampRoomScene.ts          # Lógica da fase Swamp
  services/                      # Lógica de gameplay (input, IA, combate)
    PlayerService.ts
  types/
    global.d.ts                  # Tipos globais (imports de imagens)
  utils/                         # Utilitários gerais

assets/
  player/
    images/player.png            # Spritesheet LPC do personagem
    audio/                       # Sons do player
    data/player.json             # Config do gerador LPC (backup)
  maps/                          # Tilemaps Tiled (.json)
```

**Convenção de nomes de cenas:**
- `{Area}LoadingScene` — carrega assets da área, registra animações
- `{Area}RoomScene` — lógica da fase, objetos, colisões, transições

**Regra de carregamento — global vs por bioma:**
- `MenuScene` é a primeira cena e carrega tudo que é global (usado em qualquer bioma): spritesheet do player, animações do player, AudioManager (futuro), etc.
- `{Area}LoaderScene` carrega APENAS assets específicos daquele bioma (prefixo `swamp-`, `forest-`, etc.)
- Nunca carregar assets globais dentro de um loader de bioma

**DI container** (`src/containers/`): Awilix `CLASSIC` injection mode. Registrar serviços em `registerServices.ts`. Resolver sempre no `create()`, nunca no `update()`.

**Path aliases** (`tsconfig.json`):
- `@scenes/*` → `src/scenes/`
- `@objects/*` → `src/objects/`
- `@services/*` → `src/services/`
- `@utils/*` → `src/utils/`
- `@assets/*` → `assets/`
- `@maps/*` → `maps/`

**Game config** (`src/game.ts`): 1280×720, `Scale.RESIZE`, arcade physics (gravity y: 1000), pixel art.

## Player Spritesheet

`assets/player/images/player.png` — LPC format, 64×64 per frame, 13 columns × 54 rows. Frame index = `row * 13 + col`. Mapeamento completo em `src/objects/player/PlayerAnimations.ts`.

Direções por animação: `+0=up`, `+1=left`, `+2=down`, `+3=right`.

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
| `watering` | 46–49 | 7 | Regar |

## Profundidade (Depth)

Sempre consultar `src/utils/Depth.ts` ao adicionar objetos na cena. Usar o depth correto:

- `FAR_BACKGROUND` — céu, névoa, background principal
- `BACKGROUND_2` — árvores e objetos distantes (atrás de tudo)
- `BACKGROUND_1` — árvores e objetos próximos ao player
- `GROUND_DEFAULT` — chão base da sala
- `MAIN` — chunks, plataformas, props com física (pedras, objetos interativos)
- `PLAYER` — player, sempre na frente

## Code Style

Prettier: single quotes, semicolons, trailing commas (all), 2-space indent, 80-char line width, no arrow parens, auto line endings.
