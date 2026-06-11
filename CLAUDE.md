# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANTE — Ler no início de toda conversa

Sempre ler `IDEIAS_FUTURAS.TXT` na raiz do projeto e lembrar o usuário das ideias pendentes registradas lá.

## IMPORTANTE — Atualizar IDEIAS_FUTURAS.TXT

Sempre que algo novo for concluído durante a sessão — mesmo que pequeno (um som, um ajuste, uma feature) — adicionar um `[x]` com descrição curta na seção da data atual em `IDEIAS_FUTURAS.TXT`. Se a data não existir ainda, criar uma nova seção de data acima da linha divisória.

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

**Imagens interativas (botões, ícones clicáveis, hover):**
- Sempre passar pelo ImageMagick antes de usar no jogo:
  ```
  & "C:\Program Files\ImageMagick-7.1.2-Q16-HDRI\magick.exe" "arquivo.png" -trim +repage "arquivo.png"
  ```
- Isso remove bordas transparentes e faz o hit area casar com o visual real
- Para formas não-retangulares (setas, ícones irregulares): usar `pixelPerfect: true` no `setInteractive`

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
  game.ts                              # Entry point, config do Phaser, lista de cenas
  containers/
    index.ts                           # Cria e exporta o container Awilix
    registerServices.ts                # Registra todos os serviços como SINGLETON
  objects/
    player/
      PlayerLoader.ts                  # Registra animações do player no Phaser
      controller/
        PlayerObject.ts                # Sprite do player, funções de movimento
      services/
        PlayerService.ts               # Input, movimento, save periódico (3s), ESC
      utils/
        PlayerAnimations.ts            # Mapeamento de frames do spritesheet LPC
        PlayerCamera.ts                # Setup de câmera com bounds do mapa
  scenes/
    ConfigScene.ts                     # Cena overlay do painel de config (lançada por GameInputService)
    menu/
      MenuScene.ts                     # Cena inicial — assets globais, Novo Jogo / Continuar
    swamp/
      SwampLoaderScene.ts              # Carrega assets do bioma Swamp
      rooms/
        SpawnSwampRoom.ts              # Primeira room do Swamp
    highlands/
      rooms/                           # (futuro)
  services/
    AudioManagerService.ts             # Controla volume global e mute/unmute
    ConfigPanelService.ts              # Painel de config — init / show / openInGame / hide
    GameInputService.ts                # ESC → lança ConfigScene e pausa o jogo
    SaveManagerService.ts              # localStorage — save (merge parcial), load, clear, get
  types/
    global.d.ts                        # Tipos globais (imports de imagens e áudio)
    GameSaveTypes.ts                   # Tipo mestre do save — agrega todos os subTypes
    subTypes/
      PlayerLocationTypes.ts           # room: string, x: number, y: number
      ConfigTypes.ts                   # volume: number, isMuted: boolean
  utils/
    createGround.ts                    # Cria o chão base que preenche a sala
    createGroundChunk.ts               # Cria chunk de plataforma elevada com física
    Depth.ts                           # Constantes de profundidade (z-index)
    SoundVolume.ts                     # Constantes de volume por categoria

assets/
  menu/images/                         # background, botões do menu
  player/
    images/player.png                  # Spritesheet LPC do personagem
    audio/player-jump.ogg
    data/player.json                   # Config do gerador LPC (backup)
  swamp/
    images/                            # background, ground, árvores, pedras, coruja
    audio/                             # swamp-step.ogg, swamp-ambient.ogg, swamp-owl-call.ogg
  forest/images/                       # (assets futuros)
```

**Convenção de nomes:**
- Arquivos e classes de serviço terminam em `Service` (ex: `SaveManagerService`)
- Cenas: `{Area}LoaderScene` para loader, `{Descrição}{Area}Room` para rooms (ex: `SpawnSwampRoom`)
- Injeção de dependência: chave = nome da classe com primeira letra minúscula (ex: `saveManagerService`)

**Regra de carregamento — global vs por bioma:**
- `MenuScene` carrega tudo que é global (spritesheet do player, animações, áudio global)
- `{Area}LoaderScene` carrega APENAS assets do bioma com prefixo do bioma (`swamp-`, `forest-`, etc.)
- Nunca carregar assets globais dentro de um loader de bioma

**DI container** (`src/containers/`): Awilix `CLASSIC` injection mode — construtor recebe args posicionais, nunca destruct. Registrar em `registerServices.ts`. Resolver sempre no `create()`, nunca no `update()`.

**Path aliases** (`tsconfig.json`):
- `@scenes/*` → `src/scenes/`
- `@objects/*` → `src/objects/`
- `@services/*` → `src/services/`
- `@utils/*` → `src/utils/`
- `@containers/*` → `src/containers/`
- `@assets/*` → `assets/`

**Game config** (`src/game.ts`): 1280×720, `Scale.RESIZE`, arcade physics (gravity y: 1000), pixel art.

## Serviços

**AudioManagerService** — singleton. `init(scene)` vincula ao sound manager do Phaser. Controla `setVolume`, `mute`, `unmute`, `isMuted`. Deve ser iniciado na `MenuScene`.

**SaveManagerService** — singleton. Persiste no localStorage (`devaloka_save`). `save(patch)` faz merge parcial com `GameSaveTypes`. `get()` retorna cache em memória sem re-ler. `clear()` apaga tudo.

**ConfigPanelService** — singleton. `init(scene)` cria objetos do painel na cena informada (destrói os anteriores). `show()` exibe o painel sem pausar (uso no menu). `openInGame(scene)` pausa sons, pausa cena e lança `ConfigScene` como overlay. `hide()` fecha o painel, para `ConfigScene` e retoma a cena pausada.

**GameInputService** — singleton. `init(scene)` registra o listener de ESC que chama `configPanelService.openInGame(scene)`.

**ConfigScene** — cena overlay transparente, lançada via `gameScene.scene.launch('ConfigScene')`. Cria o dim overlay e chama `configPanelService.initOverlay(this)`. Não aparece na lista de cenas ativas do jogo, apenas quando o config está aberto.

## Sistema de Save (GameSaveTypes)

Tipo mestre em `src/types/GameSaveTypes.ts` agrega os subTypes de `src/types/subTypes/`. Para adicionar dados novos ao save: criar um subType em `subTypes/`, importar na mestra. Os subTypes nunca são usados diretamente fora da tipagem mestra.

```
GameSaveTypes
  └─ location: PlayerLocationTypes   (room, x, y)
  └─ config: ConfigTypes             (volume, isMuted)
```

`PlayerService` salva `location` a cada 3s quando o player está no chão. `MenuScene` lê `location.room` e roteia via `ROOM_TO_LOADER` para o loader correto. Cada room lê o save no `create()` para restaurar estado específico.

## Player Spritesheet

`assets/player/images/player.png` — LPC format, 64×64 per frame, 13 columns × 54 rows. Frame index = `row * 13 + col`. Mapeamento completo em `src/objects/player/utils/PlayerAnimations.ts`.

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

## Volume de Sons (SoundVolume)

Sempre consultar `src/utils/SoundVolume.ts` ao adicionar sons na cena. Usar a categoria correta:

- `PLAYER` — passos, pulo, combate e qualquer som do player
- `ENEMY` — sons de inimigos
- `AMBIENT` — sons de ambiente da room (vento, água, etc.)
- `MUSIC` — música de fundo
- `INTERFACE` — UI, itens, portais, interações com objetos do mundo

Sons com volume específico intencional (ajuste manual) podem usar valor direto sem consultar `SoundVolume`.

## Profundidade (Depth)

Sempre consultar `src/utils/Depth.ts` ao adicionar objetos na cena. Usar o depth correto:

- `FAR_BACKGROUND` — céu, névoa, background principal
- `BACKGROUND_2` — árvores e objetos distantes (atrás de tudo)
- `BACKGROUND_1` — árvores e objetos próximos ao player
- `GROUND_DEFAULT` — chão base da sala
- `MAIN` — chunks, plataformas, props com física (pedras, objetos interativos)
- `PLAYER` — player, sempre na frente
- `CONFIG` — painel de configurações, sempre acima de tudo (valor 100)

## Sites Úteis

- **remove.bg** — remover fundo de imagens (PNG transparente)
- **ElevenLabs** — gerar efeitos sonoros e músicas com IA (elevenlabs.io)
- **freesound.org** — biblioteca enorme de efeitos sonoros gratuitos, filtro por licença
- **OpenGameArt** — assets de áudio e arte específicos pra jogos, licença livre (opengameart.org)

## Convenções de Nomes

Ao sugerir nomes de arquivos de mídia (imagens, áudio, vídeo), nunca incluir a extensão.

## Code Style

Prettier: single quotes, semicolons, trailing commas (all), 2-space indent, 80-char line width, no arrow parens, auto line endings.
