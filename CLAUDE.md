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
│   ├── app.tsx            # componente raíz (toda la landing page)
│   ├── main.tsx           # punto de entrada — render(<App />)
│   └── index.css          # Tailwind v4 + CSS variables de diseño
├── index.html             # HTML shell con Google Fonts
├── vite.config.ts
├── tsconfig.json
└── tsconfig.node.json
```

## Arquitectura del componente

`src/app.tsx` contiene todos los componentes en un solo archivo:

| Componente | Descripción |
|---|---|
| `Navbar` | Header sticky con menú desktop + hamburger mobile |
| `HeroSection` | Hero con foto del equipo, glow morado y íconos flotantes |
| `PlanCard` | Tarjeta reutilizable para paquetes COMMON/RARE/EPIC/LEGENDARY |
| `PlansSection` | Grid de plan cards + tarjeta BASIC horizontal |
| `BenefitsSection` | Grid 3 columnas con beneficios |
| `Footer` | Footer oscuro con links, newsletter y redes sociales |
| `App` | Root — monta todos los componentes |

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
