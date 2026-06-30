import { useCallback, useEffect, useRef } from 'preact/hooks'
import { motion, useMotionTemplate, useMotionValue } from 'motion/react'

interface MagicCardProps {
  children: preact.ComponentChildren
  className?: string
  gradientSize?: number
  gradientColor?: string
  gradientOpacity?: number
}

export function MagicCard({
  children,
  className = '',
  gradientSize = 200,
  gradientColor = '#5518c120',
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(-gradientSize)
  const mouseY = useMotionValue(-gradientSize)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (cardRef.current) {
        const { left, top } = cardRef.current.getBoundingClientRect()
        mouseX.set(e.clientX - left)
        mouseY.set(e.clientY - top)
      }
    },
    [mouseX, mouseY],
  )

  const handleMouseEnter = useCallback(() => {
    document.addEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  const handleMouseLeave = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    mouseX.set(-gradientSize)
    mouseY.set(-gradientSize)
  }, [handleMouseMove, mouseX, mouseY, gradientSize])

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])

  const background = useMotionTemplate`radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)`

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <motion.div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{ background }}
      />
    </div>
  )
}
