import { motion } from 'motion/react'
import { Navbar, Footer, RegisterBanner } from './app'

type Recarga = {
  gb: string
  price: string
}

const RECARGAS: Recarga[] = [
  { gb: '2GB', price: '79.00' },
  { gb: '4GB', price: '149.00' },
  { gb: '5GB', price: '179.00' },
]

function RecargaCard({ recarga, index }: { recarga: Recarga; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="transition-all duration-200 hover:-translate-y-1"
    >
      <div className="relative rounded-[25px] overflow-hidden flex flex-col bg-white border border-[#e5e5f2] hover:shadow-xl h-full">
        <div className="px-6 pt-8 pb-6 bg-[#5518c1] rounded-t-[25px] text-center" style={{ fontFamily: 'var(--font-rubik)' }}>
          <p className="text-[14px] font-semibold uppercase tracking-widest text-[#ffffff99]">Recarga</p>
          <h3 className="text-[42px] font-extrabold text-white leading-tight">{recarga.gb}</h3>
        </div>

        <div className="flex-1 px-6 py-8 text-center space-y-2" style={{ fontFamily: 'var(--font-rubik)' }}>
          <p className="text-[15px] font-bold uppercase tracking-wide text-[#5518c1]">Loot {recarga.gb}</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-[36px] font-extrabold text-[#00010a]">${recarga.price}</span>
            <span className="text-[14px] font-medium text-[#666]">MXN</span>
          </div>
          <p className="text-[13px] text-[#666]">Vigencia 30 días</p>
        </div>

        <div className="px-6 py-6 bg-[#50fbd2] text-center">
          <a
            href="/dashboard"
            className="block w-full text-center rounded-full bg-[#5518c1] py-4 text-[13px] font-medium uppercase text-white transition-all duration-200 hover:bg-[#8224e3] hover:scale-[1.02] active:scale-[0.98]"
            style={{ fontFamily: 'var(--font-rubik)' }}
          >
            Comprar Ahora
          </a>
        </div>
      </div>
    </motion.div>
  )
}

function RecargasSection() {
  return (
    <section className="bg-white py-20" style={{ fontFamily: 'var(--font-manrope)' }}>
      <div className="mx-auto max-w-[1280px] px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[40px] md:text-[55px] font-bold text-[#5518c1] text-center mb-12"
          style={{ fontFamily: 'var(--font-rubik)' }}
        >
          Recargas
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-[900px] mx-auto">
          {RECARGAS.map((recarga, i) => (
            <RecargaCard key={recarga.gb} recarga={recarga} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function RecargasPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FD]" style={{ fontFamily: 'var(--font-manrope)' }}>
      <RegisterBanner />
      <Navbar />
      <main>
        <RecargasSection />
      </main>
      <Footer />
    </div>
  )
}
