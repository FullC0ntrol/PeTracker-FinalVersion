import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import Logo from './Logo'

export default function OwnerLayout() {
  return (
    <div className="min-h-dvh lg:flex">
      <Sidebar />

      <div className="flex-1">
        <header className="sticky top-0 z-20 border-b border-line bg-paper/90 px-4 py-3 backdrop-blur lg:hidden">
          <Logo to="/panel" />
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 pt-6 pb-32 sm:px-6 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}