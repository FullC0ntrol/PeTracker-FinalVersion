# PetTrace

Progresywna aplikacja webowa (PWA) do identyfikacji i lokalizacji zwierząt domowych za pomocą tagów NFC/QR.
Projekt realizowany w ramach pracy inżynierskiej.

## Jak to działa

Każde zwierzę ma tag NFC/QR z adresem `/t/<tagId>`. Aplikacja rozpoznaje, kto go zeskanował, i pokazuje odpowiedni widok:

- **znalazca** widzi profil zwierzęcia, może zadzwonić do właściciela lub wysłać swoją lokalizację,
- **właściciel** szybko zapisuje aktywność (karmienie, spacer),
- **weterynarz** dostaje tymczasowy link do paszportu medycznego.

Właściciel zarządza zwierzętami w panelu: profile, tryb zaginięcia z mapą zgłoszeń, spacery z GPS, harmonogram przypomnień.

## Stack

| Biblioteka | Do czego służy |
|---|---|
| React | budowa interfejsu z komponentów |
| Vite | dev server i budowanie wersji produkcyjnej |
| Tailwind CSS v4 | stylowanie klasami; tokeny kolorów w `@theme` w `src/index.css` |
| Fontsource | fonty Bricolage Grotesque i Plus Jakarta Sans lokalnie, bez Google Fonts |
| React Router v7 | routing po stronie klienta (SPA) |

Planowane: lucide-react, Leaflet, recharts, qrcode.react, vite-plugin-pwa.

## Uruchomienie

```bash
npm install       # instalacja zależności
npm run dev       # serwer deweloperski
npm run build     # wersja produkcyjna do dist/
```

## Struktura folderów

```
pettrace/
├── docs/
│   └── PLAN_PRZEPISYWANIA.md   # plan budowy etapami
├── public/                     # pliki statyczne (ikony PWA w przyszłości)
├── src/
│   ├── pages/
│   │   ├── public/             # strony publiczne: landing, 404
│   │   └── Placeholder.jsx     # tymczasowa strona dla tras jeszcze niezrobionych
│   ├── router.jsx              # definicja wszystkich tras
│   ├── main.jsx                # punkt wejścia: fonty, style, RouterProvider
│   └── index.css               # Tailwind, tokeny kolorów, style bazowe
├── index.html
└── vite.config.js
```

Docelowo dojdą: `components/` (layout, ui, pets, finder, map), `api/`, `mocks/`, `hooks/`, `context/`, `lib/`.

## Trasy

| Adres | Strona | Layout | Logowanie | Gotowe? |
|---|---|---|---|---|
| `/` | Strona główna | Public | nie | ✅ |
| `/login` | Logowanie | Public | nie | ❌ |
| `/login/sprawdz-poczte` | Sprawdź pocztę | Public | nie | ❌ |
| `/auth/verify` | Weryfikacja linku | Public | nie | ❌ |
| `/t/:tagId` | Strona tagu | Finder | nie | ❌ |
| `/t/:tagId/lokalizacja` | Udostępnij lokalizację | Finder | nie | ❌ |
| `/t/:tagId/wyslano` | Lokalizacja wysłana | Finder | nie | ❌ |
| `/vet/:shareToken` | Paszport medyczny | Vet | nie | ❌ |
| `/panel` | Panel właściciela | Owner | tak | ❌ |
| `/zwierzeta/nowe` | Nowe zwierzę | Owner | tak | ❌ |
| `/zwierzeta/:id` | Profil zwierzęcia | Owner | tak | ❌ |
| `/zwierzeta/:id/edytuj` | Edycja zwierzęcia | Owner | tak | ❌ |
| `/zwierzeta/:id/zaginiecie` | Tryb zaginięcia | Owner | tak | ❌ |
| `/zwierzeta/:id/vet-share` | Udostępnienie weterynarzowi | Owner | tak | ❌ |
| `/zwierzeta/:id/tag` | Zarządzanie tagiem | Owner | tak | ❌ |
| `/spacery` | Lista spacerów | Owner | tak | ❌ |
| `/spacery/nowy` | Spacer na żywo | Owner | tak | ❌ |
| `/spacery/:id` | Szczegóły spaceru | Owner | tak | ❌ |
| `/harmonogram` | Harmonogram | Owner | tak | ❌ |
| `/ustawienia` | Ustawienia | Owner | tak | ❌ |
| `*` | Strona 404 | Public | nie | ✅ |

## Architektura (planowana)

```
pages  →  components  →  hooks  →  api  →  mocks
```

Strony i komponenty pobierają dane wyłącznie przez `src/api/`. Na etapie frontendu `api/` korzysta z danych przykładowych w `localStorage` (`src/mocks/`), z symulowanym opóźnieniem. Później te same funkcje zostaną podpięte do prawdziwego backendu bez zmian w komponentach.

## Plan

| Część | Zakres | Stan |
|---|---|---|
| A. Fundamenty | Vite, Tailwind, routing, mapa tras | 🔄 |
| B. Layout | layouty, nawigacja desktop i mobilna | ☐ |
| C. Komponenty UI | przyciski, pola, modal, galeria `/dev/ui` | ☐ |
| D. Dane i logowanie | mock API, magic link, ochrona tras | ☐ |
| E. Panel właściciela | dashboard, profil, formularze | ☐ |
| F. Znalazca i mapa | routing kontekstowy tagu, geolokalizacja, tryb zaginięcia | ☐ |
| G. Spacery i harmonogram | śledzenie GPS, wykresy, przypomnienia | ☐ |
| H. Tag i weterynarz | kod QR, tymczasowe udostępnianie | ☐ |
| I. PWA i wykończenie | service worker, lazy loading, dostępność | ☐ |
