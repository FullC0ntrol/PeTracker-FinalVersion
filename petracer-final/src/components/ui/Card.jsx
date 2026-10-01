import { cn } from '../../lib/cn'

const PADDINGS = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
}

export default function Card({ as:Component = 'div', padding = 'md', className = '', children, ...rest}) {
  return (
    <Component
      className={cn(
        'rounded-2xl bg-surface shadow-card',
        PADDINGS[padding],
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  )
}