import { cn } from "../../lib/cn";

const TONES = {
  neutral: "bg-line/70 text-ink",
  pine: "bg-pine-soft text-pine",
  ember: "bg-ember-soft text-ink",
  alert: "bg-alert-soft text-alert",
  sky: "bg-sky/15 text-ink",
  amber: "bg-amber/15 text-ink",
};

const SIZES = {
  sm: 'px-2.5 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
}

export default function Badge({ tone = 'neutral', size = 'md', icon: Icon, className = '', children}) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full font-semibold', TONES[tone], SIZES[size], className)}>
      {Icon && <Icon size={size === 'sm' ? 12 : 16} />}
      {children}
    </span>
  )
}