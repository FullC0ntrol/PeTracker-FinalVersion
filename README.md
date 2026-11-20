<div align="center">

# 🐾 PeTrace

**System lokalizacji, identyfikacji i zarządzania aktywnością zwierząt domowych<br/>oparty na zawieszkach NFC / QR i aplikacji webowej PWA z routingiem kontekstowym**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

Praca inżynierska · kierunek Informatyka<br/>
Wyższa Szkoła Turystyki i Ekologii w Suchej Beskidzkiej · 2026/2027<br/>
Autor: **Maciej Strączek**

</div>

---

## Spis treści

1. [Problem i cel projektu](#1-problem-i-cel-projektu)
2. [Zasada działania](#2-zasada-działania)
3. [Routing kontekstowy](#3-routing-kontekstowy)
4. [Architektura systemu](#4-architektura-systemu)
5. [Model danych](#5-model-danych)
6. [API](#6-api)
7. [Uwierzytelnianie i bezpieczeństwo](#7-uwierzytelnianie-i-bezpieczeństwo)
8. [Aplikacja kliencka](#8-aplikacja-kliencka)
9. [Technologie](#9-technologie)
10. [Uruchomienie](#10-uruchomienie)
11. [Struktura repozytorium](#11-struktura-repozytorium)
12. [Stan realizacji](#12-stan-realizacji)
13. [Dokumentacja](#13-dokumentacja)

---

## 1. Problem i cel projektu

Zagubione zwierzę najczęściej znajduje przypadkowa osoba. Istniejące metody identyfikacji mają istotne ograniczenia:

| Metoda | Ograniczenie |
|---|---|
| Adresówka z numerem telefonu | ulega zatarciu, dane szybko się dezaktualizują, brak kontekstu (choroby, leki) |
| Mikroczip | wymaga czytnika, którego znalazca nie posiada — odczyt możliwy dopiero u weterynarza lub w schronisku |
| Aplikacje mobilne / lokalizatory GPS | wymagają instalacji aplikacji przez obcą osobę lub abonamentu i ładowania baterii |

**Cel:** zaprojektowanie i implementacja systemu, w którym znalazca **bez instalowania czegokolwiek** — samym zbliżeniem telefonu (NFC) lub zeskanowaniem aparatem (QR) — otrzymuje informacje potrzebne do pomocy zwierzęciu i kontaktu z opiekunem, a właściciel zyskuje narzędzie do codziennej ewidencji opieki.

### Wymagania niefunkcjonalne

| Wymaganie | Realizacja |
|---|---|
| Brak instalacji po stronie znalazcy | standardowy adres URL otwierany w przeglądarce, obsługa NFC i QR natywnie przez system telefonu |
| Prywatność | dane osobowe właściciela ujawniane wyłącznie w trybie zaginięcia; lokalizacja znalazcy nie jest zapisywana na serwerze |
| Bezpieczeństwo | PIN przechowywany jako skrót `scrypt` z solą, sesja w ciasteczku `httpOnly`, limity prób logowania |
| Dostępność mobilna | interfejs *mobile-first*, duże elementy dotykowe, obsługa klawiatury i atrybutów `aria-*` |
| Instalowalność | aplikacja PWA (manifest, service worker) dla właściciela |
| Przenośność wdrożenia | konteneryzacja Docker Compose, jedna domena z automatycznym HTTPS |

---

## 2. Zasada działania

Na zawieszce znajduje się **tag NFC** (rekord NDEF typu URI) oraz **kod QR** kodujące ten sam unikalny adres:

```
https://petracker.pl/t/K7Q2-M9XD
                       └──┬────┘
          kod zawieszki: 8 znaków [A-Z0-9], format XXXX-XXXX
```

```mermaid
flowchart LR
    subgraph P["Warstwa fizyczna"]
        T["🏷️ Zawieszka<br/>NFC + QR"]
    end
    subgraph U["Urządzenie skanujące"]
        S["📱 Smartfon<br/>(dowolny, bez aplikacji)"]
    end
    subgraph L["Warstwa logiczna"]
        W["🌐 Aplikacja PWA"]
        A["⚙️ API + routing kontekstowy"]
        D[("🗄️ PostgreSQL")]
    end
    T -- "zbliżenie / skan aparatem" --> S
    S -- "GET /t/:kod" --> W
    W -- "GET /api/tags/:kod" --> A
    A <--> D
    A -- "wariant widoku + dozwolone dane" --> W
```

Kod zawieszki nie zawiera żadnych danych o zwierzęciu ani właścicielu — jest jedynie identyfikatorem. Dzięki temu zmiana danych, włączenie trybu zaginięcia czy wymiana zawieszki **nie wymagają ponownego zapisu tagu NFC**.

---

## 3. Routing kontekstowy

Kluczowym elementem systemu jest **routing kontekstowy**: jeden i ten sam adres `/t/:kod` prowadzi do różnych widoków zależnie od tego, *kto* skanuje i *w jakim stanie* jest zwierzę. Decyzję podejmuje **serwer**, a przeglądarka otrzymuje wyłącznie dane przewidziane dla danego wariantu.

```mermaid
flowchart TD
    S(["Skan zawieszki<br/>/t/:kod"]) --> A{"Tag istnieje,<br/>jest aktywny<br/>i przypisany?"}
    A -- nie --> V1["❌ <b>Tag nieaktywny</b><br/>informacja bez danych"]
    A -- tak --> B{"Skanuje zalogowany<br/>właściciel zwierzęcia?"}
    B -- tak --> V2["✅ <b>Widok właściciela</b><br/>szybki zapis: karmienie / spacer"]
    B -- nie --> C{"Zwierzę oznaczone<br/>jako zaginione?"}
    C -- tak --> V3["🚨 <b>Widok alarmowy</b><br/>komunikat opiekuna, telefon,<br/>SMS z lokalizacją znalazcy"]
    C -- nie --> V4["ℹ️ <b>Widok znalazcy</b><br/>imię, uwagi medyczne,<br/>przycisk „Zadzwoń”"]
    V2 & V3 & V4 --> L[("zapis do<br/>tag_scans")]
```

| Wariant | Warunek | Dane zwracane przez API | Akcje |
|---|---|---|---|
| Tag nieaktywny | brak tagu, `is_active = false` lub brak przypisanego zwierzęcia | brak | — |
| Właściciel | ważna sesja i `pets.owner_id = user.id` | profil zwierzęcia | zapis aktywności |
| Zaginione | `pets.is_lost = true` | imię, uwagi medyczne, komunikat, telefon opiekuna | połączenie, SMS z lokalizacją |
| Znalazca | pozostałe przypadki | imię, uwagi medyczne | połączenie |

**Kolejność warunków ma znaczenie:** sprawdzenie „właściciel” następuje przed „zaginione”, aby opiekun, który odnalazł swoje zwierzę, nie zobaczył alarmu przeznaczonego dla znalazców.

### Przebieg skanowania

```mermaid
sequenceDiagram
    autonumber
    actor Z as Znalazca
    participant B as Przeglądarka (PWA)
    participant A as API (Express)
    participant D as PostgreSQL
    Z->>B: zbliża telefon do zawieszki
    B->>A: GET /api/tags/K7Q2-M9XD (+ ciasteczko, jeśli jest)
    A->>D: SELECT tag + zwierzę + właściciel
    D-->>A: wiersz
    A->>A: wybór wariantu (routing kontekstowy)
    A->>D: INSERT INTO tag_scans
    A-->>B: { variant: "lost", pet, contact }
    B-->>Z: widok alarmowy
    Z->>B: „Wyślij moją lokalizację”
    B->>B: Geolocation API
    B-->>Z: otwarcie aplikacji SMS (sms:) z linkiem do mapy
    Note over B,A: lokalizacja nie trafia na serwer
```

### Stan zwierzęcia

```mermaid
stateDiagram-v2
    [*] --> Bezpieczne
    Bezpieczne --> Zaginione: właściciel włącza tryb zaginięcia
    Zaginione --> Bezpieczne: właściciel wyłącza tryb zaginięcia
```

---

## 4. Architektura systemu

System działa w architekturze klient–serwer pod **jedną domeną**. Reverse proxy serwuje pliki statyczne aplikacji i przekazuje ścieżki `/api/*` do serwera aplikacyjnego. Eliminuje to problem CORS i pozwala bezpiecznie używać ciasteczka sesyjnego `httpOnly` + `SameSite=Lax`.

```mermaid
flowchart LR
    subgraph Client["Klient"]
        PWA["React SPA / PWA<br/>service worker"]
    end
    subgraph VPS["Serwer VPS · Docker Compose"]
        C["Caddy<br/>reverse proxy<br/>automatyczny HTTPS"]
        F["Frontend<br/>(pliki statyczne)"]
        API["API<br/>Node.js + Express"]
        DB[("PostgreSQL")]
    end
    PWA -- "HTTPS :443" --> C
    C -- "/*" --> F
    C -- "/api/*" --> API
    API -- "pg (pula połączeń)" --> DB
```

### Warstwy serwera

```mermaid
flowchart TD
    R["HTTP request"] --> M1["express.json (limit 20 kB)<br/>cookie-parser"]
    M1 --> M2["middleware tras:<br/>rateLimit · loadUser / requireAuth"]
    M2 --> RT["routes/*<br/>walidacja (validation.js)"]
    RT --> SV["services/*<br/>pin.js · session.js"]
    RT --> DBL["db.js<br/>zapytania SQL z parametrami"]
    DBL --> PG[("PostgreSQL")]
    RT --> MP["mappers.js<br/>snake_case → camelCase"]
    MP --> RES["JSON response"]
    RT -. "throw HttpError" .-> EH["errorHandler<br/>jednolity format błędu"]
    EH --> RES
```

Zastosowane zasady:

- **SQL bez ORM-a** — zapytania parametryzowane (`$1, $2…`), pełna kontrola nad schematem i indeksami.
- **Jednolita obsługa błędów** — trasy rzucają `HttpError(status, komunikat)`, a `errorHandler` zamienia go na `{ "error": "…" }`. Szczegóły błędów 500 trafiają wyłącznie do logów.
- **Rozdzielenie `app.js` i `index.js`** — aplikację Express można utworzyć bez nasłuchiwania na porcie (testy).
- **Konfiguracja przez zmienne środowiskowe** — w trybie produkcyjnym brak wymaganej zmiennej zatrzymuje start serwera.

---

## 5. Model danych

```mermaid
erDiagram
    users ||--o{ pets : "posiada"
    pets  ||--o{ tags : "ma przypisane"
    tags  ||--o{ tag_scans : "rejestruje"
    pets  ||--o{ activities : "ma"

    users {
        uuid id PK
        text email UK
        text name
        text phone
        text pin_hash "sól:skrót scrypt"
        timestamptz created_at
    }
    pets {
        uuid id PK
        uuid owner_id FK
        text name
        text species "dog | cat | other"
        text breed
        date birth_date
        numeric weight_kg
        text medical_notes
        boolean is_lost
        text lost_message
        timestamptz created_at
    }
    tags {
        text code PK "XXXX-XXXX"
        uuid pet_id FK
        boolean is_active
        timestamptz created_at
    }
    tag_scans {
        uuid id PK
        text tag_code FK
        timestamptz scanned_at
        text user_agent
        boolean by_owner
    }
    activities {
        uuid id PK
        uuid pet_id FK
        text type "feeding | walk"
        timestamptz occurred_at
    }
```

Integralność danych jest wymuszana na poziomie bazy:

| Ograniczenie | Cel |
|---|---|
| `CHECK (code ~ '^[A-Z0-9]{4}-[A-Z0-9]{4}$')` | poprawny format kodu zawieszki |
| `UNIQUE INDEX … ON tags (pet_id) WHERE is_active` | co najwyżej **jedna aktywna** zawieszka na zwierzę (indeks częściowy) |
| `ON DELETE CASCADE` (`pets`, `activities`, `tag_scans`) | usunięcie konta lub zwierzęcia usuwa dane zależne |
| `ON DELETE SET NULL` (`tags.pet_id`) | fizyczna zawieszka pozostaje w systemie po usunięciu zwierzęcia |
| `CHECK` na `species`, `type`, `weight_kg > 0`, niepuste `name` | poprawność wartości domenowych |
| indeksy `(tag_code, scanned_at DESC)`, `(pet_id, occurred_at DESC)` | szybkie pobieranie historii od najnowszych |

Pełny schemat: [`server/sql/001_init.sql`](server/sql/001_init.sql).

---

## 6. API

Wszystkie adresy mają prefiks `/api`, a odpowiedzi są w formacie JSON. Błąd ma zawsze postać `{ "error": "komunikat" }`.
🔒 — wymaga zalogowania.

| Metoda | Adres | Opis | Stan |
|---|---|---|---|
| GET | `/health` | kontrola działania serwera | ✅ |
| POST | `/auth/register` | rejestracja (e-mail, imię, PIN), ustawia sesję | ✅ |
| POST | `/auth/login` | logowanie e-mailem i PIN-em, ustawia sesję | ✅ |
| GET | `/auth/me` | bieżący użytkownik albo `{ "user": null }` | ✅ |
| POST | `/auth/logout` | usunięcie ciasteczka sesji | ✅ |
| PATCH | `/me` 🔒 | zmiana imienia i telefonu kontaktowego | ⏳ |
| GET / POST | `/pets` 🔒 | lista zwierząt właściciela / dodanie zwierzęcia | ⏳ |
| GET / PATCH | `/pets/:id` 🔒 | szczegóły / edycja | ⏳ |
| PATCH | `/pets/:id/lost` 🔒 | włączenie / wyłączenie trybu zaginięcia | ⏳ |
| POST | `/pets/:id/tag` 🔒 | wygenerowanie kodu zawieszki | ⏳ |
| GET | `/pets/:id/scans` 🔒 | historia skanowań | ⏳ |
| GET | `/tags/:code` | **publiczny** — routing kontekstowy, zapis skanu | ⏳ |
| GET / POST | `/pets/:id/activities` 🔒 | lista z 7 dni / szybki zapis aktywności | ⏳ |

Kody odpowiedzi:

| Kod | Znaczenie |
|---|---|
| `200` / `201` / `204` | sukces / utworzono zasób / brak treści |
| `400` | niepoprawne dane wejściowe lub format JSON |
| `401` | błędny e-mail lub PIN |
| `409` | konto z tym adresem już istnieje |
| `413` | zbyt duże żądanie (limit 20 kB) |
| `429` | przekroczony limit prób (nagłówek `Retry-After`) |
| `500` | błąd serwera (bez ujawniania szczegółów) |

---

## 7. Uwierzytelnianie i bezpieczeństwo

Właściciel loguje się adresem e-mail i **6-cyfrowym PIN-em**. Sesja to podpisany token **JWT** (ważny 30 dni) przechowywany w ciasteczku — serwer nie musi utrzymywać tabeli sesji.

```mermaid
sequenceDiagram
    autonumber
    actor W as Właściciel
    participant B as Przeglądarka
    participant RL as rateLimit
    participant A as /api/auth/login
    participant D as PostgreSQL
    W->>B: e-mail + PIN
    B->>RL: POST /api/auth/login
    RL->>RL: limit na IP (20 / 15 min)<br/>limit na e-mail (5 / 15 min)
    alt przekroczony limit
        RL-->>B: 429 + Retry-After
    else w limicie
        RL->>A: dalej
        A->>D: SELECT … WHERE email = $1
        D-->>A: użytkownik lub brak
        A->>A: scrypt(PIN, sól) i timingSafeEqual<br/>(skrót-atrapa, gdy konta brak)
        alt poprawne dane
            A-->>B: 200 { user } + Set-Cookie: petrace_session (JWT)
        else błędne dane
            A-->>B: 401 „Nieprawidłowy e-mail lub PIN.”
        end
    end
```

| Zagrożenie | Zabezpieczenie |
|---|---|
| Wyciek bazy danych | PIN zapisany jako `sól:skrót` funkcją **scrypt** (celowo kosztowna obliczeniowo), losowa 16-bajtowa sól na konto |
| Zgadywanie PIN-u (brute force) | podwójny limit prób: na adres IP oraz na znormalizowany e-mail (odporny na zmianę IP) |
| Enumeracja kont | ten sam komunikat dla złego e-maila i złego PIN-u; porównanie ze **skrótem-atrapą**, aby czas odpowiedzi był jednakowy |
| Ataki czasowe | porównanie skrótów funkcją `crypto.timingSafeEqual` |
| Kradzież sesji przez XSS | ciasteczko `httpOnly` — niedostępne dla JavaScriptu |
| CSRF | `SameSite=Lax` + jedna domena dla frontendu i API |
| Przechwycenie ruchu | `Secure` w produkcji, HTTPS przez Caddy |
| SQL injection | wyłącznie zapytania parametryzowane |
| Wyścig przy rejestracji | `INSERT … ON CONFLICT (email) DO NOTHING` |
| Duże / złośliwe żądania | limit treści 20 kB, walidacja typów i długości pól |
| Ujawnienie danych znalazcy | lokalizacja przekazywana bezpośrednio do SMS-a, bez zapisu w systemie |

---

## 8. Aplikacja kliencka

Aplikacja SPA w React z zagnieżdżonym routingiem (React Router v7) i trzema układami stron dopasowanymi do typu użytkownika.

```mermaid
flowchart LR
    P["pages/<br/>jedna strona na trasę"] --> C["components/<br/>layout · ui · pets"]
    P --> H["hooks/<br/>useAsync"]
    H --> API["api/<br/>fasada danych"]
    API --> F["fetch /api/*"]
    API -. "etap prototypu" .-> M["api/mock/<br/>localStorage"]
```

Warstwa `api/` jest **jedynym miejscem, które wie, skąd pochodzą dane**. Strony importują funkcje wyłącznie z `api/*.js`, więc przejście z prototypu (dane w `localStorage`) na prawdziwy serwer nie wymaga zmian w komponentach.

### Trasy

| Adres | Widok | Układ | Dostęp | Stan |
|---|---|---|---|---|
| `/` | strona główna | Public | publiczny | ✅ |
| `/login` | logowanie e-mail + PIN | Public | publiczny | 🔄 |
| `/rejestracja` | zakładanie konta | Public | publiczny | ⏳ |
| `/t/:tagId` | **strona zawieszki** (routing kontekstowy) | Finder | publiczny | ⏳ |
| `/t/:tagId/lokalizacja` | wysłanie lokalizacji SMS-em | Finder | publiczny | ⏳ |
| `/panel` | ostatnio oglądane zwierzę lub pusty stan | Owner | 🔒 | 🔄 |
| `/zwierzeta/nowe` | dodanie zwierzęcia | Owner | 🔒 | ⏳ |
| `/zwierzeta/:id` | profil: dane, zdrowie, aktywność, tryb zaginięcia | Owner | 🔒 | 🔄 |
| `/zwierzeta/:id/edytuj` | edycja | Owner | 🔒 | ⏳ |
| `/zwierzeta/:id/tag` | zawieszka, kod QR, historia skanowań | Owner | 🔒 | ⏳ |
| `/ustawienia` | dane kontaktowe, wylogowanie | Owner | 🔒 | ⏳ |
| `*` | 404 | Public | publiczny | ✅ |

### System projektowy

- **Tokeny** kolorów, fontów i cieni zdefiniowane w `@theme` (Tailwind CSS v4) w `client/src/index.css` — komponenty nie używają wartości „na sztywno”.
- **Biblioteka komponentów UI:** `Button`, `Card`, `Badge`, `Input`, `Textarea`, `Select`, `Toggle`, `Tabs`, `Modal`, `Sheet`, `Spinner`, `EmptyState`, `ErrorState`.
- **Trzy stany danych** na każdej stronie: ładowanie, błąd, brak danych.
- **Fonty lokalne** (Fontsource) — bez zależności od Google Fonts.

---

## 9. Technologie

| Warstwa | Technologia | Uzasadnienie |
|---|---|---|
| Interfejs | React 19, Vite 8 | komponentowy model UI, szybki serwer deweloperski i build |
| Routing | React Router 7 | zagnieżdżone trasy i układy |
| Style | Tailwind CSS 4 | tokeny projektowe, spójność i mały rozmiar CSS |
| Ikony | lucide-react | lekkie ikony SVG |
| PWA | vite-plugin-pwa | manifest i service worker |
| Kod QR / mapa | qrcode.react, Leaflet + OpenStreetMap | generowanie QR do druku; mapa bez kluczy API |
| Serwer | Node.js 22, Express 5 | natywna obsługa błędów `async`, ten sam język co frontend |
| Baza danych | PostgreSQL 17, `pg` | relacyjny model, ograniczenia integralności, indeksy częściowe |
| Bezpieczeństwo | `node:crypto` (scrypt), jsonwebtoken, cookie-parser | brak zależności natywnych, sprawdzone prymitywy |
| Wdrożenie | Docker Compose, Caddy, nginx | powtarzalne środowisko, automatyczne certyfikaty TLS |
| Jakość kodu | ESLint, Prettier, EditorConfig | jednolity styl i statyczna analiza |

Uzasadnienia decyzji projektowych: [`plan/05-decyzje.md`](plan/05-decyzje.md).

---

## 10. Uruchomienie

**Wymagania:** Node.js 20.19+ lub 22.12+, Docker (dla bazy danych).

```bash
# 1. Baza danych PostgreSQL w kontenerze (schemat ładuje się przy pierwszym starcie)
docker compose -f docker-compose.dev.yml up -d

# 2. Serwer API  →  http://localhost:3000
cd server
cp .env.example .env
npm install
npm run dev

# 3. Aplikacja kliencka  →  http://localhost:5173  (proxy /api → :3000)
cd client
npm install
npm run dev
```

| Polecenie | `client/` | `server/` |
|---|---|---|
| `npm run dev` | serwer deweloperski Vite | serwer z automatycznym restartem |
| `npm run build` | wersja produkcyjna do `dist/` | — |
| `npm start` | — | uruchomienie produkcyjne |
| `npm run lint` | ESLint | ESLint |
| `npm run format` | Prettier | Prettier |

### Zmienne środowiskowe serwera

| Zmienna | Opis | Wartość domyślna (dev) |
|---|---|---|
| `NODE_ENV` | `development` / `production` | `development` |
| `PORT` | port API | `3000` |
| `DATABASE_URL` | adres bazy PostgreSQL | `postgres://petrace:petrace@localhost:5434/petrace` |
| `JWT_SECRET` | sekret podpisu sesji (w produkcji: `openssl rand -hex 32`) | tylko w trybie dev |
| `APP_URL` | publiczny adres frontendu | — |
| `SEED_DEMO_DATA` | wypełnienie pustej bazy danymi przykładowymi | `false` |
| `COOKIE_SECURE` | ciasteczko tylko przez HTTPS | `true` w produkcji |

Szablon: [`server/.env.example`](server/.env.example).

---

## 11. Struktura repozytorium

```
PeTracker-FinalVersion/
├── client/                      # aplikacja webowa (React + Vite)
│   ├── src/
│   │   ├── main.jsx             # punkt wejścia
│   │   ├── router.jsx           # definicja tras
│   │   ├── index.css            # Tailwind + tokeny projektowe
│   │   ├── pages/               # public/, owner/
│   │   ├── components/
│   │   │   ├── layout/          # układy: Root, Public, Owner, Finder
│   │   │   ├── ui/              # biblioteka komponentów
│   │   │   └── pets/            # komponenty domenowe
│   │   ├── api/                 # fasada danych (+ mock/ na etapie prototypu)
│   │   ├── hooks/               # useAsync
│   │   └── lib/                 # funkcje pomocnicze
│   ├── Dockerfile               # build wieloetapowy: Vite → nginx
│   └── nginx.conf               # SPA fallback, cache zasobów
├── server/                      # API (Node.js + Express)
│   ├── sql/                     # 001_init.sql (schemat), seed.sql
│   └── src/
│       ├── index.js / app.js    # start serwera / konfiguracja Expressa
│       ├── config.js            # zmienne środowiskowe
│       ├── db.js                # pula połączeń PostgreSQL
│       ├── validation.js        # walidacja danych wejściowych
│       ├── mappers.js           # baza → JSON
│       ├── routes/              # auth.js
│       ├── middleware/          # rateLimit, requireAuth, errorHandler
│       └── services/            # pin.js (scrypt), session.js (JWT)
├── plan/                        # dokumentacja projektowa
└── docker-compose.dev.yml       # baza danych do pracy lokalnej
```

---

## 12. Stan realizacji

✅ gotowe · 🔄 w trakcie · ⏳ zaplanowane

| Moduł | Stan |
|---|---|
| Konfiguracja projektu, tokeny projektowe, biblioteka komponentów UI | ✅ |
| Mapa tras i układy stron | ✅ |
| Panel właściciela: lista i profil zwierzęcia (prototyp na danych lokalnych) | 🔄 |
| Schemat bazy danych | ✅ |
| API: rejestracja, logowanie, sesja, wylogowanie, limity prób | ✅ |
| Połączenie panelu z API, ochrona tras | ⏳ |
| Strona zawieszki — cztery warianty routingu kontekstowego | ⏳ |
| Tryb zaginięcia, SMS z lokalizacją znalazcy | ⏳ |
| Generowanie zawieszki (kod, QR do druku, zapis NFC) | ⏳ |
| Szybki zapis aktywności, historia skanowań | ⏳ |
| PWA, wdrożenie na VPS z HTTPS | ⏳ |

```mermaid
gantt
    title Harmonogram realizacji
    dateFormat YYYY-MM-DD
    axisFormat %d.%m
    section Implementacja
    M1 Logowanie na serwerze          :active, m1, 2026-11-08, 2026-11-22
    M2 Panel właściciela              :m2, after m1, 2026-12-06
    M3 Aplikacja online jako PWA      :m3, after m2, 2026-12-13
    M4 Rdzeń: strona zawieszki        :m4, after m3, 2027-01-03
    section Weryfikacja
    M5 Testy na urządzeniach (NFC/QR) :m5, after m4, 2027-01-17
    section Praca pisemna
    M6 Praca gotowa do złożenia       :m6, after m5, 2027-01-24
```

**Poza zakresem pracy** (kierunki rozwoju): spacery ze statystykami, harmonogram opieki, dostęp dla weterynarza, powiadomienia push, śledzenie spaceru GPS, mapa zgłoszeń.

---

## 13. Dokumentacja

| Dokument | Zawartość |
|---|---|
| [`00-start.md`](plan/00-start.md) | przegląd projektu |
| [`01-zakres.md`](plan/01-zakres.md) | zakres funkcjonalny i priorytety |
| [`02-przypadki-uzycia.md`](plan/02-przypadki-uzycia.md) | aktorzy i scenariusze użycia |
| [`03-widoki-i-trasy.md`](plan/03-widoki-i-trasy.md) | widoki i adresy |
| [`04-architektura.md`](plan/04-architektura.md) | architektura, baza danych, API, wdrożenie |
| [`05-decyzje.md`](plan/05-decyzje.md) | dziennik decyzji projektowych |
| [`06-harmonogram.md`](plan/06-harmonogram.md) | kamienie milowe i ryzyka |
| [`07-praca-pisemna.md`](plan/07-praca-pisemna.md) | konspekt pracy dyplomowej |
| [`08-ankieta.md`](plan/08-ankieta.md) | badanie ankietowe |
| [`09-testy.md`](plan/09-testy.md) | scenariusze testów na urządzeniach |

---

<div align="center">

**Maciej Strączek** · praca inżynierska · Informatyka · WSTiE Sucha Beskidzka

</div>
