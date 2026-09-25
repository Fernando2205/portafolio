# Portafolio de Delio Fernando Palacios

Portafolio personal, interactivo y bilingüe (ES/EN) construido con **Astro 5** y
**Tailwind CSS v4**. Salida estática: español en `/`, inglés en `/en/`.

La estética es de terminal: intro de carga tipo consola, una terminal donde el
visitante escribe comandos, cursor personalizado, una figura 3D de partículas
que cambia de forma por sección, animaciones con scroll y 8 secretos escondidos
con pistas progresivas y recompensa.

## Puesta en marcha

Requiere **Node 22.12+** y **pnpm** (no uses npm ni yarn: el lockfile es de pnpm).

```bash
pnpm install
pnpm dev        # servidor de desarrollo
pnpm build      # astro check + astro build
pnpm preview    # sirve dist/
pnpm lint       # neostandard
pnpm lint:fix
```

`pnpm lint` y `pnpm build` deben pasar sin errores antes de desplegar.

## Estructura

```
src/
  data/         contenido tipado: proyectos, trayectoria, logros, habilidades,
                stack, secretos, paletas, perfil, imagenes, iconos
  i18n/         es.ts, en.ts, utils.ts, tipos.ts
  layouts/      Base.astro  (head, SEO, script de tema, ClientRouter)
  components/   una pieza por sección, más Nav, Cursor, Loader, Toast…
  scripts/      lógica de cliente en módulos TypeScript
  styles/       global.css  (tokens de Tailwind, paletas, keyframes)
  assets/       imágenes (ver src/assets/LEEME.md)
public/cv/      CV descargable
```

### Cómo funciona el cliente

- **Un solo `requestAnimationFrame`** para todo el sitio, en
  [`scripts/loop.ts`](src/scripts/loop.ts). Cada módulo registra su tarea con
  `alFrame()`. Las lecturas de layout se cachean y solo se invalidan tras un
  scroll o un resize.
- **Sin framework de UI.** Todo el contenido textual se renderiza en el
  servidor y lo interactivo se hidrata con módulos TypeScript.
- **Los módulos no se importan entre sí para reaccionar a cambios**: publican y
  escuchan en el bus tipado de [`scripts/bus.ts`](src/scripts/bus.ts).
- **Un único punto de entrada**, [`scripts/main.ts`](src/scripts/main.ts). Como
  el `ClientRouter` reemplaza el DOM en cada navegación, todo el cableado va en
  `astro:page-load` y las bajas en `astro:before-swap`.

### Rendimiento

- Three.js se carga con `requestIdleCallback` después del primer paint y queda
  en su propio chunk. El canvas lleva `transition:persist`, así que el contexto
  WebGL sobrevive al cambio de idioma.
- Las posiciones de las partículas se suben a la GPU solo mientras hay
  transición de forma, no en cada frame.
- La física del stack y la marquesina se pausan con `IntersectionObserver`
  cuando no se ven.
- Los logos de `simple-icons` se resuelven en el build y se inyectan como SVG
  en línea: el cliente no pide nada.
- La hora en vivo solo toca el `textContent` de sus nodos.

### Accesibilidad

- Todo se navega sin ratón: los elementos clicables son `<button>` o `<a>`
  reales, con `:focus-visible` visible y un enlace para saltar al contenido.
- El cursor personalizado solo se activa con `pointer: fine`.
- El historial de la terminal es `aria-live="polite"`.
- El texto de acento sobre fondos claros usa `--acct`, mezclado para contrastar.
- Con `prefers-reduced-motion` se desactivan el scrub, la física, la marquesina
  y el 3D, y todo queda visible: los estados iniciales de animación se ponen
  desde JavaScript, nunca desde CSS. Sin JavaScript el sitio se lee completo.

## Editar el contenido

Todo el contenido vive en [`src/data/`](src/data/) como módulos TypeScript
tipados. No hace falta tocar componentes: editas el array y ya. Si te falta una
clave o cambia una firma, el build avisa en lugar de romperse la página.

| Qué | Dónde |
|---|---|
| Proyectos | [`src/data/proyectos.ts`](src/data/proyectos.ts) |
| Experiencia, educación y certificaciones | [`src/data/trayectoria.ts`](src/data/trayectoria.ts) |
| Hackatones y publicaciones | [`src/data/logros.ts`](src/data/logros.ts) |
| Habilidades blandas | [`src/data/habilidades.ts`](src/data/habilidades.ts) |
| Stack de herramientas | [`src/data/stack.ts`](src/data/stack.ts) |
| Contacto y enlaces | [`src/data/perfil.ts`](src/data/perfil.ts) |
| Textos de la interfaz | [`src/i18n/es.ts`](src/i18n/es.ts) y [`src/i18n/en.ts`](src/i18n/en.ts) |
| Paletas de color | [`src/data/paletas.ts`](src/data/paletas.ts) |
| Secretos y sus pistas | [`src/data/secretos.ts`](src/data/secretos.ts) |

Las imágenes se descubren por nombre de archivo: basta con dejarlas en
`src/assets/`. Las instrucciones están en
[`src/assets/LEEME.md`](src/assets/LEEME.md).

## Pendiente

Los huecos están marcados en el código con un comentario `pendiente`.

- [ ] **Foto de perfil** → `src/assets/foto.jpg` (vertical, 4:5). Mientras no
      exista se ve un marco con el aviso «Tu foto aquí».
- [ ] **Capturas de los proyectos** → `src/assets/proyectos/<slug>.png`
      (horizontal, 16:10). Slugs: `samcore`, `oculus`, `clara`, `codemaster`,
      `pokecards-3d`, `peliculas-app`. Mientras falten se ve el placeholder de
      color rayado.
- [ ] **URLs de demo** de OCULUS, CLARA, CodeMaster, PokeCards 3D y Películas
      App → campo `url` en `src/data/proyectos.ts`. SamCore ya tiene demo y
      repo. El enlace «ver proyecto ↗» solo aparece cuando hay `url`.
- [ ] **Descripción real de UrbaNet** → `src/data/logros.ts`.
- [ ] **CV actualizado** → reemplaza `public/cv/CV-Delio-Palacios.pdf`.

## Despliegue

Cloudflare Pages (o Vercel/Netlify) desde GitHub:

- Comando de build: `pnpm build`
- Carpeta de salida: `dist`
- Versión de Node: 22 o superior

## Decisiones que se apartan del handoff

- **Astro 5, no la última.** El handoff pide Astro 5; `pnpm create astro@latest`
  instala hoy la 7. Se dejó fijada la 5 (`^5.18.2`) para no arrastrar cambios de
  una versión mayor que el handoff no contempla.
- **`eslint-plugin-astro@^1.7.0`.** La versión 3 exige ESLint 10 y `neostandard`
  todavía pide ESLint 9. La 1.7 funciona con ESLint 9 y expone el mismo
  conjunto de reglas.
- **`astro.configs['flat/recommended']`** en lugar de `astro.configs.recommended`
  del snippet del handoff: en la versión 1 del plugin, `recommended` es el
  formato antiguo de eslintrc.
- **Las reglas `jsx-*` de neostandard están apagadas en los `.astro`**, porque
  las plantillas de Astro no son JSX: llevan comillas dobles en los atributos,
  como el HTML.
- **Oracle DB y OpenAI se quedan sin logo.** Ya no están en `simple-icons`, y el
  handoff dice omitir el ícono que falte. Java usa `openjdk`, como indica. Los
  colores de marca son los del prototipo, no los que trae hoy el paquete.
- **El botón ES/EN no redirige automáticamente.** Guarda la preferencia en
  `localStorage['delio-lang']`, pero entrar en `/` siempre muestra español: un
  redirect automático perjudica el SEO y sorprende a quien llega desde un enlace.
- **Con `prefers-reduced-motion` el 3D no se carga**, en lugar de mostrarse
  quieto. Evita descargar Three.js a quien pidió menos movimiento.

## Los 8 secretos

Van en orden: cada uno da la pista del siguiente. Están definidos en
[`src/data/secretos.ts`](src/data/secretos.ts) y su progreso se guarda en
`localStorage` (`delio-secrets`, `delio-hints`, `delio-gold`).

Para volver a empezar la búsqueda, borra esas tres claves desde la consola:

```js
['delio-secrets', 'delio-hints', 'delio-gold'].forEach(k => localStorage.removeItem(k))
```

La intro de carga se marca en `sessionStorage['delio-intro']` y solo se ve una
vez por sesión. Para verla de nuevo, abre una pestaña nueva; para desactivarla
del todo, pasa `conIntro={false}` al layout.
