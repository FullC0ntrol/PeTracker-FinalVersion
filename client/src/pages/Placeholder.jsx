import { useParams } from 'react-router';
import PageHeader from '../components/layout/PageHeader';

export default function Placeholder({ title }) {
  const params = useParams();
  const entries = Object.entries(params)

  return (
    <div className="p-y">
      <PageHeader title={title} description="Ta strona jest jeszcze w budowie" />

      {entries.length > 0 && (
        <ul className="mt-4">
          {entries.map(([key, value]) => (
            <li key={key}>
              {key}: {value}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}