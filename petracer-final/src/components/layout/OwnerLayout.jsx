import { Outlet } from 'react-router'
import Logo from './Logo.jsx'

/*
  Układ panelu właściciela pod telefon: bez sidebara, dolnego paska i menu.
  U góry przyklejony nagłówek (logo, a od sesji 17 także kółko konta), pod nim jedna wąska
  kolumna — na komputerze ta sama, tylko wyśrodkowana. Cała nawigacja jest na ekranie
  zwierzęcia: przełącznik awatarów u góry i arkusz „Akcje” na dole (sesja 15b).
*/
export default function OwnerLayout() {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 bg-paper/85 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto max-w-2xl px-4">
          <div className="flex h-14 items-center justify-between">
            <Logo to="/panel" />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-4 pt-2 pb-32">
        <Outlet />
      </main>
    </div>
  )
}