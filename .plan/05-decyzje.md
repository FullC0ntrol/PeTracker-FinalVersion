# Dziennik decyzji

Każda decyzja: co postanowiono, dlaczego, co odrzucono. Nowe wpisy dopisuj na końcu. Gdy decyzja się zmienia, nie kasuj starej, tylko dopisz nową z odwołaniem.

Ten plik jest materiałem do rozdziału pracy o uzasadnieniu przyjętych rozwiązań i do pytań na obronie.

---

### D1 · Nazwa: PeTrace
**Data:** 2026-10-17
**Decyzja:** aplikacja nazywa się PeTrace.
**Odrzucone:** PET-FINDER (wczesne dokumenty), PetTrace (prototyp).

### D2 · Wygląd z prototypu
**Data:** 2026-10-17
**Decyzja:** obowiązuje paleta i typografia wdrożona w etapie 1 (tokeny w `src/index.css`). Dokument „Styles” z Dysku jest nieaktualny.
**Powód:** wygląd jest już wdrożony i się podoba; zmiana kosztowałaby czas bez zysku dla pracy.

### D3 · Krótkie adresy tagów `/t/:tagId`
**Data:** 2026-10-17
**Decyzja:** adres strony tagu ma postać `domena/t/<kod>`.
**Powód:** popularne tagi NFC (NTAG213) mają ok. 140 bajtów pamięci na dane, więc krótszy adres zostawia zapas. Krótki adres jest też czytelniejszy pod kodem QR.
**Odrzucone:** `/pet/:tagId`, `/tag/UUID` (UUID ma 36 znaków).

### D4 · Lokalizacja znalazcy przez SMS, bez zapisu w bazie
**Data:** 2026-10-17
**Decyzja:** znalazca udostępnia pozycję GPS, aplikacja buduje link `sms:` z numerem właściciela i linkiem do Google Maps, telefon otwiera natywną aplikację wiadomości.
**Powód:** najprostsze w implementacji (brak endpointu, tabeli i widoku zgłoszeń), zgodne z kartą projektu, dane lokalizacyjne osób trzecich nie są przechowywane (mniej obowiązków wynikających z RODO).
**Odrzucone:** zapis zgłoszeń w bazie z mapą w trybie zaginięcia (prototyp) → kierunek rozwoju.
**Uwaga techniczna:** składnia treści w linku `sms:` różni się między Androidem a iOS, do przetestowania na obu.

### D5 · Tag generowany w panelu właściciela
**Data:** 2026-10-17
**Decyzja:** właściciel w profilu zwierzęcia klika „Utwórz tag”, system generuje unikalny kod, pokazuje adres i kod QR. Właściciel zapisuje adres na pustym tagu NFC aplikacją na telefon (np. NFC Tools) i drukuje QR.
**Powód:** nie trzeba prowadzić puli wcześniej wygenerowanych tagów ani obsługiwać rejestracji ze strony tagu. Routing kontekstowy ma jeden przypadek mniej.
**Odrzucone:** kreator po zeskanowaniu pustego tagu (`/setup/:tagId`), wcześniejsze generowanie kodów przez administratora.

### D6 · Logowanie magic link
**Data:** 2026-10-17
**Decyzja:** logowanie bez hasła, jednorazowym linkiem wysłanym na e-mail (zgodnie z kartą).
**Odrzucone:** login z imienia i hasło z daty urodzenia (wczesne założenia) — dane łatwe do zgadnięcia lub znalezienia w mediach społecznościowych.

### D7 · PostgreSQL
**Data:** 2026-10-17
**Decyzja:** baza relacyjna PostgreSQL.
**Powód:** dane są silnie powiązane (użytkownik → zwierzęta → tagi → skanowania), relacje i klucze obce pilnują spójności.
**Odrzucone:** MongoDB (wymienione w karcie jako alternatywa).

### D8 · Warstwa mock przed backendem
**Data:** 2026-10-17
**Decyzja:** frontend korzysta z `src/api/`, które na razie czyta dane z `localStorage`. Komponenty nigdy nie importują z `src/mocks/`.
**Powód:** frontend powstaje niezależnie od backendu; funkcje w `api/` są gotową specyfikacją przyszłych endpointów. Podmiana na `fetch` nie zmienia komponentów.

### D9 · Wspólne komponenty UI zostają, ale bez rozbudowy
**Data:** 2026-10-17
**Decyzja:** istniejące komponenty z `components/ui/` zostają. Nowy wspólny komponent powstaje tylko wtedy, gdy ten sam element jest potrzebny w co najmniej dwóch miejscach.
**Powód:** wspólny `Button` czy `Input` skraca pisanie kolejnych stron i daje spójny wygląd; dalsza rozbudowa biblioteki komponentów nie przybliża do działającej aplikacji.

### D10 · Ograniczenie zakresu
**Data:** 2026-10-17
**Decyzja:** zakres według `01-zakres.md`.
**Powód:** realnie dostępny czas do terminu to ok. 160–230 godzin, a pełny zakres karty to ok. 370–580 godzin.
**Status:** **do akceptacji promotora.**

### D11 · Spacery wpisywane ręcznie
**Data:** 2026-10-17
**Decyzja:** spacer zapisuje się ręcznie (czas trwania, opcjonalnie dystans) albo jednym kliknięciem po skanie tagu.
**Powód:** przeglądarki, zwłaszcza na iOS, zatrzymują geolokalizację przy wygaszonym ekranie, więc śledzenie trasy w PWA jest zawodne i pracochłonne.
**Odrzucone:** śledzenie GPS z mapą trasy i wykresy → kierunek rozwoju.

### D12 · Tryb zaginięcia w profilu zwierzęcia
**Data:** 2026-10-17
**Decyzja:** przełącznik trybu zaginięcia jest w profilu zwierzęcia, z potwierdzeniem w oknie modalnym. Brak osobnej podstrony.
**Powód:** bez mapy zgłoszeń osobna strona nie ma czego pokazywać.

### D13 · Ankieta jako dodatek
**Data:** 2026-10-17
**Decyzja:** ankieta jest opcjonalna, prowadzona na grupach o zaginionych zwierzętach, jeśli praca pisemna będzie wymagała uzupełnienia.

### D14 · Użycie AI
**Data:** 2026-10-17
**Stan:** prototyp wygenerował Claude Code; wersję finalną autor pisze samodzielnie na jego podstawie. **Do omówienia z promotorem**: zgoda, sposób opisania w pracy, ewentualne oświadczenie.

### D15 · Co znaczy „dane zamaskowane”
**Data:** 2026-10-17
**Decyzja:** gdy zwierzę nie jest zaginione, znalazca widzi imię zwierzęcia i uwagi medyczne oraz przycisk „Zadzwoń”, ale nie widzi imienia, e-maila ani numeru telefonu właściciela jako tekstu. W trybie zaginięcia numer jest wyświetlany wprost i dochodzi SMS z lokalizacją.
**Powód:** znalazca musi mieć możliwość kontaktu także wtedy, gdy właściciel jeszcze nie zauważył zaginięcia.
**Ograniczenie (do opisania w pracy):** numer jest zawarty w linku `tel:`, więc technicznie da się go odczytać. Pełne ukrycie wymagałoby pośredniczenia w kontakcie przez system → kierunek rozwoju.

### D16 · Wariant strony tagu wybiera serwer
**Data:** 2026-10-17
**Decyzja:** `GET /api/tags/:code` zwraca wariant (`inactive`, `owner`, `lost`, `found`) i tylko dane potrzebne w tym wariancie.
**Powód:** dane, których znalazca nie powinien widzieć, w ogóle nie trafiają do przeglądarki.
**Odrzucone:** pobieranie pełnego profilu i ukrywanie pól w React.

### D17 · Sesja w ciasteczku httpOnly, jedna domena
**Data:** 2026-10-17
**Decyzja:** po weryfikacji magic linku serwer ustawia podpisany JWT w ciasteczku `httpOnly`. Frontend i API działają pod tą samą domeną (`/api/*` przez proxy).
**Powód:** JavaScript na stronie nie ma dostępu do tokenu (ochrona przed XSS), brak konfiguracji CORS.
**Odrzucone:** token w `localStorage`.

### D18 · Caddy zamiast nginx
**Data:** 2026-10-17
**Decyzja:** serwerem przed aplikacją jest Caddy.
**Powód:** sam pobiera i odnawia certyfikat HTTPS, konfiguracja to kilka linijek. Przy nginx trzeba osobno ustawić certbota.

### D19 · Monorepo: `client/` i `server/`
**Data:** 2026-10-17
**Decyzja:** jedno repozytorium z folderami `client/` (frontend), `server/` (backend), `docs/` i plikiem `docker-compose.yml` w korzeniu. Folder `petracer-final/` zmienia nazwę na `client/`.
**Powód:** całość pracy w jednym miejscu, jeden `docker compose up` uruchamia cały system.

### D20 · SQL bez ORM
**Data:** 2026-10-17
**Decyzja:** backend używa biblioteki `pg` i ręcznie pisanych zapytań SQL, schemat w pliku `sql/001_init.sql`.
**Powód:** kilka tabel, prosty model danych; mniej rzeczy do nauki niż przy ORM, a zapytania łatwo pokazać i omówić w pracy.
