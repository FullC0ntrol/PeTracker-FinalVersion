import { useParams } from 'react-router';

export default function Placeholder({ title }) {
  const params = useParams();
  const entries = Object.entries(params)
  return (
    <main className="p-y">
      <h1 className="text-2xl font-bold text-pine">{title}</h1>
      <p className="mt-2 text-ink-muted">Ta strona jest jeszcze w budowie.</p>

      {entries.length > 0 && (
        <ul className="mt-4">
          {entries.map(([key, value]) => (
            <li key={key}>
              {key}: {value}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}