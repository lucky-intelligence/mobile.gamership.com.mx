# Gamership Mobile — Landing Page

Landing page de [Gamership Mobile](https://mobile.gamership.com.mx/), la telefonía móvil para gamers. Construida con Preact + Vite para máxima velocidad de carga.

## Stack

| Tecnología | Versión | Rol |
|---|---|---|
| [Preact](https://preactjs.com/) | ^10.26.0 | UI framework (3KB, API compatible con React) |
| [Vite](https://vitejs.dev/) | ^6.0.0 | Bundler y dev server |
| TypeScript | ^5.0.0 | Tipado estático, modo strict |
| [Tailwind CSS v4](https://tailwindcss.com/) | ^4.0.0 | Estilos utilitarios |
| [Motion](https://motion.dev/) | ^12.0.0 | Animaciones declarativas |

## Estructura

```
gamership-mobile-site/
├── public/
│   └── gm-site/           # Imágenes, íconos y logo
├── src/
│   ├── app.tsx            # Todos los componentes (landing completa)
│   ├── main.tsx           # Entry point
│   └── index.css          # Tailwind + CSS variables + animaciones
├── index.html             # Shell HTML con Google Fonts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Secciones de la página

| Componente | Descripción |
|---|---|
| `RegisterBanner` | Banner menta dismissible sobre el navbar |
| `Navbar` | Header sticky, menú desktop + hamburger con X en mobile |
| `HeroSection` | Hero animado con foto del equipo e íconos flotantes |
| `PlanCard` | Tarjeta de paquete reutilizable (COMMON / RARE / EPIC / LEGENDARY) |
| `PlansSection` | Grid de tarjetas + tarjeta BASIC horizontal |
| `BenefitsSection` | Grid 3 columnas con beneficios de la red |
| `Footer` | Footer oscuro con links, newsletter y redes |

La tarjeta **EPIC** incluye un borde animado con gradiente morado → menta usando `@property` CSS y un glow pulsante.

## Design tokens

Definidos como variables CSS en `src/index.css`:

```css
--color-primary:   #5518c1   /* morado principal */
--color-secondary: #8224e3   /* hover / acentos */
--color-accent:    #50fbd2   /* menta */
--font-manrope:    'Manrope', sans-serif   /* body */
--font-rubik:      'Rubik', sans-serif     /* títulos y precios */
```

## Notas de desarrollo

- Hooks de Preact se importan desde `preact/hooks`, no desde `react`
- `motion/react` funciona sin cambios gracias al alias `react → preact/compat` en `vite.config.ts`
- **No uses `@preact/preset-vite`** — genera un conflicto ESM/CJS con `zimmerframe` cuando Tailwind v4 está instalado. La config manual en `vite.config.ts` ya resuelve esto
- Los botones "¡CONTRATA AHORA!" apuntan a `/dashboard`

## Assets

Todos los assets estáticos están en `public/gm-site/`:

`logo.webp` · `players-team.webp` · `like.png` · `gaming.svg` · `streaming.png` · `star.png` · `sms.png` · `coins.png` · `joystick-pixel.png` · `joystick-heart.png`
