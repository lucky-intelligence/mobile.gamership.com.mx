import { useEffect } from 'preact/hooks'
import { motion, animate, useMotionValue, useMotionTemplate } from 'motion/react'
import type { ComponentChildren } from 'preact'

interface BorderBeamProps {
  children: ComponentChildren
  className?: string
  duration?: number
  colorFrom?: string
  colorTo?: string
}

export function BorderBeam({
  children,
  className = '',
  duration = 3,
  colorFrom = '#50fbd2',
  colorTo = '#5518c1',
}: BorderBeamProps) {
  const angle = useMotionValue(0)

  useEffect(() => {
    const animation = animate(angle, 360, {
      duration,
      repeat: Infinity,
      ease: 'linear',
    })
    return () => animation.stop()
  }, [duration])

  const background = useMotionTemplate`conic-gradient(
    from ${angle}deg at 50% 50%,
    rgba(85, 24, 193, 0.25)   0%,
    rgba(85, 24, 193, 0.25)  60%,
    ${colorFrom}             75%,
    #ffffff                  83%,
    ${colorTo}               90%,
    rgba(85, 24, 193, 0.25) 100%
  )`

  return (
    <div className={`relative p-[3px] rounded-[25px] overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-[25px]"
        style={{ background }}
      />
      <div className="relative z-10 rounded-[22px] bg-white overflow-hidden flex flex-col h-full">
        {children}
      </div>
    </div>
  )
}
