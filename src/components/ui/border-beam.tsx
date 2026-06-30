import type { ComponentChildren } from 'preact'

interface BorderBeamProps {
  children: ComponentChildren
  className?: string
  duration?: number
}

export function BorderBeam({ children, className = '', duration = 4 }: BorderBeamProps) {
  return (
    <div
      className={`border-beam-wrapper ${className}`}
      style={{ '--beam-duration': duration } as any}
    >
      <div className="border-beam-inner">{children}</div>
    </div>
  )
}
