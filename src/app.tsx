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
  accountUI,
} from '@lucky-intelligence/account-ui'
import { BorderBeam } from '@/components/ui/border-beam'
import tycMd from '@/assets/tyc.md?raw'
import apMd from '@/assets/ap.md?raw'
import './i18n'

configureAccountCore({
  apiUrl: import.meta.env.VITE_API_URL,
  stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
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
    featured: true,
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
    { key: 'recharges', href: '/recargas/' },
    { key: 'faq', href: '/explore' },
    { key: 'portability', href: '/telefonia/portabilidad/' },
    { key: 'activateSim', href: '#' },
    { key: 'helpCenter', href: '#' },
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
            href="/dashboard"
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
            href="/dashboard"
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
      className={`transition-all duration-200 hover:-translate-y-1 ${isEpic ? 'rounded-[25px] hover:shadow-xl' : 'relative rounded-[25px] overflow-hidden flex flex-col bg-white hover:shadow-xl'}`}
    >
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
              <span className="text-[48px] font-semibold leading-none">129</span>
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
          <p>
            {t('plans.note1')} <strong>{t('plans.note1Mobility')}</strong>
          </p>
          <p>{t('plans.note2')}</p>
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================================
   BENEFITS SECTION
   ============================================================ */
const BENEFITS = [
  { img: '/gm-site/streaming.png', key: 'community' },
  { img: '/gm-site/like.png', key: 'social' },
  { img: '/gm-site/gaming.svg', key: 'gaming' },
] as const

function BenefitsSection() {
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
          {t('benefits.title')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BENEFITS.map((b, i) => {
            const title = t(`benefits.${b.key}.title`)
            return (
              <motion.div
                key={b.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center space-y-4 group cursor-default"
              >
                <div className="flex justify-center">
                  <img
                    src={b.img}
                    alt={title}
                    width={160}
                    height={120}
                    className="w-[140px] h-[110px] object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-[18px] font-bold text-[#00010a]" style={{ fontFamily: 'var(--font-rubik)' }}>{title}</h3>
                <p className="text-[14px] text-[#555] leading-relaxed">{t(`benefits.${b.key}.desc`)}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
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
            {t('banner.text')}
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
        <Dashboard />
      </Authenticated>
    </GlobalProvider>
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
      <PlansSection />
      <BenefitsSection />
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
            <Route path="/recargas" component={LandingPage} />
            <Route path="/portabilidad" component={LandingPage} />
            <Route path="/atencion" component={LandingPage} />

            {/* Account / registration flows (public) — shared account-ui. */}
            <Route path="/vincula-tu-linea"           component={CrtLanding}    lang={lang} registerPath="/vincula-tu-linea/registro" checkPath="/vincula-tu-linea/consultar" termsDoc={tycMd} privacyDoc={apMd} />
            <Route path="/vincula-tu-linea/consultar" component={CrtCheck}      lang={lang} landingPath="/vincula-tu-linea" registerPath="/vincula-tu-linea/registro" />
            <Route path="/vincula-tu-linea/registro"  component={PhoneRegister} lang={lang} backTo="/vincula-tu-linea" />
            <Route path="/confirm-phone/:token"       component={PhoneConfirm} />
            <Route path="/dashboard"                  component={DashboardRoute} />

            <Route default component={NotFound} />
          </Router>
          <Footer />
        </PhoneRegistrationProvider>
      </LocationProvider>
    </div>
  )
}
