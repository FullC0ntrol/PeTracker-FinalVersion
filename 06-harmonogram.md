# Harmonogram

Dostępny czas: ok. 1 h w dni robocze, 2 bloki po 2 h w weekend, wolne pod koniec.
**Dni robocze** = zadania na małej energii (czytanie wyjaśnień, README, akapit pracy, review).
**Weekendy** = kodowanie.

> Do uzupełnienia po rozmowie z promotorem: dokładna data złożenia pracy w systemie: ____

## Plan tygodniowy

| Tydzień | Kod (weekend) | Dni robocze | Gotowe |
|---|---|---|---|
| 19.10–25.10 | etapy 14–15 | **rozmowa z promotorem** (zakres, AI, termin) | ☐ |
| 26.10–1.11 | etapy 16–17 | konspekt pracy (`07-praca-pisemna.md`) | ☐ |
| 2.11–8.11 | etapy 18–20 | rozdział: wstęp, cel i zakres | ☐ |
| 9.11–15.11 | etapy 21–23 (uproszczone) | rozdział: istniejące rozwiązania | ☐ |
| 16.11–22.11 | etapy 24–26 | jw. | ☐ |
| 23.11–29.11 | etapy 28–30 | rozdział: wymagania | ☐ |
| 30.11–6.12 | etapy 31, 33 (SMS), 34 (przełącznik), 41 | jw. | ☐ |
| 7.12–13.12 | etap 44 (PWA) + **wdrożenie frontendu na VPS**, test z prawdziwym tagiem | przegląd `04-architektura.md` | ☐ |
| 14.12–20.12 | backend: projekt bazy, Express, logowanie magic link | rozdział: projekt systemu | ☐ |
| 21.12–3.01 | backend: zwierzęta, tagi, skanowania (święta) | jw. | ☐ |
| 4.01–10.01 | podmiana mocków na API, wdrożenie całości | rozdział: implementacja | ☐ |
| 11.01–… | wolne: poprawki, priorytet 2 jeśli jest czas | testy, podsumowanie, prezentacja | ☐ |

Jeśli tydzień się nie uda, nie nadrabiaj kosztem snu. Przesuń cały plan i wytnij coś z priorytetu 2.

## Etapy z `PLAN_PRZEPISYWANIA.md` po zmianie zakresu

| Etap | Co z nim robimy |
|---|---|
| 14–20 | bez zmian |
| 21 | tylko potrzebne funkcje (data, wiek, czas trwania) |
| 22 | bez zmian |
| 23 | dashboard: lista zwierząt + ostatnie skanowania (bez statystyk i przypomnień) |
| 24 | profil + przełącznik trybu zaginięcia |
| 25 | jeden formularz zamiast trzech kroków |
| 26 | bez zmian |
| 27 | dane kontaktowe + wylogowanie |
| 28–30 | bez zmian (rdzeń pracy) |
| 31 | bez zmian |
| 32 | priorytet 2 |
| 33 | link `sms:` zamiast wysyłki do bazy, bez strony „wysłano” |
| 34 | przełącznik w profilu z modalem (bez osobnej strony) |
| 35 | **wycięty** |
| 36–39 | **wycięte**; zamiast nich (priorytet 2): ręczny wpis spaceru, lista, suma z 7 dni |
| 40 | priorytet 3 |
| 41 | „Utwórz tag” zamiast parowania z istniejącym kodem |
| 42a, 42b | priorytet 2, wersja uproszczona |
| 43 | **wycięty** |
| 44 | bez zmian, ale wcześniej (przed backendem) |
| 45 | tylko krótki przegląd dostępności |

Dane w `mocks/seed.js` dla wyciętych funkcji (np. `locationReports`, trasy spacerów) mogą zostać, nie trzeba pisać dla nich API.

## Nowe części (do rozpisania w etapach)

- **J — Backend:** Express, PostgreSQL, magic link (wysyłka e-maili), endpointy dla funkcji z priorytetu 1.
- **K — Wdrożenie:** Docker, docker compose, Caddy (automatyczny HTTPS), domena.
- **L — Praca pisemna:** według konspektu z `07-praca-pisemna.md`.
