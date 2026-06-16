# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANTE — Ler no início de toda conversa

Sempre ler `IDEIAS_FUTURAS.TXT` na raiz do projeto e lembrar o usuário das ideias pendentes registradas lá.

## IMPORTANTE — Atualizar IDEIAS_FUTURAS.TXT

Sempre que algo novo for concluído durante a sessão — mesmo que pequeno (um som, um ajuste, uma feature) — adicionar um `[x]` com descrição curta na seção da data atual em `IDEIAS_FUTURAS.TXT`. Se a data não existir ainda, criar uma nova seção de data acima da linha divisória.

Ao registrar o `[x]`, **sempre verificar a seção `## IDEIAS FUTURAS`** (abaixo da linha divisória) e remover o item correspondente se ele estiver listado lá como pendente.

## IMPORTANTE — Commits

Nunca executar `git commit`. Quando o usuário pedir um commit, apenas sugerir a mensagem no formato `tipo: descrição` (ex: `feat: ...`, `fix: ...`, `refactor: ...`). A mensagem deve cobrir tudo que foi feito desde o último commit pedido, ou tudo que foi feito na conversa até aquele momento.

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
    config/
      ConfigScene.ts                   # Cena overlay do painel de config (lançada por GameInputService)
    menu/
      MenuScene.ts                     # Cena inicial — assets globais, Novo Jogo / Continuar
    swamp/
      SwampLoaderScene.ts              # Carrega assets do bioma Swamp
      rooms/
        SpawnSwampRoom.ts              # Primeira room do Swamp
        ForestSwampRoom.ts             # Segunda room do Swamp
    highlands/
      rooms/                           # (futuro)
  services/
    AudioManagerService.ts             # Controla volume global e mute/unmute
    ConfigPanelService.ts              # Painel de config — init / show / openInGame / hide
    GameInputService.ts                # ESC → lança ConfigScene e pausa o jogo
    SaveManagerService.ts              # localStorage devaloka_save_N — save, load, clear, get
    GlobalSaveService.ts               # localStorage devaloka_config — preferências globais (nunca reseta)
    SaveSlotPanelService.ts            # Painéis de Novo Jogo / Continuar / Slots cheios / Confirmar exclusão
  types/
    GameSaveTypes.ts                   # Tipo mestre do save de jogo — agrega gameTypes/
    GlobalSaveTypes.ts                 # Tipo mestre do save global — agrega globalTypes/
    declarations/
      global.d.ts                      # Declarações de módulos (imports de imagens e áudio)
      SaveSlotKey.ts                   # Tipo literal dos 3 slots — 'devaloka_save_1' | '_2' | '_3'
      ChapterTypes.ts                  # ChapterKey literal + CHAPTER_NAMES mapa de tradução (PT-BR)
    gameTypes/
      PlayerLocationTypes.ts           # room: string, x: number, y: number
      SlotInfoTypes.ts                 # playerName, playTime, chapter
    globalTypes/
      ConfigTypes.ts                   # volume: number, isMuted: boolean, musicMenuIsMuted
  utils/
    createGround.ts                    # Cria o chão base que preenche a sala
    createGroundChunk.ts               # Cria chunk de plataforma elevada com física
    createTransitionLine.ts            # Cria zona de transição entre rooms — consulta DoorLinks
    DoorLinks.ts                       # Mapa central de portas: tag → { loader, targetRoom, spawnX, spawnY }
    Depth.ts                           # Constantes de profundidade (z-index)
    ButtonHelper.ts                    # Factories de botão de pedra — makeStoneButton, addStoneHover
    DEV_PRINT_SAVE.ts                  # APAGAR ANTES DO BUILD FINAL — imprime save ativo no console (Ç)

assets/
  menu/images/                         # background, botões do menu
  player/
    images/player.png                  # Spritesheet LPC do personagem (base, sem arma)
    images/player-sword.png            # Spritesheet LPC com espada (rows 54-69 = ataques oversize 128px)
    images/player-sling.png            # Spritesheet LPC com estilingue (futuro)
    audio/player-jump.ogg
  swamp/
    images/                            # background, ground, árvores, pedras, coruja
    audio/                             # swamp-step.ogg, swamp-ambient.ogg, swamp-owl-call.ogg
  forest/images/                       # (assets futuros)
```

**Convenção de nomes:**
- Arquivos e classes de serviço terminam em `Service` (ex: `SaveManagerService`)
- Cenas: `{Area}LoaderScene` para loader, `{Descrição}{Area}Room` para rooms (ex: `SpawnSwampRoom`)
- Injeção de dependência: chave = nome da classe com primeira letra minúscula (ex: `saveManagerService`)
- Tags de porta: `{room-descricao}-{capitulo}-room-door-{numero}` (ex: `spawn-swamp-room-door-1`)

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

Não existe alias `@types/` — imports de `src/types/` devem usar caminhos relativos.

**Game config** (`src/game.ts`): 1280×720, `Scale.RESIZE`, arcade physics (gravity y: 1400), pixel art.

## Serviços

**AudioManagerService** — singleton. `init(scene)` vincula ao sound manager do Phaser. Controla `setVolume`, `mute`, `unmute`, `isMuted`. Deve ser iniciado na `MenuScene`.

**SaveManagerService** — singleton. Persiste no localStorage (`devaloka_save_1` / `_2` / `_3`). `save(patch)` faz merge parcial com `GameSaveTypes`. `get()` retorna cache em memória sem re-ler. `clear()` apaga o slot ativo. Nunca toca o `devaloka_config`.

**GlobalSaveService** — singleton. Persiste no localStorage (`devaloka_config`). Guarda preferências globais do usuário (`ConfigTypes`: volume, isMuted, musicMenuIsMuted) e `activeSlot`. Nunca é apagado pelo Novo Jogo — é independente de qual slot de save está ativo.

**ConfigPanelService** — singleton. `init(scene)` cria objetos do painel na cena informada (destrói os anteriores). `show()` exibe o painel sem pausar (uso no menu). `openInGame(scene)` pausa sons, pausa cena e lança `ConfigScene` como overlay. `hide()` fecha o painel, para `ConfigScene` e retoma a cena pausada.

**GameInputService** — singleton. `init(scene)` registra o listener de ESC que chama `configPanelService.openInGame(scene)`.

**SaveSlotPanelService** — singleton. `showNewGame(scene, onClose, onStart)` mostra o painel de criação de save (ou slots cheios se todos ocupados). `showContinue(scene, onClose, onStart)` mostra os slots para continuar. Internamente: `buildBase` cria o fundo do painel, `addBackBtn` o botão VOLTAR, `buildNameInput` o input de nome, `buildContinuePanel` os slots clicáveis, `buildSlotsFullPanel` os slots para excluir, `buildDeleteConfirm` a confirmação de exclusão. Sempre destroir o painel anterior antes de construir um novo.

**ConfigScene** — cena overlay transparente, lançada via `gameScene.scene.launch('ConfigScene')`. Cria o dim overlay e chama `configPanelService.initOverlay(this)`. Não aparece na lista de cenas ativas do jogo, apenas quando o config está aberto.

## Sistema de Transição entre Rooms

### Fluxo completo
1. Room atual chama `createTransitionLine(scene, x, y, w, h, player, doorTag)`
2. Quando o player encosta na zona, a função consulta `DoorLinks[doorTag]` e chama `scene.start(loader, { targetRoom, spawnX, spawnY })`
3. O loader recebe `data.targetRoom` → inicia a room destino passando `{ spawnX, spawnY }`
4. A room destino usa `data.spawnX / data.spawnY` como posição do player; fallback para save, depois para default

### DoorLinks.ts
Arquivo central em `src/utils/DoorLinks.ts`. Toda porta do jogo tem uma entrada aqui.
Nunca definir destino ou spawn dentro da room — sempre via DoorLinks.

```ts
'spawn-swamp-room-door-1': {
  loader: 'SwampLoaderScene',
  targetRoom: 'ForestSwampRoom',
  spawnX: 47,
  spawnY: 166,
}
```

### Ao adicionar uma nova room
- Criar a room em `scenes/{bioma}/rooms/`
- Registrar no `game.ts`
- Adicionar ao `SWAMP_ROOMS` (ou equivalente) no loader do bioma
- Adicionar ao `ROOM_TO_LOADER` em `SaveSlotPanelService.ts`
- Adicionar as tags das portas em `DoorLinks.ts`
- Chamar `createTransitionLine` na room com a tag correspondente
- `create(data: { spawnX?: number; spawnY?: number })` — usar `data.spawnX/spawnY` com fallback pro save

## Sistema de Save

### localStorage
- `devaloka_config` — preferências globais (`GlobalSaveService`). Nunca apagado. Inclui `activeSlot`.
- `devaloka_save_1` / `devaloka_save_2` / `devaloka_save_3` — slots de jogo (`SaveManagerService`). Resetados individualmente no Novo Jogo.

### Tipagem
Para adicionar dados ao save de jogo: criar um subType em `src/types/gameTypes/`, importar em `GameSaveTypes.ts`.
Para adicionar dados globais: criar subType em `src/types/globalTypes/`, importar em `GlobalSaveTypes.ts`.
Os subTypes nunca são usados diretamente fora da tipagem mestra.

```
GameSaveTypes                          GlobalSaveTypes
  ├─ location: PlayerLocationTypes       └─ config: ConfigTypes
  │     (room, x, y)                          (volume, isMuted, musicMenuIsMuted)
  └─ slotInfo: SlotInfoTypes
        (playerName, playTime, chapter)
```

`PlayerService` salva `location` e `slotInfo.playTime` a cada 3s quando o player está no chão. `MenuScene` lê `location.room` e roteia via `ROOM_TO_LOADER` para o loader correto. Cada room lê o save no `create()` para restaurar estado específico.

`playTime` usa `Date.now()` para contar tempo real — continua acumulando mesmo quando o jogo está pausado pelo config panel.

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

## Profundidade (Depth)

Sempre consultar `src/utils/Depth.ts` ao adicionar objetos na cena. Usar o depth correto:

- `FAR_BACKGROUND` — céu, névoa, background principal
- `BACKGROUND_2` — árvores e objetos distantes (atrás de tudo)
- `BACKGROUND_1` — árvores e objetos próximos ao player
- `GROUND_DEFAULT` — chão base da sala
- `MAIN` — chunks, plataformas, props com física (pedras, objetos interativos)
- `PLAYER` — player, sempre na frente
- `CONFIG` — painel de configurações, sempre acima de tudo (valor 100)

## Sistema de Escala Responsiva

`TOTAL_TILES_VERTICAL = 14` em `createGroundChunk.ts`. Em qualquer tela: `tileH = screenHeight / 14` (dinâmico), `tileW = 139px` (fixo).

**Regra de posicionamento em rooms:**
- **X: sempre valor fixo em pixels** — o mapa tem 2560px de largura, maior que qualquer tela, então X não precisa escalar
- **Y: sempre relativo a `tileH` ou `groundTop`** — nunca hardcodar Y em pixels, senão quebra em resoluções diferentes

```ts
// ✅ correto
const { tileH, groundTop } = getTileSize(this);
objeto.setPosition(450, groundTop - 3 * tileH);

// ❌ errado
objeto.setPosition(450, 300); // Y hardcoded quebra em outras resoluções
```

Para adicionar props/objetos em rooms: defina X livremente, ajuste Y usando `groundTop` e múltiplos de `tileH`. Ao criar uma nova room, chamar `getTileSize(this)` no início do `create()`.

## Padrões de Performance

Regras estabelecidas após auditoria — aplicar em todo novo código.

### Toda room registra cleanup no SHUTDOWN

Rooms são iniciadas via `scene.start`, e singletons como `PlayerService` registram listeners no `scene.input` da room. Sem cleanup, esses listeners acumulam a cada transição. Obrigatório no `create()` de toda room:

```ts
this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
  this.input.removeAllListeners();
  this.input.keyboard?.removeAllListeners();
});
```

### Guard em `anims.create`

Animações são registradas no `AnimationManager` **global** do Phaser — não por cena. Rooms podem ser re-entradas e o `create()` roda de novo. Sem o guard, Phaser emite warning e ignora (não duplica), mas é trabalho desnecessário. Sempre:

```ts
if (!this.anims.exists('minha-anim')) {
  this.anims.create({ key: 'minha-anim', ... });
}
```

### Zone para física sem visual

Para colisão pura (hitbox invisível sem imagem associada), usar `scene.add.zone` em vez de `scene.add.rectangle`. Rectangle é um `GameObject` renderizável — mesmo com `alpha: 0` entra no pipeline de render e passa por cull check todo frame. Zone não renderiza.

```ts
// ✅ correto
const zone = scene.add.zone(x, y, w, h);
group.add(zone);

// ❌ evitar para física pura
scene.add.rectangle(x, y, w, h, 0, 0); // renderizável mesmo invisível
```

### Singleton com TimerEvent — guardar referência

Serviços singleton têm `init()` chamado a cada nova room. Timers criados via `scene.time.addEvent` ficam presos na cena antiga se não forem removidos. Sempre guardar a referência e dar `.remove()` antes de recriar:

```ts
private myTimer: Phaser.Time.TimerEvent | null = null;

init(...): void {
  if (this.myTimer) this.myTimer.remove();
  this.myTimer = scene.time.addEvent({ ... });
}
```

### Webpack — modo por ambiente

`npm run build` → `mode: production` (minificação + tree-shaking habilitados automaticamente via `argv.mode`). `npm run dev` → `mode: development`. Não hardcodar `mode` no config — já está resolvido via função `(_env, argv) => ({...})` no `webpack.config.js`.

### Assets de imagem — tamanho máximo recomendado

- **Backgrounds** (2560×720): JPG, sem canal alpha. PNG só se tiver transparência real.
- **Tiles de chão**: dimensionar próximo ao tamanho de display final × 2 (para nitidez). Tiles fonte de 2322×739 exibidos a 6% (≈139px) são ~50× maiores que o necessário.
- **Props/decoração**: PNG com transparência, tamanho livre — escala via `setScale()`.
- **Áudio**: OGG para todos os efeitos. Nunca manter `.wav` junto de `.ogg` do mesmo arquivo — manter só o `.ogg`.

## Botões de Pedra (ButtonHelper)

Sempre usar `@utils/ButtonHelper` ao criar botões sobre `menu-item-bg`. Nunca escrever o padrão de hover/clique manualmente.

- `makeStoneButton(scene, x, y, sx, sy, depth, label, color, onClick, fontSize?, strokeThickness?)` — cria image + text, hover (fator 1.08) e stone-click (volume 0.6) automático. Retorna `[bg, txt]`.
- `addStoneHover(bg, sx, sy, txt?, factor?)` — só hover, sem clique. Usar para botões com handlers complexos ou objetos irregulares (ex: seta `config-back`).

Volumes de sons são definidos diretamente no código (sem arquivo de constantes). Usar valores que façam sentido para a categoria: sons de UI em torno de 0.6, sons de hover suaves em torno de 0.1–0.2, sons de ambiente em torno de 0.5.

## Escudo Mágico (Shield Sword)

Mecânica planejada tipo Quen (The Witcher 3). Visual já implementado, mecânica aguarda inimigos.

**Assets:**
- `shield-sword` — esfera inteira, imagem única, `setDisplaySize(110, 110)`, `setAlpha(0.23)`
- `shield-sword-break` — spritesheet de quebra, 3 frames, `frameWidth: 290`, `frameHeight: 287`, `setAlpha(0.45)`, 150ms por frame

**Hitbox:**
- Zone circular: `body.setCircle(45)`, sem gravidade
- Ativa apenas durante os 2s da esfera principal — desativa antes das quebras
- Posição padrão: -9999,-9999 (invisível no debug quando inativa)

**Timing (valores finais):**
- Esfera principal: 2000ms
- Frames de quebra: 150ms cada (total ~450ms), puramente visuais sem hitbox

**Mecânica planejada:**
- Ativação: botão direito do mouse, qualquer momento com barra cheia e jogo não pausado
- Quebra reseta o cooldown
- Inimigo acerta escudo → escudo quebra + inimigo stunado brevemente
- Player acerta enquanto escudo ativo → 1º hit é 100% crítico garantido + inimigo acorda
- Som de vidro quebrando (a adicionar)

**Cooldown:** a definir — por tempo fixo ou por ataques conectados.

## Tabela de Interações de Hitbox

Mapa de quais hitboxes interagem entre si. Atualizar sempre que uma nova hitbox for adicionada ou uma interação for implementada.

| Hitbox | Interage com | Tipo | Status |
|---|---|---|---|
| `player body` | chão, chunks, paredes | collider | ✅ implementado |
| `swordHitbox` | inimigos (body) | overlap | 🔲 aguarda inimigos |
| `shieldHitbox` | projéteis inimigos, hitbox de ataque inimigo | overlap | 🔲 aguarda inimigos |
| `enemy body` | chão, chunks, paredes | collider | 🔲 aguarda inimigos |
| `enemy body` | player body | overlap | 🔲 aguarda inimigos |
| `enemy attackHitbox` | player body | overlap | 🔲 aguarda inimigos |
| `enemy attackHitbox` | shieldHitbox | overlap | 🔲 aguarda inimigos |

**Regra:** nada interage a menos que um `collider` ou `overlap` seja registrado explicitamente. Não adicionar interações não mapeadas aqui.

## Sites Úteis

- **remove.bg** — remover fundo de imagens (PNG transparente)
- **ElevenLabs** — gerar efeitos sonoros e músicas com IA (elevenlabs.io)
- **freesound.org** — biblioteca enorme de efeitos sonoros gratuitos, filtro por licença
- **OpenGameArt** — assets de áudio e arte específicos pra jogos, licença livre (opengameart.org)

## Convenções de Nomes

Ao sugerir nomes de arquivos de mídia (imagens, áudio, vídeo), nunca incluir a extensão.

## Code Style

Prettier: single quotes, semicolons, trailing commas (all), 2-space indent, 80-char line width, no arrow parens, auto line endings.
