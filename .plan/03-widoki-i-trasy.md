# Widoki i trasy

Stan zakresu: zgodny z `01-zakres.md`. Kolumna „Zmiana” pokazuje różnicę względem routera z etapu 3.

## Publiczne (PublicLayout)

| Adres | Strona | Priorytet | Zmiana |
|---|---|---|---|
| `/` | strona główna: czym jest PeTrace, 3 kroki działania, „Zaloguj się” | 1 | — |
| `/login` | formularz e-mail | 1 | — |
| `/login/sprawdz-poczte` | „Sprawdź skrzynkę” | 1 | — |
| `/auth/verify` | weryfikacja tokenu z linku | 1 | — |
| `*` | strona 404 | 1 | — |
| `/dev/ui` | galeria komponentów (tylko w trybie dev) | — | — |

## Znalazca (FinderLayout)

| Adres | Strona | Priorytet | Zmiana |
|---|---|---|---|
| `/t/:tagId` | routing kontekstowy, 4 warianty (tabela niżej) | 1 | — |
| `/t/:tagId/lokalizacja` | pobranie GPS i przycisk „Wyślij SMS z lokalizacją” | 1 | zamiast formularza do bazy |
| `/t/:tagId/wyslano` | — | — | **usunięte** (SMS otwiera natywną aplikację) |

### Routing kontekstowy `/t/:tagId`

| Kolejność | Warunek | Widok |
|---|---|---|
| 1 | tag nie istnieje albo nie jest przypisany | „Ten tag nie jest aktywny” |
| 2 | zalogowany użytkownik jest właścicielem zwierzęcia | szybki zapis: „Karmienie”, „Spacer” |
| 3 | zwierzę ma włączony tryb zaginięcia | pełny profil interwencyjny (czerwony), telefon, SMS z lokalizacją |
| 4 | w pozostałych przypadkach | profil podstawowy, dane właściciela zamaskowane, kontakt przez „Zadzwoń” |

Każde wejście na `/t/:tagId` zapisuje skan w audycie (data, godzina, przeglądarka).

## Weterynarz (VetLayout)

| Adres | Strona | Priorytet | Zmiana |
|---|---|---|---|
| `/vet/:shareToken` | paszport medyczny tylko do odczytu, „link wygasł” po terminie | 2 | — |

## Właściciel (RequireAuth + OwnerLayout)

| Adres | Strona | Priorytet | Zmiana |
|---|---|---|---|
| `/panel` | lista zwierząt + ostatnie skanowania tagów | 1 | uproszczony |
| `/zwierzeta/nowe` | jeden formularz (bez kroków) | 1 | uproszczony |
| `/zwierzeta/:id` | profil: dane, zdrowie, aktywność, **przełącznik trybu zaginięcia** | 1 | przejmuje tryb zaginięcia |
| `/zwierzeta/:id/edytuj` | edycja (ten sam formularz) | 1 | — |
| `/zwierzeta/:id/tag` | wygenerowanie tagu, QR, adres do zapisania na NFC, lista skanowań | 1 | — |
| `/zwierzeta/:id/zaginiecie` | — | — | **usunięte** (przełącznik w profilu) |
| `/zwierzeta/:id/vet-share` | utworzenie i unieważnienie linku | 2 | uproszczony |
| `/spacery` | lista spacerów + suma z 7 dni | 2 | bez wykresu |
| `/spacery/nowy` | ręczny wpis spaceru | 2 | zamiast śledzenia GPS |
| `/spacery/:id` | — | — | **usunięte** |
| `/harmonogram` | lista przypomnień | 3 | bez powiadomień |
| `/ustawienia` | dane kontaktowe dla znalazcy, wylogowanie | 1 | uproszczony |
