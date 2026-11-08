import { Outlet } from 'react-router';

export default function FinderLayout(){
  return(
    <main className="mx-auto min-h-dvh w-full max-w-md px-4 py-6">
      <Outlet />
    </main>
  )
}