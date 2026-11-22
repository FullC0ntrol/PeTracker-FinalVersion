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

🌐 **Wersja online: [petracker.pl](https://petracker.pl)**

</div>

---

## Spis treści

1. [Problem i cel projektu](#1-problem-i-cel-projektu)
2. [Stack technologiczny](#2-stack-technologiczny)
3. [Zasada działania](#3-zasada-działania)
4. [Routing kontekstowy](#4-routing-kontekstowy)
5. [Architektura systemu](#5-architektura-systemu)
6. [Model danych](#6-model-danych)
7. [API](#7-api)
8. [Uwierzytelnianie i bezpieczeństwo](#8-uwierzytelnianie-i-bezpieczeństwo)
9. [Serwer](#9-serwer-server)
10. [Aplikacja kliencka](#10-aplikacja-kliencka)
11. [Uruchomienie](#11-uruchomienie)
12. [Struktura repozytorium](#12-struktura-repozytorium)

---

## 1. Problem i cel projektu

Zagubione zwierzę najczęściej znajduje przypadkowa osoba, która ma przy sobie tylko smartfon. PeTrace zamienia ten smartfon w narzędzie pomocy:

| Problem | Odpowiedź PeTrace |
|---|---|
| Znalazca nie ma czytnika czipów | czytnikiem jest jego smartfon: NFC albo aparat |
| Lokalizatory GPS są drogie i na abonament | zawieszka za ok. 2 zł, bez baterii i opłat |
| Dane na adresówce się dezaktualizują | zawieszka niesie tylko adres, dane są w aplikacji |
| Obca osoba nie zainstaluje aplikacji | strona otwiera się w przeglądarce |
| Jeden identyfikator, różni odbiorcy | routing kontekstowy: inny widok dla znalazcy, opiekuna i w trybie zaginięcia |

### Na tle istniejących rozwiązań

| Rozwiązanie | Koszt | Co dostaje znalazca |
|---|---|---|
| Adresówka | kilkanaście zł | numer, który łatwo się ściera i dezaktualizuje |
| Mikroczip (obowiązkowy, KROPiK) | do 100 zł [^kropik] | nic — odczyt wymaga czytnika weterynarza |
| Lokalizator GPS (np. Tractive) | ok. 320 zł [^bt] + 20–52 zł/mies. [^tractive] | nic — działa tylko dla właściciela |
| **PeTrace** | **ok. 2 zł (NFC) + 0 zł (QR)** | **profil zwierzęcia, informacje o zdrowiu i kontakt z opiekunem jednym dotknięciem** |

PeTrace nie zastępuje obowiązkowego czipu — uzupełnia go o to, czego czip nie daje: natychmiastowy kontakt znalazcy z opiekunem.

**Cel:** system, w którym pasywna zawieszka NFC/QR otwiera aplikację webową bez instalacji, a serwer decyduje, co zobaczy skanujący: znalazca, opiekun czy ktoś, kto znalazł zwierzę oznaczone jako zaginione.

**Więcej niż identyfikacja.** Aplikacja jest też miejscem codziennej opieki: profil i dane zdrowotne zwierzęcia, tryb zaginięcia, szybki zapis karmienia i spaceru po zeskanowaniu zawieszki. Architektura jest przygotowana na kolejne funkcje zarządzania zwierzęciem, m.in. spacery ze statystykami, harmonogram opieki (karmienie, leki, szczepienia), dostęp dla weterynarza i powiadomienia push.

---

## 2. Stack technologiczny

| Warstwa | Technologia | Dlaczego |
|---|---|---|
| Klient | React 19, Vite 8, Tailwind CSS 4 | szybki, spójny interfejs mobile-first |
| Aplikacja | PWA | bez instalacji dla znalazcy, z instalacją na ekranie głównym dla właściciela |
| Funkcje telefonu | Web NFC, Geolocation, `tel:`, `sms:` | zapis tagu z przeglądarki [^webnfc], lokalizacja w SMS-ie, połączenie jednym dotknięciem |
| Serwer | Node.js 22, Express 5 | jeden język w całym systemie |
| Baza | PostgreSQL 17 | integralność danych pilnowana przez bazę |
| Wdrożenie | Docker Compose, Caddy | automatyczny HTTPS, którego wymagają Web NFC i PWA |

---

## 3. Zasada działania

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

## 4. Routing kontekstowy

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


---

## 5. Architektura systemu

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

---

## 6. Model danych

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

## 7. API

Wszystkie adresy mają prefiks `/api`, a odpowiedzi są w formacie JSON. Błąd ma zawsze postać `{ "error": "komunikat" }`.
🔒 — wymaga zalogowania. Moduł uwierzytelniania (`/auth/*`, `/health`) jest zaimplementowany w [`server/src/routes/auth.js`](server/src/routes/auth.js); pozostałe adresy opisują interfejs kolejnych modułów.

| Metoda | Adres | Opis |
|---|---|---|
| GET | `/health` | kontrola działania serwera |
| POST | `/auth/register` | rejestracja (e-mail, imię, PIN), ustawia sesję |
| POST | `/auth/login` | logowanie e-mailem i PIN-em, ustawia sesję |
| GET | `/auth/me` | bieżący użytkownik albo `{ "user": null }` |
| POST | `/auth/logout` | usunięcie ciasteczka sesji |
| PATCH | `/me` 🔒 | zmiana imienia i telefonu kontaktowego |
| GET / POST | `/pets` 🔒 | lista zwierząt właściciela / dodanie zwierzęcia |
| GET / PATCH | `/pets/:id` 🔒 | szczegóły / edycja |
| PATCH | `/pets/:id/lost` 🔒 | włączenie / wyłączenie trybu zaginięcia |
| POST | `/pets/:id/tag` 🔒 | wygenerowanie kodu zawieszki |
| GET | `/pets/:id/scans` 🔒 | historia skanowań |
| GET | `/tags/:code` | **publiczny** — routing kontekstowy, zapis skanu |
| GET / POST | `/pets/:id/activities` 🔒 | lista z 7 dni / szybki zapis aktywności |

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

## 8. Uwierzytelnianie i bezpieczeństwo

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

## 9. Serwer (`server/`)

Serwer to aplikacja **Node.js 22 + Express 5** napisana w modułach ES (`import`/`export`). Udostępnia REST API pod `/api`, komunikuje się z PostgreSQL czystym SQL-em (biblioteka `pg`, bez ORM-a) i jest jedynym miejscem, w którym zapadają decyzje o dostępie do danych.

### Uruchomienie procesu

```mermaid
flowchart LR
    A["node src/index.js"] --> B["config.js<br/>wczytanie .env<br/>i walidacja zmiennych"]
    B --> C{"SELECT 1<br/>baza odpowiada?"}
    C -- nie --> X["zatrzymanie procesu<br/>(błąd w logach)"]
    C -- tak --> D{"SEED_DEMO_DATA<br/>= true?"}
    D -- tak --> E["seed.js<br/>dane demo tylko<br/>do pustej bazy"]
    D -- nie --> F
    E --> F["createApp()<br/>app.listen(PORT)"]
```

Serwer **nie startuje bez bazy danych** i — w trybie produkcyjnym — bez kompletu zmiennych środowiskowych. Błąd konfiguracji wychodzi przy starcie, a nie przy pierwszym żądaniu użytkownika.

### Moduły

| Plik | Odpowiedzialność |
|---|---|
| `src/index.js` | punkt wejścia: sprawdzenie bazy, opcjonalne dane demo, nasłuchiwanie na porcie |
| `src/app.js` | budowa aplikacji Express: parsery, trasy, obsługa 404 i błędów; oddzielona od `index.js`, żeby testy mogły tworzyć aplikację bez otwierania portu |
| `src/config.js` | jedno źródło konfiguracji; w trybie dev wartości domyślne, w produkcji brak zmiennej = błąd startu |
| `src/db.js` | pula połączeń `pg.Pool` i funkcja `query()`; parsery typów: `DATE` zostaje napisem (bez przesunięć strefy czasowej), `NUMERIC` zamieniany na liczbę |
| `src/errors.js` | klasa `HttpError(status, message)` — błąd z komunikatem przeznaczonym dla użytkownika |
| `src/validation.js` | funkcje `parseEmail`, `parseName`, `parsePin`: zwracają oczyszczoną wartość albo rzucają `HttpError(400)` |
| `src/mappers.js` | zamiana wiersza z bazy na obiekt JSON; pola wybierane jawnie, więc `pin_hash` nigdy nie trafia do odpowiedzi |
| `src/routes/auth.js` | rejestracja, logowanie, bieżący użytkownik, wylogowanie |
| `src/middleware/rateLimit.js` | limit liczby żądań w oknie czasowym |
| `src/middleware/requireAuth.js` | `loadUser` — odczyt sesji i załadowanie użytkownika do `req.user` |
| `src/middleware/errorHandler.js` | zamiana każdego błędu na odpowiedź `{ "error": "…" }` z właściwym kodem HTTP |
| `src/services/pin.js` | skrót PIN-u (`scrypt` + sól) i jego weryfikacja w stałym czasie |
| `src/services/session.js` | podpisywanie i odczyt tokenu JWT, ustawianie i usuwanie ciasteczka |
| `src/seed.js` + `sql/seed.sql` | dane przykładowe (konto demo, dwa zwierzęta, zawieszki) wczytywane tylko do pustej bazy |
| `sql/001_init.sql` | schemat bazy: tabele, ograniczenia, indeksy |

### Droga żądania przez serwer

Przykład: `POST /api/auth/login`.

```mermaid
flowchart TD
    R["POST /api/auth/login"] --> J["express.json()<br/>parsowanie treści, limit 20 kB"]
    J --> K["cookie-parser<br/>odczyt ciasteczek"]
    K --> L1["rateLimit — na adres IP<br/>20 prób / 15 min"]
    L1 --> L2["rateLimit — na adres e-mail<br/>5 prób / 15 min"]
    L2 --> V["validation.js<br/>parseEmail · parsePin"]
    V --> Q["db.js<br/>SELECT … WHERE email = $1"]
    Q --> P["pin.js<br/>verifyPin (scrypt, timingSafeEqual)"]
    P --> S["session.js<br/>JWT → ciasteczko httpOnly"]
    S --> M["mappers.js<br/>toUser()"]
    M --> OK["200 { user }"]
    L1 & L2 & V & P -. "throw HttpError" .-> EH["errorHandler"]
    EH --> ERR["4xx { error }"]
```

Każdy etap może przerwać żądanie, rzucając `HttpError`. Express 5 sam przechwytuje błędy z funkcji `async`, więc trasy nie potrzebują bloków `try/catch` — cała obsługa błędów jest w jednym miejscu.

### Obsługa błędów

| Źródło błędu | Odpowiedź |
|---|---|
| `HttpError` rzucony w trasie, walidacji lub limicie | jego kod i komunikat, np. `400`, `401`, `409`, `429` |
| niepoprawny JSON w treści żądania | `400 Niepoprawny format danych.` |
| treść większa niż 20 kB | `413 Za dużo danych w jednym żądaniu.` |
| nieznany adres pod `/api` | `404 Nie ma takiego adresu API.` |
| każdy inny wyjątek | `500` z ogólnym komunikatem; szczegóły tylko w logach serwera |

### Walidacja danych wejściowych

| Pole | Reguła |
|---|---|
| e-mail | przycięty, małymi literami, format `a@b.c`, maks. 254 znaki |
| imię | przycięte, niepuste, maks. 60 znaków |
| PIN | napis z dokładnie 6 cyfr (napis, a nie liczba — liczba zgubiłaby zera z przodu) |

### Limit prób (`rateLimit`)

Algorytm **stałego okna czasowego**: licznik na klucz (adres IP albo znormalizowany e-mail) w strukturze `Map`. Pierwsze żądanie otwiera okno, kolejne zwiększają licznik, a po przekroczeniu progu serwer odpowiada `429` z nagłówkiem `Retry-After`. Wygasłe wpisy usuwa cykliczny timer (`unref()`, więc nie blokuje zamknięcia procesu). Dzięki normalizacji e-maila (`trim`, małe litery) dopisanie spacji nie daje nowej puli prób.

### Sesja

Po poprawnym logowaniu serwer podpisuje token JWT `{ sub: id_użytkownika }` ważny 30 dni i zapisuje go w ciasteczku `petrace_session` (`httpOnly`, `SameSite=Lax`, `Secure` w produkcji). Middleware `loadUser` odczytuje token przy kolejnych żądaniach: brak ciasteczka, zły podpis i wygasły token dają po prostu `req.user = null`. Serwer nie przechowuje listy sesji, więc skaluje się bez dodatkowego stanu.

### Skrypty

| Polecenie | Działanie |
|---|---|
| `npm run dev` | serwer z automatycznym restartem po zmianie pliku (`node --watch`) |
| `npm start` | uruchomienie produkcyjne |
| `npm run lint` | analiza statyczna ESLint |
| `npm run format` / `format:check` | formatowanie Prettierem / sprawdzenie formatowania |

---

## 10. Aplikacja kliencka

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

| Adres | Widok | Układ | Dostęp |
|---|---|---|---|
| `/` | strona główna | Public | publiczny |
| `/login` | logowanie e-mail + PIN | Public | publiczny |
| `/rejestracja` | zakładanie konta | Public | publiczny |
| `/t/:tagId` | **strona zawieszki** (routing kontekstowy) | Finder | publiczny |
| `/t/:tagId/lokalizacja` | wysłanie lokalizacji SMS-em | Finder | publiczny |
| `/panel` | ostatnio oglądane zwierzę lub pusty stan | Owner | 🔒 |
| `/zwierzeta/nowe` | dodanie zwierzęcia | Owner | 🔒 |
| `/zwierzeta/:id` | profil: dane, zdrowie, aktywność, tryb zaginięcia | Owner | 🔒 |
| `/zwierzeta/:id/edytuj` | edycja | Owner | 🔒 |
| `/zwierzeta/:id/tag` | zawieszka, kod QR, historia skanowań | Owner | 🔒 |
| `/ustawienia` | dane kontaktowe, wylogowanie | Owner | 🔒 |
| `*` | 404 | Public | publiczny |

### System projektowy

- **Tokeny** kolorów, fontów i cieni zdefiniowane w `@theme` (Tailwind CSS v4) w `client/src/index.css` — komponenty nie używają wartości „na sztywno”.
- **Biblioteka komponentów UI:** `Button`, `Card`, `Badge`, `Input`, `Textarea`, `Select`, `Toggle`, `Tabs`, `Modal`, `Sheet`, `Spinner`, `EmptyState`, `ErrorState`.
- **Trzy stany danych** na każdej stronie: ładowanie, błąd, brak danych.
- **Fonty lokalne** (Fontsource) — bez zależności od Google Fonts.

---

## 11. Uruchomienie

Lokalnie system to trzy elementy, każdy na swoim porcie:

```mermaid
flowchart LR
    B["Przeglądarka<br/>localhost:5173"] --> V["Vite — aplikacja kliencka<br/>:5173"]
    V -- "/api/* (proxy)" --> A["API Express<br/>:3000"]
    A --> D[("PostgreSQL w Dockerze<br/>:5434")]
```

### Krok 0. Zainstaluj narzędzia (jednorazowo)

| Narzędzie | Windows | Linux (Ubuntu / Debian) |
|---|---|---|
| **Git** | [git-scm.com](https://git-scm.com/download/win), instalator z ustawieniami domyślnymi | `sudo apt install git` |
| **Node.js 22 LTS** | [nodejs.org](https://nodejs.org), instalator LTS | przez [nvm](https://github.com/nvm-sh/nvm): po instalacji nvm `nvm install 22` |
| **Docker** | [Docker Desktop](https://www.docker.com/products/docker-desktop/) (wymaga WSL 2, instalator sam to zaproponuje); po instalacji uruchom Docker Desktop | `curl -fsSL https://get.docker.com \| sh`, potem `sudo usermod -aG docker $USER` i wyloguj się / zaloguj ponownie |

Sprawdzenie (w terminalu: PowerShell na Windows, zwykły terminal na Linuksie):

```bash
git --version
node -v                 # v22.x
docker compose version
```

### Krok 1. Pobierz repozytorium

```bash
git clone https://github.com/FullC0ntrol/PeTracker-FinalVersion.git
cd PeTracker-FinalVersion
```

### Krok 2. Uruchom bazę danych

```bash
docker compose -f docker-compose.dev.yml up -d
docker compose -f docker-compose.dev.yml ps      # STATUS powinien pokazać "healthy"
```

Przy pierwszym starcie PostgreSQL sam tworzy tabele z `server/sql/001_init.sql`. Dane zostają na wolumenie Dockera między uruchomieniami.

### Krok 3. Uruchom serwer API (terminal nr 1)

**Windows (PowerShell):**

```powershell
cd server
Copy-Item .env.example .env
npm install
npm run dev
```

**Linux:**

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

W terminalu pojawi się `API działa na http://localhost:3000`. Sprawdzenie: otwórz w przeglądarce [localhost:3000/api/health](http://localhost:3000/api/health) — odpowiedź to `{"ok":true}`.

Ten terminal zostaw otwarty: serwer działa, dopóki go nie zamkniesz.

### Krok 4. Uruchom aplikację kliencką (terminal nr 2)

Otwórz **nowy** terminal w folderze repozytorium (polecenia są takie same na Windows i Linuksie):

```bash
cd client
npm install
npm run dev
```

Otwórz [localhost:5173](http://localhost:5173). Zapytania do `/api` Vite przekazuje do serwera na porcie 3000, więc nic więcej nie trzeba konfigurować.

**Konto demo** (wczytywane do pustej bazy, bo w `.env.example` jest `SEED_DEMO_DATA=true`): e-mail `maciej@pettrace.pl`, PIN `123456`.

### Zatrzymanie i reset

| Co | Polecenie |
|---|---|
| zatrzymanie API i aplikacji | `Ctrl + C` w obu terminalach |
| zatrzymanie bazy (dane zostają) | `docker compose -f docker-compose.dev.yml down` |
| usunięcie bazy razem z danymi (świeży start) | `docker compose -f docker-compose.dev.yml down -v` |

### Najczęstsze problemy

| Objaw | Przyczyna i rozwiązanie |
|---|---|
| `docker: error during connect` / `Cannot connect to the Docker daemon` | Docker nie działa: uruchom Docker Desktop (Windows) albo `sudo systemctl start docker` (Linux) |
| `permission denied … docker.sock` (Linux) | użytkownik nie jest w grupie `docker`: `sudo usermod -aG docker $USER` i ponowne zalogowanie |
| `npm : … running scripts is disabled on this system` (Windows) | PowerShell blokuje skrypty: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| serwer kończy się błędem `ECONNREFUSED` przy starcie | baza jeszcze nie działa: wróć do kroku 2 i poczekaj na status `healthy` |
| `port is already allocated` przy starcie bazy | port 5434 jest zajęty: zmień go w `docker-compose.dev.yml` i w `DATABASE_URL` w `server/.env` |
| zmiany w `001_init.sql` nie są widoczne | schemat ładuje się tylko do pustej bazy: `down -v`, potem znowu `up -d` |

### Polecenia npm

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
| `SEED_DEMO_DATA` | wypełnienie pustej bazy danymi przykładowymi | `true` w `.env.example`, bez zmiennej `false` |
| `COOKIE_SECURE` | ciasteczko tylko przez HTTPS | `true` w produkcji |

Szablon: [`server/.env.example`](server/.env.example).

---

## 12. Struktura repozytorium

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
└── docker-compose.dev.yml       # baza danych do pracy lokalnej
```

---

<div align="center">

**Maciej Strączek** · praca inżynierska · Informatyka · WSTiE Sucha Beskidzka

</div>

---

[^kropik]: Ustawa o Krajowym Rejestrze Oznakowanych Psów i Kotów (KROPiK), podpisana w czerwcu 2026 r.: koszt oznakowania i koszt rejestracji do 50 zł każdy. [forsal.pl](https://forsal.pl/gospodarka/aktualnosci/artykuly/11234526,wlasciciele-psow-i-kotow-zaplaca-za-czipowanie-zwierzat-sejm-uchwalil.html), [prawo.pl](https://www.prawo.pl/samorzad/obowiazek-czipowania-psow-i-kotow,1538026.html)
[^tractive]: Cennik abonamentów Tractive dla Polski: [tractive.com/pl/c/plans](https://tractive.com/pl/c/plans?shopCountry=PL)
[^bt]: Porównanie cen lokalizatorów Bluetooth i GPS: [blog Tractive](https://tractive.com/blog/?p=65842)
[^webnfc]: Web NFC w Chrome na Androidzie (od wersji 89): [developer.chrome.com/docs/capabilities/nfc](https://developer.chrome.com/docs/capabilities/nfc), [web.dev/nfc](https://web.dev/nfc)
