# PeTrace — dokumentacja projektu

Praca inżynierska: **Inteligentny Ekosystem Identyfikacji i Zarządzania Aktywnością Zwierząt Domowych**
Autor: Maciej Strączek · WSTiE Sucha Beskidzka · termin: styczeń–luty 2027

## W jednym akapicie

Zawieszka z tagiem NFC i kodem QR otwiera w przeglądarce adres `/t/<tagId>`. Aplikacja (PWA, bez instalacji) sprawdza, kto skanuje, i pokazuje odpowiedni widok: znalazca widzi profil zwierzęcia i może zadzwonić lub wysłać SMS z lokalizacją, a zalogowany właściciel szybko zapisuje aktywność. Właściciel w panelu zarządza zwierzętami, włącza tryb zaginięcia i przegląda historię skanowań tagu.

## Stan na dziś

| Obszar | Stan |
|---|---|
| Frontend | etapy 0–13 gotowe, etap 14 w trakcie |
| Backend | nie rozpoczęty |
| Wdrożenie (VPS) | nie rozpoczęte |
| Praca pisemna | nie rozpoczęta |
| Rozmowa z promotorem o zakresie i AI | do zrobienia |

## Mapa dokumentów

| Plik | Po co | Stan |
|---|---|---|
| [01-zakres.md](01-zakres.md) | co robimy, co upraszczamy, co odkładamy | wersja robocza, do akceptacji promotora |
| [02-przypadki-uzycia.md](02-przypadki-uzycia.md) | aktorzy i scenariusze krok po kroku | wersja robocza |
| [03-widoki-i-trasy.md](03-widoki-i-trasy.md) | wszystkie podstrony i adresy | wersja robocza |
| [04-architektura.md](04-architektura.md) | warstwy, baza danych, API, wdrożenie | projekt, przed startem backendu |
| [05-decyzje.md](05-decyzje.md) | dziennik decyzji z uzasadnieniem | prowadzony na bieżąco |
| [06-harmonogram.md](06-harmonogram.md) | plan tygodniowy i postęp | aktualizowany co tydzień |
| 07-praca-pisemna.md | konspekt pracy | po rozmowie z promotorem |
| 08-ankieta.md | ankieta (dodatek) | opcjonalnie |
| [PLAN_PRZEPISYWANIA.md](PLAN_PRZEPISYWANIA.md) | szczegółowe etapy frontendu | korekty według 06-harmonogram |

## Repozytoria

- **Wersja finalna** (oddawana): github.com/FullC0ntrol/PeTracker-FinalVersion
- **Prototyp** (wygenerowany przez Claude Code, tylko do podglądu): github.com/FullC0ntrol/petracer

## Zasady

1. Ten folder jest jedynym źródłem prawdy. Dokumenty na Dysku Google są archiwum pierwszych pomysłów.
2. Każda zmiana pomysłu trafia jednym wpisem do `05-decyzje.md`.
3. W piątek albo w niedzielę: 10 minut na aktualizację `06-harmonogram.md`.
