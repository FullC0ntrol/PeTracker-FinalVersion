import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Pencil, Plus, QrCode, Siren } from 'lucide-react'
import { getPetById } from '../../api/pets.js'
import PetActionsSheet from '../../components/pets/PetActionsSheet.jsx'
import PetAvatar from '../../components/pets/PetAvatar.jsx'
import PetSwitcher from '../../components/pets/PetSwitcher.jsx'
import ErrorState from '../../components/ui/ErrorState.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import { useAsync } from '../../hooks/useAsync.js'
import { cn } from '../../lib/cn.js'
import { formatAge, speciesLabel } from '../../lib/format.js'
import { setLastPetId } from '../../lib/lastPet.js'

/*
  Ekran skupiony na JEDNYM zwierzęciu — główny ekran panelu.
  Od góry: przełącznik zwierząt i duża karta zwierzęcia (później dojdą tryb zaginięcia, zakładki
  i skanowania). Cała nawigacja jest w arkuszu pod pływającym przyciskiem „Akcje”.
*/
export default function PetProfilePage() {
  const { id } = useParams()
  const { data: pet, error, isLoading, reload } = useAsync(() => getPetById(id), [id])
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Zapamiętujemy oglądane zwierzę — następne wejście na /panel otworzy właśnie je.
  useEffect(() => {
    setLastPetId(id)
  }, [id])

  return (
    <div className="space-y-4">
      <PetSwitcher activeId={id} current={pet} />

      {isLoading ? (
        <Spinner showLabel label="Wczytuję profil…" />
      ) : error ? (
        <ErrorState title="Nie udało się wczytać profilu" error={error} onRetry={reload} />
      ) : (
        <>
          <PetHero pet={pet} />

          <button
            type="button"
            onClick={() => setIsSheetOpen(true)}
            className="mx-auto block text-sm font-semibold text-ink-muted underline-offset-4 hover:underline"
          >
            Więcej akcji: spacer, harmonogram, weterynarz, zawieszka…
          </button>

          <ActionsButton pet={pet} isOpen={isSheetOpen} onClick={() => setIsSheetOpen(true)} />
          <PetActionsSheet open={isSheetOpen} onClose={() => setIsSheetOpen(false)} pet={pet} />
        </>
      )}
    </div>
  )
}

// Duża karta u góry: zielona, a przy zaginięciu czerwona — stan widać zanim cokolwiek przeczytasz.
function PetHero({ pet }) {
  const details = [speciesLabel(pet.species), pet.breed, formatAge(pet.birthDate)].filter(Boolean).join(' · ')
  const chip = 'inline-flex items-center gap-1.5 rounded-full bg-paper/20 px-3 py-1.5 transition-colors hover:bg-paper/30'

  return (
    <section
      aria-label={`Karta: ${pet.name}`}
      className={cn(
        'relative overflow-hidden rounded-3xl p-5 text-paper shadow-raised',
        pet.isLost ? 'bg-alert' : 'bg-pine',
      )}
    >
      {/* Dekoracyjne koła w tle — czysty CSS, bez grafik. */}
      <span aria-hidden="true" className="absolute -top-16 -right-12 size-48 rounded-full bg-paper/10" />
      <span aria-hidden="true" className="absolute -bottom-20 left-20 size-40 rounded-full bg-paper/10" />

      <div className="relative flex items-center gap-4">
        <PetAvatar name={pet.name} species={pet.species} size="lg" className="ring-4 ring-paper/40" />
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-paper/20 px-2.5 py-0.5 text-xs font-bold">
            {pet.isLost ? <Siren size={14} aria-hidden="true" /> : null}
            {pet.isLost ? 'Zaginione' : 'Bezpieczne w domu'}
          </p>
          <h1 className="mt-1.5 truncate text-3xl font-extrabold tracking-tight sm:text-4xl">{pet.name}</h1>
          <p className="truncate text-sm opacity-85">{details}</p>
        </div>
      </div>

      <div className="relative mt-4 flex flex-wrap gap-2 text-sm font-semibold">
        <Link to={`/zwierzeta/${pet.id}/tag`} className={chip}>
          <QrCode size={16} aria-hidden="true" />
          {pet.tagCode ? <span className="font-mono">{pet.tagCode}</span> : 'Bez zawieszki'}
        </Link>
        <Link to={`/zwierzeta/${pet.id}/edytuj`} className={chip}>
          <Pencil size={16} aria-hidden="true" />
          Edytuj
        </Link>
      </div>
    </section>
  )
}

// Pływający przycisk na dole, na środku — w zasięgu kciuka. Kółko ma kolor zwierzęcia,
// a „+” obraca się w „×”, gdy arkusz jest otwarty.
function ActionsButton({ pet, isOpen, onClick }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-30 flex justify-center px-4">
      <button
        type="button"
        onClick={onClick}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="pointer-events-auto inline-flex min-h-15 animate-pop items-center gap-3 rounded-full bg-ink py-2 pr-7 pl-2 font-display text-lg font-bold text-paper shadow-raised transition-transform active:scale-95"
      >
        <span
          className={cn(
            'grid size-11 place-items-center rounded-full text-paper transition-transform duration-300',
            pet.isLost ? 'bg-alert' : 'bg-pine',
            isOpen && 'rotate-45',
          )}
        >
          <Plus size={24} strokeWidth={2.5} aria-hidden="true" />
        </span>
        Akcje
      </button>
    </div>
  )
}