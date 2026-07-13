# Gamership Mobile — Landing Page

Clone pixel-perfect de [mobile.gamership.com.mx](https://mobile.gamership.com.mx/).

## Stack

- **Preact 10** — UI framework ligero (3KB, compatible con API de React)
- **Vite 6** — bundler y dev server
- **TypeScript** — strict mode
- **Tailwind CSS v4** — via plugin `@tailwindcss/vite`
- **Motion** — animaciones (`motion/react`, compatible via preact/compat)

## Comandos

```bash
npm install          # instalar dependencias
npm run dev          # dev server en http://localhost:5173
npm run build        # build de producción → dist/
npm run preview      # preview del build
npm run typecheck    # verificar tipos sin compilar
```

## Estructura

```
gamership-mobile-site/
├── public/
│   └── gm-site/          # assets estáticos (imágenes, iconos, logo)
├── src/
│   ├── app.tsx            # home: App + Navbar/Footer/RegisterBanner (exportados, compartidos entre páginas)
│   ├── main.tsx           # punto de entrada de home — render(<App />)
│   ├── recargas.tsx       # página /recargas/ — RecargasPage
│   ├── recargas-main.tsx  # punto de entrada de /recargas/ — render(<RecargasPage />)
│   └── index.css          # Tailwind v4 + CSS variables de diseño
├── index.html             # HTML shell de home
├── recargas/
│   └── index.html         # HTML shell de /recargas/ (multi-page build, ver vite.config.ts)
├── vite.config.ts
├── tsconfig.json
└── tsconfig.node.json
```

## Arquitectura del componente

Sitio multi-página (Vite MPA): cada página tiene su propio HTML shell + entry point, y comparte `Navbar`/`Footer`/`RegisterBanner` (exportados desde `src/app.tsx`).

`src/app.tsx` — página home:

| Componente | Descripción |
|---|---|
| `Navbar` | Header sticky con menú desktop + hamburger mobile (compartido) |
| `HeroSection` | Hero con foto del equipo, glow morado y íconos flotantes |
| `PlanCard` | Tarjeta reutilizable para paquetes COMMON/RARE/EPIC/LEGENDARY |
| `PlansSection` | Grid de plan cards + tarjeta BASIC horizontal |
| `BenefitsSection` | Grid 3 columnas con beneficios |
| `Footer` | Footer oscuro con links, newsletter y redes sociales (compartido) |
| `RegisterBanner` | Banner superior de registro de línea ante la CRT (compartido) |
| `App` | Root de home — monta todos los componentes |

`src/recargas.tsx` — página `/recargas/`:

| Componente | Descripción |
|---|---|
| `RecargaCard` | Tarjeta de recarga (GB + precio + vigencia + botón) |
| `RecargasSection` | Grid de 3 tarjetas de recarga (2GB/4GB/5GB) |
| `RecargasPage` | Root de la página — reutiliza `Navbar`/`Footer`/`RegisterBanner` de `app.tsx` |

Para agregar una nueva página: crear `<page>/index.html` + `src/<page>-main.tsx` + `src/<page>.tsx`, y registrar el HTML en `build.rollupOptions.input` de `vite.config.ts`.

## Design tokens

Definidos como CSS variables en `src/index.css`:

| Variable | Valor | Uso |
|---|---|---|
| `--color-primary` | `#5518c1` | Botones, headers de tarjetas |
| `--color-secondary` | `#8224e3` | Hover, acentos |
| `--color-accent` | `#50fbd2` | Fondo menta de tarjetas |
| `--color-bg-light` | `#F8F9FD` | Fondo hero |
| `--color-bg-plans` | `#f5f5ff` | Fondo sección paquetes |
| `--color-footer` | `#06041C` | Fondo footer |
| `--color-text-main` | `#00010a` | Texto principal |
| `--font-manrope` | `'Manrope', sans-serif` | Body, H1, H3, footer |
| `--font-rubik` | `'Rubik', sans-serif` | H2, precios, botones, navbar |

## Notas de Preact

- Los hooks se importan de `preact/hooks` (no de `react`)
- `@preact/preset-vite` aliasa `react` → `preact/compat` automáticamente
- `motion/react` funciona sin cambios gracias al alias de compat
- `className` es válido en Preact (acepta ambos `class` y `className`)
- `jsxImportSource: "preact"` en tsconfig.json

## Assets

Todos en `public/gm-site/`:

| Archivo | Uso |
|---|---|
| `logo.webp` | Logo Gamership Mobile |
| `players-team.webp` | Foto del equipo en hero |
| `like.png` | Ícono Redes Sociales |
| `gaming.svg` | Ícono Videojuegos |
| `streaming.png` | Ícono Streaming |
| `star.png` | Ícono flotante hero |
| `sms.png` | Ícono flotante hero |
| `coins.png` | Ícono flotante hero |
| `joystick-pixel.png` | Ícono flotante hero |
| `joystick-heart.png` | Ícono flotante hero |
