import { cn } from '../../lib/cn'

const SIZES = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-10',
}

export default function Spinner({ size = 'md', label = 'Ładowanie...', showLabel = false, className = ''}) {
  return (
    <span role="status" className={cn('inline-flex items-center gap-2 text-ink-muted', className)}>
      <span className={cn('animate-spin rounded-full border-2 border-line border-t-pine', SIZES[size])} />
      <span className={showLabel ? 'text-sm' : 'sr-only'}>{label}</span>
    </span>
  )
}