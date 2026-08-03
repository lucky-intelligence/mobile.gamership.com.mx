import type { ComponentChildren } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { LocationProvider, Router, Route, useLocation } from 'preact-iso'
import { configureAccountCore } from '@lucky-intelligence/account-core'
import {
  CrtLandingPage,
  CrtCheckPage,
  PhoneRegistrationFlow,
  PhoneConfirmation,
  PhoneRegistrationProvider,
  AuthProvider,
  GlobalProvider,
  Authenticated,
  Dashboard,
  LoginPage,
  accountUI,
} from '@lucky-intelligence/account-ui'
import { BorderBeam } from '@/components/ui/border-beam'
import tycMd from '@/assets/tyc.md?raw'
import apMd from '@/assets/ap.md?raw'
import './i18n'

configureAccountCore({
  apiUrl: import.meta.env.VITE_API_URL,
  stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
  loginMode: 'custom',
  loginPath: '/login',
  cognito: {
    domain: import.meta.env.VITE_COGNITO_DOMAIN,
    clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    redirectUri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
    scopes: import.meta.env.VITE_COGNITO_SCOPES,
  },
})

/* ============================================================
   DESIGN TOKENS (mobile.gamership.com.mx)
   --main: #00010a | --secondary: #8224e3 | --accent: #50fbd2
   --btn-bgcolor: #5518c1 | --bg_body_light: #F8F9FD
   --footer-bg: #06041C | --plan-bg: #f5f5ff
   Fonts: Manrope (body), Rubik (buttons/headings)
   ============================================================ */

/* ============================================================
   DATA
   ============================================================ */

// These map to landing-page sections; each is a real route (see the Router)
// that renders the landing and scrolls to the matching section.
const NAV_LINKS = [
  { key: 'paquetes', href: '/paquetes' },
  { key: 'recargas', href: '/recargas' },
  { key: 'portabilidad', href: '/portabilidad' },
  { key: 'atencion', href: '/atencion' },
] as const

type Plan = {
  id: string
  tier: string
  price: string
  freeGB: string
  socialGB: string
  gamingGB: string
  streamingGB: string
  totalGB: string
  sms: string
  minutes: string
  featured?: boolean
}

const PLANS: Plan[] = [
  {
    id: 'Gamership_Common',
    tier: 'COMMON',
    price: '250',
    freeGB: '3GB',
    socialGB: '+1GB',
    gamingGB: '+0.5GB',
    streamingGB: '+0.5GB',
    totalGB: '5GB',
    sms: '50',
    minutes: '200',
  },
  {
    id: 'Gamership_Rare',
    tier: 'RARE',
    price: '350',
    freeGB: '4GB',
    socialGB: '+2GB',
    gamingGB: '+1GB',
    streamingGB: '+1GB',
    totalGB: '8GB',
    sms: '50',
    minutes: '200',
  },
  {
    id: 'Gamership_Epic',
    tier: 'EPIC',
    price: '500',
    freeGB: '6GB',
    socialGB: '+3GB',
    gamingGB: '+2GB',
    streamingGB: '+2GB',
    totalGB: '13GB',
    sms: '50',
    minutes: '200',
    featured: true,
  },
  {
    id: 'Gamership_Legendary',
    tier: 'LEGENDARY',
    price: '800',
    freeGB: '12GB',
    socialGB: '+5GB',
    gamingGB: '+3GB',
    streamingGB: '+3GB',
    totalGB: '23GB',
    sms: '50',
    minutes: '200',
  },
]

const FOOTER_LINKS = {
  gamership: [
    { key: 'mobile', href: '/' },
    { key: 'eshop', href: 'https://eshop.gamership.com.mx/' },
    { key: 'affiliates', href: '/afiliados/' },
  ],
  compania: [
    { key: 'packages', href: '/paquetes' },
    { key: 'recharges', href: '/recargas' },
    { key: 'linkLine', href: '/por-que-vincular' },
    { key: 'faq', href: '/explore' },
    { key: 'portability', href: '/portabilidad' },
    { key: 'activateSim', href: '#' },
    { key: 'helpCenter', href: '#' },
  ],
  legal: [
    { key: 'terms', href: '/terminos-y-condiciones' },
    { key: 'privacy', href: '/aviso-de-privacidad' },
    { key: 'arco', href: '/derechos-arco' },
  ],
} as const

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://www.facebook.com/gamershipmx', icon: 'f' },
  { label: 'Twitter/X', href: 'https://x.com/GamershipMX', icon: '𝕏' },
  { label: 'YouTube', href: 'https://www.youtube.com/@Gamership', icon: '▶' },
  { label: 'Instagram', href: 'http://instagram.com/gamershipmx', icon: '◻' },
]

/* ============================================================
   LANGUAGE SWITCH + DARK MODE
   ============================================================ */
function LangSwitch({ compact = false, accountMode = false }: { compact?: boolean; accountMode?: boolean }) {
  const { i18n, t } = useTranslation('common')
  const current = i18n.resolvedLanguage === 'en' ? 'en' : 'es'
  const next = current === 'es' ? 'en' : 'es'
  const inactive = `text-[#00010a99]${accountMode ? ' dark:text-white/50' : ''}`

  return (
    <button
      type="button"
      aria-label={t('lang.switchAria')}
      onClick={() => i18n.changeLanguage(next)}
      className={`flex items-center gap-1 rounded-full border border-[#e5e5ef] ${compact ? 'px-2.5 py-1.5 text-[12px]' : 'px-3 py-2 text-[13px]'} font-semibold text-[#00010a] hover:border-[#8224e3] hover:text-[#8224e3] transition-colors duration-200 cursor-pointer${accountMode ? ' dark:border-white/20 dark:hover:border-[#8224e3]' : ''}`}
    >
      <span className={current === 'es' ? 'text-[#5518c1]' : inactive}>{t('lang.es')}</span>
      <span className={`text-[#00010a4d]${accountMode ? ' dark:text-white/30' : ''}`}>/</span>
      <span className={current === 'en' ? 'text-[#5518c1]' : inactive}>{t('lang.en')}</span>
    </button>
  )
}

// Toggles a `dark` class on <html> (Tailwind class strategy) and persists it.
function useDarkMode(): [boolean, () => void] {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])
  return [dark, () => setDark((d) => !d)]
}

function DarkToggle({ dark, toggle, compact = false, accountMode = false }: { dark: boolean; toggle: () => void; compact?: boolean; accountMode?: boolean }) {
  const { t } = useTranslation('common')
  return (
    <button
      type="button"
      aria-label={dark ? t('theme.light') : t('theme.dark')}
      onClick={toggle}
      className={`flex items-center justify-center rounded-full border border-[#e5e5ef] ${compact ? 'h-8 w-8' : 'h-9 w-9'} text-[#00010a] hover:border-[#8224e3] hover:text-[#8224e3] transition-colors duration-200 cursor-pointer${accountMode ? ' dark:border-white/20 dark:text-white/85 dark:hover:border-[#8224e3]' : ''}`}
    >
      {dark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}

/* ============================================================
   NAVBAR
   ============================================================ */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { path } = useLocation()
  const { t } = useTranslation('common')
  const [dark, toggleDark] = useDarkMode()

  // On the dashboard the account button opens the "my account" modal; elsewhere
  // it links to /dashboard. Only the dashboard has dark styles, so the toggle
  // is surfaced only there.
  const onDashboard = path.startsWith('/dashboard')
  const onAccountClick = (e: Event) => {
    setMenuOpen(false)
    if (onDashboard) {
      e.preventDefault()
      accountUI.openProfile()
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]${onDashboard ? ' dark:bg-[#111827] dark:shadow-[0_2px_28px_rgba(0,0,0,0.5)]' : ''}`}
      style={{ fontFamily: 'var(--font-rubik)' }}
    >
      <div className="mx-auto max-w-[1280px] flex items-center justify-between px-6 py-4">
        <a href="/" className="flex-shrink-0" aria-label={t('header.logoAria')}>
          <img
            src="/gm-site/logo.webp"
            alt="Gamership Mobile"
            width={160}
            height={40}
            className="h-10 w-auto object-contain"
          />
        </a>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className={`text-[15px] font-medium whitespace-nowrap text-[#00010a] hover:text-[#8224e3] transition-colors duration-200 relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-[#8224e3] after:transition-all after:duration-200 hover:after:w-full ${onDashboard ? 'dark:text-white/70 dark:hover:text-[#a855f7]' : ''}`}
            >
              {t(`nav.${link.key}`)}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <LangSwitch accountMode={onDashboard} />
          {onDashboard && <DarkToggle dark={dark} toggle={toggleDark} accountMode />}
          <a
            href="/login"
            onClick={onAccountClick}
            className="flex items-center gap-2 rounded-full bg-[#5518c1] px-5 py-2.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#8224e3] hover:scale-105 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            {t('cta.account')}
          </a>
        </div>

        <button
          className={`lg:hidden p-2 cursor-pointer rounded-md hover:bg-[#f5f5ff] transition-colors duration-200${onDashboard ? ' dark:hover:bg-white/10' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? t('header.closeMenu') : t('header.openMenu')}
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#5518c1]">
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          ) : (
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-6 bg-[#00010a] ${onDashboard ? 'dark:bg-white' : ''}`} />
              <span className={`block h-0.5 w-6 bg-[#00010a] ${onDashboard ? 'dark:bg-white' : ''}`} />
              <span className={`block h-0.5 w-6 bg-[#00010a] ${onDashboard ? 'dark:bg-white' : ''}`} />
            </div>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className={`lg:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3${onDashboard ? ' dark:bg-[#111827] dark:border-white/10' : ''}`}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className={`block text-[15px] font-medium text-[#00010a] hover:text-[#8224e3] transition-colors duration-200 py-1${onDashboard ? ' dark:text-white/80 dark:hover:text-[#a855f7]' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {t(`nav.${link.key}`)}
            </a>
          ))}
          <div className="flex items-center gap-2 pt-1">
            <LangSwitch compact accountMode={onDashboard} />
            {onDashboard && <DarkToggle dark={dark} toggle={toggleDark} compact accountMode />}
          </div>
          <a
            href="/login"
            onClick={onAccountClick}
            className="inline-flex items-center gap-2 rounded-full bg-[#5518c1] px-5 py-2.5 text-[15px] font-semibold text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            {t('cta.account')}
          </a>
        </div>
      )}
    </header>
  )
}

/* ============================================================
   HERO SECTION
   ============================================================ */
function HeroSection() {
  const { t } = useTranslation('landing')
  return (
    <section
      className="bg-[#F8F9FD] overflow-hidden"
      style={{ fontFamily: 'var(--font-manrope)' }}
    >
      <div className="mx-auto max-w-[1280px] px-6 py-10 flex flex-col-reverse md:flex-row items-center gap-12 md:gap-8">
        <motion.div
          className="flex-1 space-y-6"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="space-y-1">
            <h1 className="text-[18px] font-semibold text-[#5518c1] uppercase tracking-wide" style={{ fontFamily: 'var(--font-rubik)' }}>
              {t('hero.eyebrow')}
            </h1>
            <h3 className="text-[52px] md:text-[68px] font-extrabold leading-tight text-[#1c1c1c]">
              {t('hero.title')}
            </h3>
          </div>
          <p
            className="text-[20px] md:text-[26px] font-medium text-[#5518c1] leading-relaxed max-w-[520px]"
            style={{ fontFamily: 'var(--font-rubik)' }}
          >
            {t('hero.subtitle1')}
            <br />
            {t('hero.subtitle2')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <a
              href="/paquetes"
              className="inline-flex items-center justify-center rounded-full bg-[#5518c1] px-8 py-4 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#8224e3] hover:scale-105 active:scale-95"
              style={{ fontFamily: 'var(--font-rubik)' }}
            >
              {t('hero.ctaPlans')}
            </a>
            <a
              href="/portabilidad"
              className="inline-flex items-center justify-center rounded-full border-2 border-[#5518c1] px-8 py-4 text-[15px] font-semibold text-[#5518c1] transition-all duration-200 hover:bg-[#5518c1] hover:text-white hover:scale-105 active:scale-95"
              style={{ fontFamily: 'var(--font-rubik)' }}
            >
              {t('hero.ctaPortability')}
            </a>
          </div>
        </motion.div>

        <motion.div
          className="flex-1 flex justify-center relative"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(130,36,227,0.35) 0%, rgba(85,24,193,0.18) 45%, transparent 70%)',
              filter: 'blur(40px)',
            }}
            aria-hidden="true"
          />
          <img
            src="/gm-site/players-team.webp"
            alt="Gamers Gamership Mobile"
            width={640}
            height={500}
            className="relative z-10 w-full max-w-[640px] h-auto object-contain"
          />
          <motion.div className="absolute z-10 top-4 right-12" animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            <img src="/gm-site/joystick-heart.png" alt="" width={52} height={52} className="w-12 h-12 object-contain" />
          </motion.div>
          <motion.div className="absolute z-10 top-20 left-4" animate={{ y: [0, 6, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
            <img src="/gm-site/star.png" alt="" width={42} height={42} className="w-10 h-10 object-contain" />
          </motion.div>
          <motion.div className="absolute z-10 bottom-24 left-8" animate={{ y: [0, -6, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
            <img src="/gm-site/coins.png" alt="" width={42} height={42} className="w-10 h-10 object-contain" />
          </motion.div>
          <motion.div className="absolute z-10 bottom-16 right-8" animate={{ y: [0, 7, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}>
            <img src="/gm-site/sms.png" alt="" width={48} height={48} className="w-11 h-11 object-contain" />
          </motion.div>
          <motion.div className="absolute z-10 top-1/2 left-0" animate={{ y: [0, -5, 0] }} transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}>
            <img src="/gm-site/joystick-pixel.png" alt="" width={46} height={46} className="w-11 h-11 object-contain" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================================
   WHY CHOOSE SECTION
   ============================================================ */
const WHY_CHOOSE_ICONS = [
  // Señal / cobertura triple carrier
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <rect x="3" y="14" width="3" height="6" rx="1" />
    <rect x="8" y="11" width="3" height="9" rx="1" />
    <rect x="13" y="7.5" width="3" height="12.5" rx="1" />
    <rect x="18" y="4" width="3" height="16" rx="1" />
  </svg>,
  // Escudo / membresía
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M12 2.5 4.5 5.7v5.6c0 4.6 3.2 8.9 7.5 10.2 4.3-1.3 7.5-5.6 7.5-10.2V5.7L12 2.5Z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </svg>,
  // Headset / gamers
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
    <rect x="2.5" y="13.5" width="4.5" height="7" rx="2" />
    <rect x="17" y="13.5" width="4.5" height="7" rx="2" />
  </svg>,
  // Rayo / máxima velocidad
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M13 2 4 14h6.5l-1.5 8 9-12h-6.5L13 2Z" />
  </svg>,
]

function WhyChooseSection() {
  const { t } = useTranslation('landing')
  return (
    <section className="bg-white py-20" style={{ fontFamily: 'var(--font-manrope)' }}>
      <div className="mx-auto max-w-[1280px] px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[40px] md:text-[55px] font-bold text-[#5518c1] text-center mb-14"
          style={{ fontFamily: 'var(--font-rubik)' }}
        >
          {t('whyChoose.title')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_CHOOSE_ICONS.map((icon, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center text-center p-7 rounded-[24px] bg-white border border-[#e5e5f2] shadow-sm hover:shadow-xl transition-shadow duration-200 group cursor-default"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#5518c1] text-white transition-transform duration-300 group-hover:scale-110">
                {icon}
              </div>
              <h3 className="mt-5 text-[17px] font-bold leading-snug text-[#00010a]" style={{ fontFamily: 'var(--font-rubik)' }}>
                {t(`whyChoose.f${i + 1}.title`)}
              </h3>
              <p className="mt-3 text-[14px] text-[#555] leading-relaxed">{t(`whyChoose.f${i + 1}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   PLAN CARD
   ============================================================ */
function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  const { t } = useTranslation('landing')
  const isEpic = plan.tier === 'EPIC'

  const cardContent = (
    <>
      <div className="px-6 pt-8 pb-6 bg-[#5518c1] rounded-t-[25px] text-center" style={{ fontFamily: 'var(--font-rubik)' }}>
        <h2 className="text-[37px] font-semibold uppercase text-white leading-tight">{plan.tier}</h2>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-[37px] font-semibold text-white">${plan.price}</span>
          <span className="text-[14px] font-medium text-[#ffffff99]">MXN</span>
        </div>
        <div className="text-[12px] text-[#ffffff66]">{t('plan.validity')}</div>
      </div>

      <div className="flex-1 px-6 py-6 space-y-4 text-center" style={{ fontFamily: 'var(--font-rubik)' }}>
        <div>
          <p className="text-[42px] font-extrabold text-[#00010a]">{plan.freeGB}</p>
          <p className="text-[13px] text-[#555]">{t('plan.freeNav')}</p>
          <p className="text-[13px] text-[#444] mt-1">
            <strong>{plan.sms}</strong> {t('plan.sms')} + <strong>{plan.minutes}</strong> {t('plan.voiceMinutes')}
          </p>
        </div>
        <div className="space-y-3 border-t border-[#f0f0f8] pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/gm-site/like.png" alt={t('plan.social')} width={22} height={22} />
              <span className="text-[13px] text-[#555]">{t('plan.social')}</span>
            </div>
            <span className="text-[16px] font-bold text-[#5518c1]">{plan.socialGB}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/gm-site/gaming.svg" alt={t('plan.gaming')} width={22} height={22} />
              <span className="text-[13px] text-[#555]">{t('plan.gaming')}</span>
            </div>
            <span className="text-[16px] font-bold text-[#5518c1]">{plan.gamingGB}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/gm-site/streaming.png" alt={t('plan.streaming')} width={22} height={22} className="rounded" />
              <span className="text-[13px] text-[#555]">{t('plan.streaming')}</span>
            </div>
            <span className="text-[16px] font-bold text-[#5518c1]">{plan.streamingGB}</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 bg-[#50fbd2] text-center space-y-4">
        <div style={{ fontFamily: 'var(--font-rubik)' }}>
          <p className="text-[40px] font-extrabold text-[#5518c1]">{plan.totalGB}</p>
          <p className="text-[13px] font-bold tracking-wide text-[#5518c1] uppercase">{t('plan.totals')}</p>
        </div>
        <a
          onClick={() => {
            localStorage.setItem('package', plan.id);
            window.location.href = '/dashboard';
          }}
          className="block w-full text-center rounded-full bg-[#5518c1] py-4 text-[13px] font-medium uppercase text-white transition-all duration-200 hover:bg-[#8224e3] hover:scale-[1.02] active:scale-[0.98]"
          style={{ fontFamily: 'var(--font-rubik)' }}
        >
          {t('plan.cta')}
        </a>
      </div>
    </>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative transition-all duration-200 hover:-translate-y-1 ${isEpic ? 'rounded-[25px] hover:shadow-xl' : 'rounded-[25px] overflow-hidden flex flex-col bg-white border border-[#e5e5f2] shadow-sm hover:shadow-xl'}`}
    >
      {/* Sits outside BorderBeam: that wrapper clips overflow, and the pill
          deliberately overhangs the card's top edge. */}
      {plan.featured && (
        <div
          className="absolute left-1/2 -top-4 z-20 -translate-x-1/2 flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#50fbd2] px-4 py-2 text-[12px] font-bold uppercase tracking-wide text-[#5518c1] shadow-[0_4px_14px_rgba(85,24,193,0.18)]"
          style={{ fontFamily: 'var(--font-rubik)' }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.35 6.19 20.4l1.11-6.47-4.7-4.58 6.5-.95L12 2.5z" />
          </svg>
          {t('plan.recommended')}
        </div>
      )}
      {isEpic ? (
        <BorderBeam duration={4}>{cardContent}</BorderBeam>
      ) : cardContent}
    </motion.div>
  )
}

/* ============================================================
   PLANS SECTION
   ============================================================ */
function PlansSection() {
  const { t } = useTranslation('landing')
  return (
    <section id="paquetes" className="bg-[#f5f5ff] py-20" style={{ fontFamily: 'var(--font-manrope)' }}>
      <div className="mx-auto max-w-[1280px] px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[40px] md:text-[55px] font-bold text-[#5518c1] text-center mb-12"
          style={{ fontFamily: 'var(--font-rubik)' }}
        >
          {t('plans.title')}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.tier} plan={plan} index={i} />
          ))}
        </div>

        {/* BASIC — horizontal 3-column layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 max-w-[860px] mx-auto rounded-[25px] overflow-hidden flex flex-col md:flex-row"
        >
          <div className="flex-1 flex flex-col items-center justify-center px-8 py-8 bg-[#5518c1] text-white text-center" style={{ fontFamily: 'var(--font-rubik)' }}>
            <p className="text-[37px] font-semibold uppercase leading-tight">BASIC</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-[18px] font-semibold">$</span>
              <span className="text-[48px] font-semibold leading-none">150</span>
              <span className="text-[18px] font-semibold ml-1">MXN</span>
            </div>
            <p className="text-[15px] font-bold mt-2">{t('basic.validity')}</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-8 py-8 bg-white text-center" style={{ fontFamily: 'var(--font-rubik)' }}>
            <p className="text-[48px] font-extrabold text-[#00010a] leading-none">3GB</p>
            <p className="text-[15px] font-bold text-[#00010a] mt-1">{t('basic.freeNav')}</p>
            <p className="text-[13px] text-[#444] mt-2">
              <strong>25</strong> {t('plan.sms')} + <strong>100</strong> {t('plan.voiceMinutes')}
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-8 py-8 bg-[#50fbd2] text-center space-y-3" style={{ fontFamily: 'var(--font-rubik)' }}>
            <div>
              <p className="text-[48px] font-extrabold text-[#5518c1] leading-none">3GB</p>
              <p className="text-[13px] font-bold tracking-wide text-[#5518c1] uppercase">{t('plan.totals')}</p>
            </div>
            <a
              href="/dashboard"
              className="block w-full text-center rounded-full bg-[#5518c1] px-6 py-3 text-[13px] font-medium uppercase text-white transition-all duration-200 hover:bg-[#8224e3] hover:scale-[1.02] active:scale-[0.98]"
            >
              {t('plan.cta')}
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 max-w-[800px] mx-auto text-center space-y-2 text-[12px] text-[#666]"
        >
          <p>{t('plans.note1')}</p>
          <p>{t('plans.note2')}</p>
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================================
   ECOSYSTEM SECTION
   ============================================================ */
const ECOSYSTEM = [
  {
    key: 'app',
    href: null,
    // Brand icon: ships with its own purple rounded-square, so it replaces the
    // tile wrapper the other two use instead of sitting inside it.
    iconSrc: '/gm-site/app-icon.svg',
    icon: null,
  },
  {
    key: 'partners',
    href: null,
    // Brand icon: ships with its own purple rounded-square, so it replaces the
    // tile wrapper the other two use instead of sitting inside it.
    iconSrc: '/gm-site/partners-icon.svg',
    icon: null,
  },
  {
    key: 'eshop',
    href: 'https://eshop.gamership.com.mx/',
    // Brand icon: ships with its own purple rounded-square, so it replaces the
    // tile wrapper the other two use instead of sitting inside it.
    iconSrc: '/gm-site/eshop-icon.svg',
    icon: null,
  },
] as const

function EcosystemSection() {
  const { t } = useTranslation('landing')

  return (
    <section className="bg-white py-20" style={{ fontFamily: 'var(--font-manrope)' }}>
      <div className="mx-auto max-w-[1280px] px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[32px] md:text-[40px] font-extrabold text-[#5518c1] text-center mb-14"
          style={{ fontFamily: 'var(--font-rubik)' }}
        >
          {t('ecosystem.title')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ECOSYSTEM.map((item, i) => {
            // Only the eShop has a destination today; the other two render as
            // plain cards until their URLs exist.
            const Tag = item.href ? 'a' : 'div'
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Tag
                  {...(item.href ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex h-full flex-col items-center rounded-[24px] bg-white border border-[#e5e5f2] p-7 text-center shadow-sm hover:shadow-xl transition-shadow duration-200"
                >
                  {item.iconSrc ? (
                    <img
                      src={item.iconSrc}
                      alt=""
                      width={56}
                      height={56}
                      className="h-14 w-14 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#5518c1] text-white transition-transform duration-300 group-hover:scale-110">
                      {item.icon}
                    </div>
                  )}
                  <h3 className="mt-5 text-[18px] font-bold text-[#00010a]" style={{ fontFamily: 'var(--font-rubik)' }}>
                    {t(`ecosystem.${item.key}.title`)}
                  </h3>
                  <p className="mt-3 text-[14px] text-[#555] leading-relaxed">{t(`ecosystem.${item.key}.desc`)}</p>
                </Tag>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   RECARGAS PAGE (independent route — not part of LandingPage)
   ============================================================ */
// `id` must match the API's `PackagesId` exactly (not `IdPackage`): the
// dashboard looks the package up with `pkgs.find(p => p.PackagesId === pkg)`.
type Recarga = { key: string; id: string; gb: string; price: string }

const RECARGAS: Recarga[] = [
  { key: 'loot2', id: 'Gamership_Data_Loot_2GB', gb: '2GB', price: '79.00' },
  { key: 'loot4', id: 'Gamership_Data_Loot_4GB', gb: '4GB', price: '149.00' },
  { key: 'loot5', id: 'Gamership_Data_Loot_5GB', gb: '5GB', price: '179.00' },
]

/* Icons size to their wrapper (h-full/w-full) and inherit its color, so each
   surface picks its own. */
const DATA_BENEFITS = [
  {
    key: 'speed',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
        <path d="M3.5 17a9 9 0 1 1 17 0" />
        <path d="m12 13.5 4.2-4" />
        <circle cx="12" cy="14.4" r="1.5" />
      </svg>
    ),
  },
  {
    key: 'shareData',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
        <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
        <path d="M8.6 15.4a4.8 4.8 0 0 1 0-6.8M15.4 8.6a4.8 4.8 0 0 1 0 6.8" />
        <path d="M5.8 18.2a8.8 8.8 0 0 1 0-12.4M18.2 5.8a8.8 8.8 0 0 1 0 12.4" />
      </svg>
    ),
  },
  {
    key: 'roaming',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
        {/* US */}
        <rect x="1.5" y="7.5" width="9.5" height="9" rx="1.2" />
        <path d="M1.5 10.5h9.5M1.5 13.5h9.5M6 7.5v3" />
        {/* Canada */}
        <rect x="13" y="7.5" width="9.5" height="9" rx="1.2" />
        <path d="M16 7.5v9M19.5 7.5v9" />
        <path d="M17.75 10.3l.7 1.4 1.1-.3-.5 1.3h-2.6l-.5-1.3 1.1.3.7-1.4Z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
] as const

function RecargaCard({ recarga, index }: { recarga: Recarga; index: number }) {
  const { t } = useTranslation('landing')
  const [flipped, setFlipped] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flip-card h-[520px]"
    >
      <div className={`flip-card-inner ${flipped ? 'is-flipped' : ''}`}>
        {/* FRONT */}
        <div className="flip-card-face rounded-[25px] overflow-hidden flex flex-col bg-white border border-[#e5e5f2] shadow-sm hover:shadow-xl transition-shadow duration-200">
          <div className="px-6 pt-8 pb-6 bg-[#5518c1] rounded-t-[25px] text-center" style={{ fontFamily: 'var(--font-rubik)' }}>
            <p className="text-[13px] font-semibold uppercase tracking-widest text-[#ffffff99]">{t('recargas.label')}</p>
            <h3 className="text-[42px] font-extrabold text-white leading-tight">{recarga.gb}</h3>
            <p className="text-[13px] font-medium text-[#ffffffb3]">{t('plan.freeNav')}</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 text-center" style={{ fontFamily: 'var(--font-rubik)' }}>
            <span className="mb-3 inline-block rounded-full bg-[#f1f1f5] px-3.5 py-1.5 text-[12px] font-medium text-[#666]">
              {t('recargas.validity')}
            </span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-[36px] font-extrabold text-[#00010a]">${recarga.price}</span>
              <span className="text-[14px] font-medium text-[#666]">MXN</span>
            </div>

            <button
              type="button"
              onClick={() => setFlipped(true)}
              className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-[#5518c1] hover:text-[#8224e3] transition-colors duration-200 cursor-pointer"
            >
              {t('recargas.seeMore')}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                <path d="m9 6 6 6-6 6" />
              </svg>
            </button>

            <div className="mt-6 grid w-full grid-cols-3 gap-2 border-t border-[#f0f0f8] pt-5 text-[#5518c1]">
              {DATA_BENEFITS.map((b) => (
                <div key={b.key} className="flex flex-col items-center gap-1.5 text-center">
                  <div className="h-5 w-5">{b.icon}</div>
                  <p className="text-[8px] font-semibold uppercase leading-tight tracking-wide">{t(`recargas.${b.key}`)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-6 bg-[#50fbd2] text-center">
            <a
              onClick={() => {
                localStorage.setItem('package', recarga.id)
                window.location.href = '/dashboard'
              }}
              className="block w-full cursor-pointer text-center rounded-full bg-[#5518c1] py-4 text-[13px] font-medium uppercase text-white transition-all duration-200 hover:bg-[#8224e3] hover:scale-[1.02] active:scale-[0.98]"
              style={{ fontFamily: 'var(--font-rubik)' }}
            >
              {t('recargas.cta')}
            </a>
          </div>
        </div>

        {/* BACK — product copy, keeping the buy button from the front face */}
        <div className="flip-card-face flip-card-back rounded-[25px] overflow-hidden flex flex-col bg-white border border-[#e5e5f2] shadow-sm">
          <div className="flex-1 flex flex-col justify-center px-6 py-6 text-left">
            <h4 className="flex items-center gap-2 text-[17px] font-bold text-[#5518c1]" style={{ fontFamily: 'var(--font-rubik)' }}>
              <span className="text-[#50fbd2] drop-shadow-[0_0_1px_rgba(85,24,193,0.6)]">◆</span>
              {t(`recargas.${recarga.key}.name`)}
            </h4>
            <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#8224e3]">
              {t('recargas.meta')}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-[#444]" style={{ fontFamily: 'var(--font-manrope)' }}>
              {t(`recargas.${recarga.key}.desc`)}
            </p>

            <button
              type="button"
              onClick={() => setFlipped(false)}
              className="mt-4 inline-flex items-center gap-1 self-start text-[13px] font-semibold text-[#5518c1] hover:text-[#8224e3] transition-colors duration-200 cursor-pointer"
              style={{ fontFamily: 'var(--font-rubik)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                <path d="m15 6-6 6 6 6" />
              </svg>
              {t('recargas.flipBack')}
            </button>
          </div>

          <div className="px-6 py-6 bg-[#50fbd2] text-center">
            <a
              onClick={() => {
                localStorage.setItem('package', recarga.id)
                window.location.href = '/dashboard'
              }}
              className="block w-full cursor-pointer text-center rounded-full bg-[#5518c1] py-4 text-[13px] font-medium uppercase text-white transition-all duration-200 hover:bg-[#8224e3] hover:scale-[1.02] active:scale-[0.98]"
              style={{ fontFamily: 'var(--font-rubik)' }}
            >
              {t('recargas.cta')}
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function RecargasPage() {
  const { t } = useTranslation('landing')

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <main>
      <section className="bg-white py-20" style={{ fontFamily: 'var(--font-manrope)' }}>
        <div className="mx-auto max-w-[1280px] px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[40px] md:text-[55px] font-bold text-[#5518c1] text-center mb-12"
            style={{ fontFamily: 'var(--font-rubik)' }}
          >
            {t('recargas.title')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
            {RECARGAS.map((recarga, i) => (
              <RecargaCard key={recarga.gb} recarga={recarga} index={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

/* ============================================================
   PORTABILITY PAGE (/portabilidad) — port-in form
   ============================================================ */
const CARRIERS = ['Telcel', 'AT&T', 'Movistar', 'Bait', 'Unefon', 'Virgin Mobile', 'Pillofón', 'Flash Mobile', 'Otra']

function PortabilityForm() {
  const { t } = useTranslation('landing')
  const [form, setForm] = useState({ name: '', email: '', phone: '', carrier: '', nip: '' })
  const [accepted, setAccepted] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (field: keyof typeof form) => (e: Event) => {
    const target = e.currentTarget as HTMLInputElement | HTMLSelectElement
    setForm((f) => ({ ...f, [field]: target.value }))
  }

  const onSubmit = (e: Event) => {
    e.preventDefault()
    // TODO: enviar `form` a la API de portabilidad cuando el endpoint esté disponible.
    setSubmitted(true)
  }

  const inputClass =
    'w-full rounded-xl border border-[#e5e5ef] bg-white px-4 py-3 text-[15px] text-[#00010a] placeholder:text-[#00010a66] outline-none transition-colors focus:border-[#5518c1] focus:ring-2 focus:ring-[#5518c1]/20'
  const labelClass = 'block text-[13px] font-semibold text-[#00010a] mb-1.5'

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="mx-auto max-w-[560px] rounded-[25px] bg-white p-10 text-center shadow-lg"
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#50fbd2]">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#5518c1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-[24px] font-bold text-[#5518c1]" style={{ fontFamily: 'var(--font-rubik)' }}>
          {t('portability.form.successTitle')}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-[#555]">{t('portability.form.success')}</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mx-auto max-w-[560px] rounded-[25px] bg-white p-8 md:p-10 shadow-lg"
    >
      <h2 className="mb-6 text-center text-[26px] font-bold text-[#5518c1]" style={{ fontFamily: 'var(--font-rubik)' }}>
        {t('portability.form.title')}
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="pf-name">{t('portability.form.name')}</label>
          <input id="pf-name" type="text" required value={form.name} onInput={set('name')} placeholder={t('portability.form.namePlaceholder')} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="pf-email">{t('portability.form.email')}</label>
          <input id="pf-email" type="email" required value={form.email} onInput={set('email')} placeholder={t('portability.form.emailPlaceholder')} className={inputClass} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="pf-phone">{t('portability.form.phone')}</label>
            <input id="pf-phone" type="tel" required inputMode="numeric" pattern="[0-9]{10}" maxLength={10} value={form.phone} onInput={set('phone')} placeholder={t('portability.form.phonePlaceholder')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="pf-carrier">{t('portability.form.carrier')}</label>
            <select id="pf-carrier" required value={form.carrier} onChange={set('carrier')} className={`${inputClass} ${form.carrier === '' ? 'text-[#00010a66]' : ''}`}>
              <option value="" disabled>{t('portability.form.carrierPlaceholder')}</option>
              {CARRIERS.map((c) => (
                <option key={c} value={c} className="text-[#00010a]">{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="pf-nip">{t('portability.form.nip')}</label>
          <input id="pf-nip" type="text" required inputMode="numeric" pattern="[0-9]{4}" maxLength={4} value={form.nip} onInput={set('nip')} placeholder={t('portability.form.nipPlaceholder')} className={inputClass} />
          <p className="mt-1.5 text-[12px] leading-relaxed text-[#888]">{t('portability.form.nipHelp')}</p>
        </div>
        <label className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[#555] cursor-pointer">
          <input type="checkbox" required checked={accepted} onChange={(e) => setAccepted((e.currentTarget as HTMLInputElement).checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#5518c1]" />
          <span>{t('portability.form.terms')}</span>
        </label>
        <button type="submit" className="w-full cursor-pointer rounded-full bg-[#5518c1] py-4 text-[14px] font-semibold uppercase text-white transition-all duration-200 hover:bg-[#8224e3] hover:scale-[1.02] active:scale-[0.98]" style={{ fontFamily: 'var(--font-rubik)' }}>
          {t('portability.form.submit')}
        </button>
      </form>
    </motion.div>
  )
}

function PortabilityPage() {
  const { t } = useTranslation('landing')
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <main>
      <section className="bg-[#F8F9FD] overflow-hidden" style={{ fontFamily: 'var(--font-manrope)' }}>
        <div className="mx-auto max-w-[1280px] px-6 pt-16 pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-4"
          >
            <p className="text-[18px] font-semibold uppercase tracking-wide text-[#5518c1]" style={{ fontFamily: 'var(--font-rubik)' }}>
              {t('portability.eyebrow')}
            </p>
            <h1 className="text-[44px] md:text-[64px] font-black leading-tight text-[#1c1c1c]">
              {t('portability.title')}
            </h1>
            <p className="mx-auto max-w-[640px] text-[18px] md:text-[22px] font-medium leading-relaxed text-[#5518c1]" style={{ fontFamily: 'var(--font-rubik)' }}>
              {t('portability.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <section id="portabilidad" className="bg-[#f5f5ff] py-20" style={{ fontFamily: 'var(--font-manrope)' }}>
        <div className="mx-auto max-w-[1280px] px-6">
          <PortabilityForm />
        </div>
      </section>
    </main>
  )
}

/* ============================================================
   DERECHOS ARCO PAGE
   Legal content is Spanish-only, matching src/assets/tyc.md and ap.md.
   ============================================================ */
const ARCO_RIGHTS = [
  { name: 'Acceso', desc: 'Conocer qué datos personales tenemos sobre usted, para qué los usamos y las condiciones de su tratamiento.' },
  { name: 'Rectificación', desc: 'Solicitar la corrección de sus datos cuando estén desactualizados, sean inexactos o incompletos.' },
  { name: 'Cancelación', desc: 'Solicitar la eliminación de sus datos de nuestras bases de datos cuando sea procedente.' },
  { name: 'Oposición', desc: 'Oponerse al uso de sus datos para fines específicos.' },
] as const

const ARCO_SERVICES = ['eShop', 'Gamership Mobile', 'Vinculación de Línea', 'Plataforma general', 'Otro'] as const

const ARCO_REQUEST_TYPES = [
  'Acceso',
  'Rectificación',
  'Cancelación',
  'Oposición',
  'Revocación del consentimiento',
  'Limitación de uso',
] as const

function ArcoSection({ title, children }: { title: string; children: ComponentChildren }) {
  return (
    <section className="space-y-4">
      <h2 className="text-[22px] md:text-[26px] font-bold text-[#5518c1]" style={{ fontFamily: 'var(--font-rubik)' }}>
        {title}
      </h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-[#444]">{children}</div>
    </section>
  )
}

const arcoFieldClass =
  'w-full rounded-xl border border-[#e5e5f2] bg-white px-4 py-3 text-[14px] text-[#00010a] outline-none transition-colors duration-200 placeholder:text-[#aaa] focus:border-[#8224e3]'
const arcoLabelClass = 'block text-[13px] font-semibold text-[#00010a]'

function ArcoPage() {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <main style={{ fontFamily: 'var(--font-manrope)' }}>
      <section className="bg-[#F8F9FD] py-16">
        <div className="mx-auto max-w-[860px] px-6 text-center">
          <h1 className="text-[36px] md:text-[52px] font-extrabold leading-tight text-[#5518c1]" style={{ fontFamily: 'var(--font-rubik)' }}>
            Derechos ARCO
          </h1>
          <p className="mt-3 text-[16px] md:text-[18px] text-[#555]">
            Gamership — Ejercicio de Derechos de Protección de Datos Personales
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-[860px] px-6 space-y-14">
          <ArcoSection title="¿Qué son los Derechos ARCO?">
            <p>
              Conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP),
              usted tiene derecho a:
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {ARCO_RIGHTS.map((r) => (
                <div key={r.name} className="rounded-[18px] border border-[#e5e5f2] bg-white p-5 shadow-sm">
                  <p className="text-[15px] font-bold text-[#5518c1]" style={{ fontFamily: 'var(--font-rubik)' }}>
                    {r.name}
                  </p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-[#555]">{r.desc}</p>
                </div>
              ))}
            </div>
            <p className="pt-1">Adicionalmente, usted puede:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <strong className="text-[#00010a]">Revocar su consentimiento</strong> para el tratamiento de sus datos
                personales en cualquier momento.
              </li>
              <li>
                <strong className="text-[#00010a]">Limitar el uso o divulgación</strong> de sus datos personales.
              </li>
            </ul>
          </ArcoSection>

          <ArcoSection title="¿Quién puede ejercer estos derechos?">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                El <strong className="text-[#00010a]">Titular</strong> de los datos personales, presentando
                identificación oficial vigente.
              </li>
              <li>
                Un <strong className="text-[#00010a]">representante legal</strong>, acreditando su representación
                mediante poder notarial o carta poder firmada ante dos testigos, acompañada de identificación oficial de
                ambas partes.
              </li>
            </ul>
          </ArcoSection>

          <ArcoSection title="¿Cómo ejercerlos?">
            <p>Tiene tres opciones para presentar su solicitud:</p>
            <ol className="space-y-4">
              <li className="rounded-[18px] border border-[#e5e5f2] bg-white p-5 shadow-sm">
                <p className="text-[15px] font-bold text-[#5518c1]" style={{ fontFamily: 'var(--font-rubik)' }}>
                  1. Formulario en línea
                </p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[#555]">
                  Complete el formulario al final de esta página. Es la vía más rápida y recibirá confirmación
                  automática.
                </p>
              </li>
              <li className="rounded-[18px] border border-[#e5e5f2] bg-white p-5 shadow-sm">
                <p className="text-[15px] font-bold text-[#5518c1]" style={{ fontFamily: 'var(--font-rubik)' }}>
                  2. Correo electrónico
                </p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[#555]">
                  Envíe su solicitud a{' '}
                  <a href="mailto:legal@gamership.com.mx" className="font-semibold text-[#5518c1] hover:text-[#8224e3]">
                    legal@gamership.com.mx
                  </a>{' '}
                  con el asunto: <strong className="text-[#00010a]">"Solicitud Derechos ARCO"</strong>
                </p>
              </li>
              <li className="rounded-[18px] border border-[#e5e5f2] bg-white p-5 shadow-sm">
                <p className="text-[15px] font-bold text-[#5518c1]" style={{ fontFamily: 'var(--font-rubik)' }}>
                  3. Correo postal
                </p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-[#555]">
                  Dirija su solicitud al Departamento Legal de Gamership: General Mariano Escobedo 510, Interior 801,
                  Colonia Anzures, Alcaldía Miguel Hidalgo, C.P. 11590, Ciudad de México.
                </p>
              </li>
            </ol>
          </ArcoSection>

          <ArcoSection title="¿Qué debe incluir su solicitud?">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Nombre completo del Titular</li>
              <li>Correo electrónico o domicilio para recibir la respuesta</li>
              <li>Copia de identificación oficial vigente del Titular y, en su caso, del representante legal</li>
              <li>Descripción clara y precisa de los datos sobre los que desea ejercer su derecho</li>
              <li>Cualquier documento que facilite la localización de sus datos</li>
            </ul>
          </ArcoSection>

          <ArcoSection title="Plazos de atención">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse overflow-hidden rounded-[14px] border border-[#e5e5f2] text-left text-[14px]">
                <thead>
                  <tr className="bg-[#f5f5ff]">
                    <th className="px-5 py-3 font-bold text-[#5518c1]" style={{ fontFamily: 'var(--font-rubik)' }}>Etapa</th>
                    <th className="px-5 py-3 font-bold text-[#5518c1]" style={{ fontFamily: 'var(--font-rubik)' }}>Plazo</th>
                  </tr>
                </thead>
                <tbody className="text-[#555]">
                  <tr className="border-t border-[#e5e5f2]">
                    <td className="px-5 py-3">Confirmación de recepción</td>
                    <td className="px-5 py-3">24 horas</td>
                  </tr>
                  <tr className="border-t border-[#e5e5f2]">
                    <td className="px-5 py-3">Respuesta a su solicitud</td>
                    <td className="px-5 py-3">Máximo 20 días hábiles</td>
                  </tr>
                  <tr className="border-t border-[#e5e5f2]">
                    <td className="px-5 py-3">Ejecución de la resolución</td>
                    <td className="px-5 py-3">15 días hábiles posteriores a la respuesta</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              El ejercicio de los Derechos ARCO es <strong className="text-[#00010a]">gratuito</strong>.
            </p>
            <p>
              En caso de que su solicitud sea incompleta, le notificaremos dentro de los 5 días hábiles siguientes para
              que aporte los elementos faltantes. Contará con 10 días hábiles para atender dicho requerimiento; de no
              hacerlo, su solicitud se tendrá por no presentada.
            </p>
          </ArcoSection>

          <ArcoSection title="Limitaciones al ejercicio de derechos">
            <p>La Cancelación de datos no procederá cuando:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Deban conservarse por disposición legal</li>
              <li>Obstaculicen actuaciones judiciales o administrativas</li>
              <li>Sean necesarios para proteger intereses jurídicos del Titular</li>
              <li>Sean necesarios para cumplir con una obligación legalmente adquirida</li>
            </ul>
            <p>
              En el caso de datos vinculados a una línea de telefonía móvil, la cancelación puede implicar la suspensión
              del servicio conforme a la normativa de la CRT.
            </p>
          </ArcoSection>

          <ArcoSection title="Revocación del consentimiento">
            <p>
              Usted puede revocar su consentimiento para el tratamiento de sus datos en cualquier momento, sin efectos
              retroactivos. La revocación deberá realizarse a través de los mismos canales indicados anteriormente.
            </p>
          </ArcoSection>

          <ArcoSection title="Autoridad competente">
            <p>Si considera que su solicitud no fue atendida correctamente, puede acudir ante:</p>
            <p>
              <strong className="text-[#00010a]">Unidad de Protección de Datos Personales (UPDP)</strong>
              <br />
              Secretaría Anticorrupción y Buen Gobierno (SABG)
            </p>
            <p>
              O ante el{' '}
              <strong className="text-[#00010a]">
                Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI)
              </strong>
              .
            </p>
          </ArcoSection>

          <ArcoRequestForm />

          <div className="border-t border-[#e5e5f2] pt-8 text-center text-[13px] leading-relaxed text-[#888]">
            <p>
              Contacto:{' '}
              <a href="mailto:legal@gamership.com.mx" className="font-semibold text-[#5518c1] hover:text-[#8224e3]">
                legal@gamership.com.mx
              </a>
            </p>
            <p>Fecha de última actualización: 01 de julio de 2026</p>
          </div>
        </div>
      </section>
    </main>
  )
}

function ArcoRequestForm() {
  const [isRepresentative, setIsRepresentative] = useState(false)

  return (
    <section id="formulario" className="scroll-mt-24 rounded-[24px] border border-[#e5e5f2] bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-[22px] md:text-[26px] font-bold text-[#5518c1]" style={{ fontFamily: 'var(--font-rubik)' }}>
        Formulario de solicitud
      </h2>
      <p className="mt-2 text-[14px] leading-relaxed text-[#555]">
        Al enviarse la solicitud, se generará un número de folio único y se notificará al correo registrado dentro de
        las 24 horas siguientes.
      </p>

      {/* Submission is intentionally inert — there is no backend for this form yet. */}
      <div className="mt-7 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className={arcoLabelClass} htmlFor="arco-name">
              Nombre completo del Titular *
            </label>
            <input id="arco-name" type="text" className={arcoFieldClass} placeholder="Nombre y apellidos" />
          </div>
          <div className="space-y-1.5">
            <label className={arcoLabelClass} htmlFor="arco-email">
              Correo electrónico de contacto *
            </label>
            <input id="arco-email" type="email" className={arcoFieldClass} placeholder="correo@ejemplo.com" />
          </div>
          <div className="space-y-1.5">
            <label className={arcoLabelClass} htmlFor="arco-phone">
              Teléfono <span className="font-normal text-[#888]">(opcional)</span>
            </label>
            <input id="arco-phone" type="tel" className={arcoFieldClass} placeholder="10 dígitos" />
          </div>
          <div className="space-y-1.5">
            <label className={arcoLabelClass} htmlFor="arco-service">
              Servicio relacionado *
            </label>
            <select id="arco-service" className={arcoFieldClass}>
              <option value="">Selecciona una opción</option>
              {ARCO_SERVICES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <fieldset className="space-y-2.5">
          <legend className={arcoLabelClass}>Derecho que desea ejercer *</legend>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {ARCO_REQUEST_TYPES.map((r) => (
              <label key={r} className="flex cursor-pointer items-center gap-2.5 text-[14px] text-[#444]">
                <input type="checkbox" className="h-4 w-4 accent-[#5518c1]" />
                {r}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="space-y-1.5">
          <label className={arcoLabelClass} htmlFor="arco-desc">
            Descripción de la solicitud *
          </label>
          <textarea
            id="arco-desc"
            rows={4}
            className={`${arcoFieldClass} resize-y`}
            placeholder="Qué datos, en qué contexto y qué acción desea que tomemos"
          />
        </div>

        <div className="space-y-1.5">
          <label className={arcoLabelClass} htmlFor="arco-id">
            Identificación oficial vigente *
          </label>
          <input id="arco-id" type="file" accept=".pdf,.jpg,.jpeg,.png" className={`${arcoFieldClass} py-2.5`} />
          <p className="text-[12px] text-[#888]">INE/IFE, pasaporte o FM3 — PDF, JPG o PNG, máx. 5 MB.</p>
        </div>

        <div className="rounded-[18px] border border-[#e5e5f2] bg-[#f5f5ff] p-5">
          <label className="flex cursor-pointer items-start gap-2.5 text-[14px] font-semibold text-[#00010a]">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-[#5518c1]"
              checked={isRepresentative}
              onChange={(e) => setIsRepresentative((e.target as HTMLInputElement).checked)}
            />
            Actúo como representante legal del Titular
          </label>

          {isRepresentative && (
            <div className="mt-5 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className={arcoLabelClass} htmlFor="arco-rep-name">
                    Nombre completo del representante *
                  </label>
                  <input id="arco-rep-name" type="text" className={arcoFieldClass} placeholder="Nombre y apellidos" />
                </div>
                <div className="space-y-1.5">
                  <label className={arcoLabelClass} htmlFor="arco-rep-email">
                    Correo electrónico del representante *
                  </label>
                  <input id="arco-rep-email" type="email" className={arcoFieldClass} placeholder="correo@ejemplo.com" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={arcoLabelClass} htmlFor="arco-rep-doc">
                  Documento de representación *
                </label>
                <input id="arco-rep-doc" type="file" accept=".pdf,.jpg,.jpeg,.png" className={`${arcoFieldClass} py-2.5`} />
                <p className="text-[12px] text-[#888]">Poder notarial o carta poder firmada ante dos testigos.</p>
              </div>
            </div>
          )}
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 text-[14px] leading-relaxed text-[#444]">
          <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-[#5518c1]" />
          <span>
            Declaro haber leído y aceptado el{' '}
            <a href="/aviso-de-privacidad" className="font-semibold text-[#5518c1] hover:text-[#8224e3]">
              Aviso de Privacidad
            </a>{' '}
            de Gamership y que la información proporcionada es verídica y corresponde a mi identidad.
          </span>
        </label>

        <button
          type="button"
          onClick={() => {}}
          className="w-full rounded-full bg-[#5518c1] py-4 text-[14px] font-semibold uppercase text-white transition-all duration-200 hover:bg-[#8224e3] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          style={{ fontFamily: 'var(--font-rubik)' }}
        >
          Enviar solicitud
        </button>
      </div>
    </section>
  )
}

/* ============================================================
   POR QUÉ VINCULAR PAGE (/por-que-vincular) — RNU info + FAQ
   ============================================================ */
const LINK_LINE_STEP_KEYS = ['s1', 's2', 's3', 's4'] as const

const LINK_LINE_STEP_ICONS = [
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" />
  </svg>,
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" /><circle cx="8" cy="11" r="2" /><path d="M14 10h4M14 13h3M6 16h6" />
  </svg>,
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><circle cx="12" cy="10" r="2.5" /><path d="M7.5 18a4.5 4.5 0 0 1 9 0" />
  </svg>,
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 13l4 4L19 7" />
  </svg>,
]

const LINK_LINE_FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'] as const

// q2's answer is a deadline schedule keyed by the last digit of the phone
// number; it reads far better as a table than as a run-on paragraph.
const LINK_LINE_DEADLINE_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const

function PorQueVincularPage() {
  const { t } = useTranslation('landing')
  const [openFaq, setOpenFaq] = useState(0)
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  function scrollToFaq() {
    const el = document.getElementById('por-que-vincular-faq')
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden text-white" style={{ background: 'radial-gradient(120% 140% at 80% 0%, #8224e3 0%, #5518c1 42%, #2d0a63 100%)' }}>
        <div className="mx-auto max-w-[900px] px-6 pt-24 pb-16 text-center" style={{ fontFamily: 'var(--font-manrope)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-5"
          >
            <h1 className="text-[36px] md:text-[56px] font-black uppercase leading-tight tracking-tight" style={{ fontFamily: 'var(--font-rubik)' }}>
              <span className="text-[#50fbd2]">{t('linkLine.hero.title')}</span>{' '}
              <span className="text-white">{t('linkLine.hero.titleHighlight')}</span>
            </h1>
            <p className="mx-auto max-w-[560px] text-[16px] md:text-[18px] leading-relaxed text-white/80">
              {t('linkLine.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2" style={{ fontFamily: 'var(--font-rubik)' }}>
              <a
                href="/vincula-tu-linea/registro"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#50fbd2] px-7 py-3.5 text-[15px] font-bold text-[#00010a] transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {t('linkLine.hero.ctaPrimary')}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
              <a
                href="/vincula-tu-linea/consultar"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/30 bg-white/10 px-7 py-3.5 text-[15px] font-bold text-white backdrop-blur transition-all duration-200 hover:bg-white/20 hover:scale-105 active:scale-95"
              >
                {t('linkLine.hero.ctaSecondary')}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* OFFICIAL NOTICE */}
      <section className="border-y border-[#ececec] bg-[#F8F9FD]">
        <div className="mx-auto max-w-[1000px] px-6 py-6 flex flex-wrap items-center justify-center gap-4 text-center">
          <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-[#5518c11a] text-[#5518c1]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="max-w-[640px] text-[14px] leading-relaxed text-[#00010a]">
            {t('linkLine.notice.before')}<strong className="text-[#5518c1]">{t('linkLine.notice.highlight')}</strong>{t('linkLine.notice.after')}
          </p>
          <button
            type="button"
            onClick={scrollToFaq}
            className="cursor-pointer whitespace-nowrap text-[13px] font-bold text-[#5518c1] transition-colors hover:text-[#8224e3]"
          >
            {t('linkLine.notice.cta')}
          </button>
        </div>
      </section>

      {/* STEPS */}
      <section className="bg-white py-20" style={{ fontFamily: 'var(--font-manrope)' }}>
        <div className="mx-auto max-w-[1280px] px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-14 max-w-[640px] text-center"
          >
            <p className="text-[12px] font-bold uppercase tracking-[.14em] text-[#5518c1]" style={{ fontFamily: 'var(--font-rubik)' }}>
              {t('linkLine.steps.eyebrow')}
            </p>
            <h2 className="mt-3 text-[28px] md:text-[40px] font-extrabold uppercase text-[#5518c1]" style={{ fontFamily: 'var(--font-rubik)' }}>
              {t('linkLine.steps.title')}
            </h2>
            <p className="mt-3 text-[15px] text-[#666]">{t('linkLine.steps.subtitle')}</p>
          </motion.div>

          <div className="mx-auto grid max-w-[1040px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {LINK_LINE_STEP_KEYS.map((key, i) => {
              const last = i === LINK_LINE_STEP_KEYS.length - 1
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`flex flex-col items-center rounded-[25px] p-7 text-center transition-all duration-200 hover:-translate-y-1 ${last ? 'bg-[#5518c1] shadow-xl' : 'bg-[#f5f5ff] hover:shadow-xl'}`}
                >
                  <span className={`text-[20px] font-extrabold ${last ? 'text-[#50fbd2]' : 'text-[#5518c1]'}`} style={{ fontFamily: 'var(--font-rubik)' }}>
                    {last ? t('linkLine.steps.doneLabel') : `${t('linkLine.steps.stepLabel')} ${i + 1}`}
                  </span>
                  <div className={`my-4 flex h-[52px] w-[52px] items-center justify-center rounded-2xl ${last ? 'bg-[#50fbd2] text-[#00010a]' : 'bg-white text-[#5518c1]'}`}>
                    {LINK_LINE_STEP_ICONS[i]}
                  </div>
                  <h3 className={`mb-1.5 text-[15px] font-bold ${last ? 'text-white' : 'text-[#5518c1]'}`} style={{ fontFamily: 'var(--font-rubik)' }}>
                    {t(`linkLine.steps.${key}.title`)}
                  </h3>
                  <p className={`text-[13px] leading-relaxed ${last ? 'text-white/80' : 'text-[#555]'}`}>
                    {t(`linkLine.steps.${key}.desc`)}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="por-que-vincular-faq" className="border-t border-[#ececec] bg-[#f5f5ff] py-20">
        <div className="mx-auto max-w-[840px] px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="text-[12px] font-bold uppercase tracking-[.14em] text-[#5518c1]" style={{ fontFamily: 'var(--font-rubik)' }}>
              {t('linkLine.faq.eyebrow')}
            </p>
            <h2 className="mt-3 text-[28px] md:text-[40px] font-extrabold uppercase text-[#5518c1]" style={{ fontFamily: 'var(--font-rubik)' }}>
              {t('linkLine.faq.title')}
            </h2>
          </motion.div>

          <div className="space-y-3">
            {LINK_LINE_FAQ_KEYS.map((key, i) => {
              const open = openFaq === i
              return (
                <div key={key} className={`overflow-hidden rounded-[20px] border bg-white ${open ? 'border-[#8224e3]' : 'border-transparent'}`}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    className="flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left"
                  >
                    <span className="w-6 flex-none text-[13px] font-extrabold text-[#5518c1]" style={{ fontFamily: 'var(--font-rubik)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 text-[15px] font-semibold text-[#00010a]">{t(`linkLine.faq.${key}.q`)}</span>
                    <span className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-[18px] font-bold transition-colors ${open ? 'bg-[#5518c1] text-white' : 'bg-[#5518c11a] text-[#5518c1]'}`}>
                      {open ? '–' : '+'}
                    </span>
                  </button>
                  {open && (
                    <div className="px-5 pb-5 pl-[62px] text-[14px] leading-relaxed text-[#555]">
                      <p className="whitespace-pre-line">{t(`linkLine.faq.${key}.a`)}</p>

                      {key === 'q2' && (
                        <>
                          <div className="mt-4 overflow-x-auto">
                            <table className="w-full max-w-[440px] border-collapse overflow-hidden rounded-[12px] border border-[#e5e5f2] text-left text-[13px]">
                              <thead>
                                <tr className="bg-[#f5f5ff]">
                                  <th className="px-4 py-2.5 font-bold text-[#5518c1]" style={{ fontFamily: 'var(--font-rubik)' }}>
                                    {t('linkLine.faq.deadlines.headerDigit')}
                                  </th>
                                  <th className="px-4 py-2.5 font-bold text-[#5518c1]" style={{ fontFamily: 'var(--font-rubik)' }}>
                                    {t('linkLine.faq.deadlines.headerDate')}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {LINK_LINE_DEADLINE_DIGITS.map((d) => (
                                  <tr key={d} className="border-t border-[#e5e5f2]">
                                    <td className="px-4 py-2 text-center text-[15px] font-extrabold text-[#00010a]" style={{ fontFamily: 'var(--font-rubik)' }}>
                                      {d}
                                    </td>
                                    <td className="px-4 py-2">{t(`linkLine.faq.deadlines.d${d}`)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <p className="mt-3">{t('linkLine.faq.q2.note')}</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="text-center text-white" style={{ background: 'radial-gradient(120% 160% at 20% 0%, #8224e3 0%, #5518c1 45%, #2d0a63 100%)' }}>
        <div className="mx-auto max-w-[760px] px-6 py-20" style={{ fontFamily: 'var(--font-manrope)' }}>
          <h2 className="text-[28px] md:text-[42px] font-black uppercase leading-tight" style={{ fontFamily: 'var(--font-rubik)' }}>
            {t('linkLine.final.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] md:text-[18px] leading-relaxed text-white/80">
            {t('linkLine.final.subtitle')}
          </p>
          <a
            href="/vincula-tu-linea/registro"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#50fbd2] px-9 py-4 text-[15px] font-bold text-[#00010a] transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ fontFamily: 'var(--font-rubik)' }}
          >
            {t('linkLine.final.cta')}
          </a>
        </div>
      </section>
    </main>
  )
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer() {
  const { t } = useTranslation('common')
  return (
    <footer className="bg-[#06041C] text-white py-16" style={{ fontFamily: 'var(--font-manrope)' }}>
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="space-y-4">
            <img
              src="/gm-site/logo.webp"
              alt="Gamership Mobile"
              width={160}
              height={40}
              className="h-10 w-auto object-contain brightness-0 invert"
            />
            <p className="text-[13px] text-[#ffffff99] leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          <div className="space-y-4">
            <h6 className="text-[13px] font-bold tracking-widest uppercase text-[#50fbd2]">{t('footer.gamershipTitle')}</h6>
            <ul className="space-y-2">
              {FOOTER_LINKS.gamership.map((link) => (
                <li key={link.key}>
                  <a href={link.href} className="text-[13px] text-[#ffffff99] hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">
                    {t(`footer.links.${link.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h6 className="text-[13px] font-bold tracking-widest uppercase text-[#50fbd2]">{t('footer.companyTitle')}</h6>
            <ul className="space-y-2">
              {FOOTER_LINKS.compania.map((link) => (
                <li key={link.key}>
                  <a href={link.href} className="text-[13px] text-[#ffffff99] hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">
                    {t(`footer.links.${link.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h6 className="text-[13px] font-bold tracking-widest uppercase text-[#50fbd2]">{t('footer.legalTitle')}</h6>
            <ul className="space-y-2">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.key}>
                  <a href={link.href} className="text-[13px] text-[#ffffff99] hover:text-white transition-all duration-200 hover:translate-x-1 inline-block">
                    {t(`footer.links.${link.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h6 className="text-[13px] font-bold tracking-widest uppercase text-[#50fbd2]">
                {t('footer.newsletterTitle')}
              </h6>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  className="flex-1 rounded-full bg-[#ffffff1a] px-4 py-2.5 text-[13px] text-white placeholder:text-[#ffffff66] outline-none focus:ring-2 focus:ring-[#8224e3] border border-[#ffffff1a]"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[#8224e3] px-4 py-2.5 text-white hover:bg-[#5518c1] transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                >
                  →
                </button>
              </form>
            </div>

            <div className="space-y-3">
              <h6 className="text-[13px] font-bold tracking-widest uppercase text-[#50fbd2]">
                {t('footer.communityTitle')}
              </h6>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffffff1a] text-[13px] text-white hover:bg-[#8224e3] transition-all duration-200 hover:scale-110"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#ffffff1a] pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-[#ffffff66]">
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
          </div>
          <p>{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  )
}

/* ============================================================
   REGISTER BANNER
   ============================================================ */
function RegisterBanner() {
  const [visible, setVisible] = useState(true)
  const { t } = useTranslation('common')

  if (!visible) return null

  return (
    <div className="w-full bg-[#50fbd2] px-4 py-2.5" style={{ fontFamily: 'var(--font-rubik)' }}>
      <div className="mx-auto max-w-[1280px] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="flex-shrink-0 text-[#5518c1]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true" width="20" height="20" fill="currentColor">
              <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
            </svg>
          </span>
          <p className="text-[13px] font-medium text-[#00010a] leading-snug truncate md:whitespace-normal">
            {t('banner.text')}{' '}
            <a
              href="/por-que-vincular"
              className="font-bold text-[#5518c1] underline underline-offset-2 hover:text-[#8224e3] transition-colors duration-200"
            >
              {t('banner.link')}
            </a>
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href="/vincula-tu-linea"
            className="text-[13px] font-bold text-[#5518c1] underline underline-offset-2 hover:text-[#8224e3] transition-all duration-200 whitespace-nowrap hover:scale-105 inline-block"
          >
            {t('banner.cta')}
          </a>
          <button
            type="button"
            aria-label={t('banner.closeAria')}
            onClick={() => setVisible(false)}
            className="flex-shrink-0 cursor-pointer p-1 rounded-full text-[#5518c1] hover:text-[#8224e3] hover:bg-[#5518c120] transition-all duration-200 active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" aria-hidden="true" width="16" height="16" fill="currentColor">
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   ACCOUNT FLOWS — shared @lucky-intelligence/account-ui
   ============================================================ */

function accountScope<P extends Record<string, unknown>>(Comp: (props: P) => any) {
  return (props: P) => (
    <div class="account-ui">
      <Comp {...props} />
    </div>
  )
}
const CrtLanding = accountScope(CrtLandingPage)
const CrtCheck = accountScope(CrtCheckPage)
const PhoneRegister = accountScope(PhoneRegistrationFlow)
const PhoneConfirm = accountScope(PhoneConfirmation)

// Authenticated dashboard: Cognito session (AuthProvider) + authed fetch
// (GlobalProvider). `Authenticated` runs setup() and redirects to Cognito if
// there's no session, so this flow only triggers on /dashboard.
const DashboardRoute = accountScope(() => (
  <AuthProvider>
    <GlobalProvider>
      <Authenticated>
        <Dashboard crtCheckPath="/vincula-tu-linea/consultar" crtRegisterPath="/vincula-tu-linea/registro" hideExpiry={import.meta.env.VITE_HIDE_EXPIRY === 'true'} />
      </Authenticated>
    </GlobalProvider>
  </AuthProvider>
))

const LoginRoute = accountScope(() => (
  <AuthProvider>
    <LoginPage dashboardPath="/dashboard" />
  </AuthProvider>
))

/* ============================================================
   LANDING + 404
   ============================================================ */
function LandingPage() {
  const { path } = useLocation()
  // `/paquetes` → scroll to the #paquetes section; `/` → top. Runs on every
  // route change since the same component stays mounted across these paths.
  useEffect(() => {
    const el = path !== '/' && document.getElementById(path.slice(1))
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth' }))
    else window.scrollTo({ top: 0 })
  }, [path])

  return (
    <main>
      <HeroSection />
      <WhyChooseSection />
      <PlansSection />
      <EcosystemSection />
    </main>
  )
}

function NotFound() {
  const { t } = useTranslation('landing')
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-24"
      style={{ fontFamily: 'var(--font-rubik)' }}
    >
      <p className="text-[80px] font-extrabold text-[#5518c1] leading-none">404</p>
      <p className="mt-2 text-[18px] text-[#00010a]">{t('notFound.title')}</p>
      <a
        href="/"
        className="mt-6 rounded-full bg-[#5518c1] px-6 py-3 text-[14px] font-semibold text-white transition-all duration-200 hover:bg-[#8224e3] hover:scale-105 active:scale-95"
      >
        {t('notFound.cta')}
      </a>
    </div>
  )
}

/* ============================================================
   APP ROOT
   ============================================================ */
export function App() {
  const { i18n } = useTranslation()
  // The account flows carry their own translations; follow the site's language.
  const lang = i18n.resolvedLanguage === 'en' ? 'en' : 'es'

  return (
    <div className="min-h-screen bg-[#F8F9FD]" style={{ fontFamily: 'var(--font-manrope)' }}>
      <LocationProvider>
        <PhoneRegistrationProvider>
          <RegisterBanner />
          <Navbar />
          <Router>
            <Route path="/" component={LandingPage} />
            {/* Landing-section routes: render the landing and scroll to the section. */}
            <Route path="/paquetes" component={LandingPage} />
            <Route path="/recargas" component={RecargasPage} />
            <Route path="/derechos-arco" component={ArcoPage} />
            <Route path="/por-que-vincular" component={PorQueVincularPage} />
            <Route path="/portabilidad" component={PortabilityPage} />
            <Route path="/atencion" component={LandingPage} />

            {/* Account / registration flows (public) — shared account-ui. */}
            <Route path="/vincula-tu-linea"           component={CrtLanding}    lang={lang} registerPath="/vincula-tu-linea/registro" checkPath="/vincula-tu-linea/consultar" termsDoc={tycMd} privacyDoc={apMd} />
            <Route path="/vincula-tu-linea/consultar" component={CrtCheck}      lang={lang} landingPath="/vincula-tu-linea" registerPath="/vincula-tu-linea/registro" />
            <Route path="/vincula-tu-linea/registro"  component={PhoneRegister} lang={lang} backTo="/vincula-tu-linea" />
            <Route path="/confirm-phone/:token"       component={PhoneConfirm} />
            <Route path="/login"                      component={LoginRoute} />
            <Route path="/dashboard"                  component={DashboardRoute} />

            <Route default component={NotFound} />
          </Router>
          <Footer />
        </PhoneRegistrationProvider>
      </LocationProvider>
    </div>
  )
}
