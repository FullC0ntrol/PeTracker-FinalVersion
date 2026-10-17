import { PawPrint, Plus } from 'lucide-react'
import { getPets } from '../../api/pets.js'
import PageHeader from '../../components/layout/PageHeader.jsx'
import Button from '../../components/ui/Button.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import { useAsync } from '../../hooks/useAsync.js'
import PetCard from '../../components/pets/PetCard.jsx'


export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Cześć"
        description="Twoje zwierzęta i ostatnie skanowania zawieszek."
        action={
          <Button to="/zwierzeta/nowe" icon={Plus}>
            Dodaj zwierzę
          </Button>
        }
      />

      <section aria-labelledby="pets-heading">
        <h2 id="pets-heading" className="mb-3 text-lg font-semibold">
          Twoje zwierzęta
        </h2>
        <PetList />
      </section>
    </>
  )
}

function PetList() {
  const { data: pets, error, isLoading, reload } = useAsync(getPets, [])

  if (isLoading) return <Spinner showLabel label="Wczytuję zwierzęta…" />

  if (error) {
    return (
      <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-alert-soft p-4">
        <p className="font-medium text-alert">Nie udało się wczytać zwierząt. {error.message}</p>
        <Button variant="secondary" size="sm" onClick={reload}>
          Spróbuj ponownie
        </Button>
      </div>
    )
  }

  if (pets.length === 0) {
    return (
      <EmptyState
        icon={PawPrint}
        title="Nie masz jeszcze zwierząt"
        description="Dodaj pierwsze zwierzę, żeby zobaczyć je tutaj."
        action={
          <Button to="/zwierzeta/nowe" icon={Plus} size="sm">
            Dodaj zwierzę
          </Button>
        }
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} />
      ))}
    </div>
  )
}
