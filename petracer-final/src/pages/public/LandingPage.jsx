import { Link } from 'react-router';

import Badge from "../../components/ui/Badge";

export default function LandingPage () {
  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 md:grid-cols-2">
        <div className="space-y-5">
          <Badge tone="pine" size="md">
            Tag NFC / QR na obroży
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Zgubione zwierzę wraca do domu szybciej
          </h1>
          <p className="text-lg text-ink-muted">
            Znalazca przykłada telefon do tagu i od razu widzi, jak się z Tobą skontaktować - bez instalowania aplikacji.
            Ty masz w jednym miejscu spacery, szczepienia i leki.
          </p>
          <Link
            to="/login"
            className='inline-flex min-h-12 items-center rounded-xl bg-ember px-6 font-semibold text-ink shadow-card transition-colors hover:bg-ember/90'
          >
            Zaloguj się
          </Link>
        </div>
      </section>
    </div>
  )
}
