# PeTrace od środka

Jak działa twoja aplikacja: z jakich części się składa, co się dzieje, gdy ktoś zeskanuje zawieszkę, jak wyglądają ekrany i co dokładnie leży w bazie danych.

LLuna, zawieszka `K7Q2-M9XD` MMruczek, zawieszka `M4XD-8P2R`, zaginiony

- [Całość](#calosc)
- [Skan tagu](#skan)
- [Ekrany](#ekrany)
- [Baza danych](#baza)
- [Słowniczek](#slowniczek)

## Z czego składa się system

Pięć części, każda ma jedno zadanie. Strzałki pokazują, kto z kim rozmawia.

Zawieszka

tag NFC + kod QR

Nie ma baterii ani rozumu. Trzyma tylko jeden adres, np. `petrace.pl/t/K7Q2-M9XD`.

Aplikacja w telefonie

frontend: React, PWA

Wszystko, co widać na ekranie. Pyta serwer o dane i rysuje z nich strony.

`client/src/`

Portier

Caddy na VPS

Wpuszcza ruch tylko przez HTTPS. Pliki strony oddaje sam, a pytania o dane przekazuje dalej.

`docker-compose.yml`

Serwer API

backend: Node.js + Express

Pilnuje zasad: kto jest zalogowany, co komu wolno zobaczyć, co zapisać.

`server/src/`

Baza danych

PostgreSQL

Szafa z kartotekami. Pamięta wszystko na stałe, nawet po restarcie serwera.

`server/sql/001_init.sql`

Pomyśl o tym jak o restauracji. **Aplikacja w telefonie** to sala z menu, które widzi gość. **Portier** sprawdza przy drzwiach, czy wchodzi się głównym wejściem. **Serwer API** to kelner: przyjmuje zamówienie, sprawdza, czy gość może je dostać, i idzie na zaplecze. **Baza danych** to magazyn. Gość nigdy nie wchodzi do magazynu sam, zawsze przez kelnera.

### Co jest dziś, a co będzie

#### Teraz (etapy 13–45)

Kelnera i magazynu jeszcze nie ma. Zamiast nich folder `mocks/` udaje bazę i trzyma dane w `localStorage`, czyli w małej szufladzie samej przeglądarki. Funkcje w `api/` czekają chwilę, jakby pytały prawdziwy serwer.

#### Później (backend)

Funkcje w `api/` zamiast do szuflady przeglądarki wyślą zapytanie `fetch('/api/…')` do prawdziwego serwera. Strony i komponenty nie zauważą różnicy, bo pytają tylko `api/`. To dlatego komponenty nigdy nie importują z `mocks/`.

## Co się dzieje, gdy ktoś zeskanuje zawieszkę

To serce twojej pracy: ten sam adres pokazuje różne strony, zależnie od tego, kto skanuje i w jakim stanie jest zwierzę. Nazywa się to routingiem kontekstowym.

1. **Telefon czyta zawieszkę**NFC albo aparat odczytuje adres `/t/K7Q2-M9XD`. System telefonu sam otwiera przeglądarkę, bez żadnej aplikacji.
2. **Przeglądarka ładuje PeTrace**Caddy oddaje pliki strony. React czyta kod z adresu przez `useParams()`.
3. **Aplikacja pyta serwer**`GET /api/tags/K7Q2-M9XD`. Jeśli osoba jest zalogowana, przeglądarka sama dołącza ciasteczko sesji.
4. **Serwer zapisuje skan**Do kartoteki skanowań trafia data, godzina i przeglądarka. Właściciel zobaczy to w historii.
5. **Serwer wybiera wariant**Sprawdza warunki po kolei i odsyła nazwę wariantu oraz tylko te dane, które ten wariant może pokazać.
6. **React rysuje właściwy ekran**Strona tagu ma cztery widoki i pokazuje ten, który wskazał serwer.

### Cztery warianty, sprawdzane w tej kolejności

**1. Nieaktywny**Kod nie istnieje albo tag nie jest przypisany. Komunikat „Ten tag nie jest aktywny”.

**2. Właściciel**Skanuje zalogowany właściciel. Przyciski „Karmienie” i „Spacer”.

**3. Zaginione**Włączony tryb zaginięcia. Czerwony widok, telefon, SMS z lokalizacją.

**4. Znalazca**Wszystkie inne przypadki. Imię, uwagi medyczne, przycisk „Zadzwoń”, bez danych właściciela.

Dlaczego właściciel jest przed „zaginionym”? Gdy właściciel odnajdzie swoje zwierzę i zeskanuje tag, ma zobaczyć swój widok, a nie alarm skierowany do obcych.

## Ekrany

Szkice najważniejszych stron w zakresie z priorytetem 1. Kolory i układ odpowiadają twoim tokenom z `index.css`, szczegóły będą inne w kodzie.

### Znalazca, czyli obca osoba z telefonem

12:415G

petrace.pl/t/K7Q2-M9XD

L

Cześć, jestem Luna

Pies, golden retriever, 4 lata

Ważne dla zdrowia

Uczulenie na kurczaka. Bierze leki na stawy.

Znalazłeś mnie?

Mój opiekun chętnie się z tobą skontaktuje.

Zadzwoń do opiekuna

`/t/:tagId`**Zwierzę niezaginioneznalazca**

Bez imienia, maila i numeru właściciela na ekranie. Przycisk dzwoni, ale numeru nie widać jako tekstu.

12:415G

petrace.pl/t/M4XD-8P2R

Zaginiony. Pomóż mi wrócić do domu

M

Mruczek się zgubił

Kot, dachowiec, 6 lat

Wiadomość od opiekuna

„Uciekł we wtorek z okolic Rynku. Jest płochliwy, proszę nie łapać na siłę.”

Telefon

**+48 600 100 200**

Zadzwoń teraz

Wyślij SMS z lokalizacją

`/t/:tagId`**Tryb zaginięciaznalazca**

Cały ekran zmienia kolor na czerwony. Numer jest widoczny, dochodzi SMS z lokalizacją.

12:425G

petrace.pl/t/M4XD-8P2R/lokalizacja

Gdzie jesteś?

Wyślemy twoją pozycję w SMS-ie do opiekuna Mruczka. Nie zapisujemy jej w systemie.

**Podgląd SMS**

Znalazłem Mruczka! Jestem tutaj: maps.google.com/?q=50.06,19.94

Otwórz SMS

`/t/:tagId/lokalizacja`**Wysyłanie lokalizacjiznalazca**

GPS telefonu → link `sms:` → telefon otwiera zwykłą aplikację wiadomości. Mapa to priorytet 2.

12:435G

petrace.pl/t/ABCD-0000

?

Ten tag nie jest aktywny

Zawieszka nie jest przypisana do żadnego zwierzęcia. Jeśli znalazłeś zwierzę, zgłoś to do najbliższego schroniska.

Czym jest PeTrace?

`/t/:tagId`**Nieaktywny tagkażdy**

Pierwszy warunek routingu: nieznany albo nieprzypisany kod.

### Właściciel na telefonie

08:10Wi-Fi

petrace.pl/login

PeTrace

Zaloguj się

Wyślemy ci link. Bez hasła.

E-mail

maciej@poczta.pl

Wyślij link

Co dalej

Otwórz maila i kliknij link. Ważny 15 minut, działa raz.

`/login`**Logowanie magic linkwłaściciel**

Potem `/login/sprawdz-poczte`, a po kliknięciu w mailu `/auth/verify` loguje i przenosi do panelu.

07:305G

petrace.pl/t/K7Q2-M9XD

L

**Luna**

Twój tag

właściciel

Co zapisać?

Karmienie

Spacer

✓

**Zapisano karmienie**\
dziś, 07:30

Otwórz profil Luny

`/t/:tagId`**Szybki zapiswłaściciel**

Ten sam adres co u znalazcy, ale serwer rozpoznał właściciela po ciasteczku sesji.

18:20Wi-Fi

PeTrace

Twoje zwierzęta

L

**Luna**

pies, 4 lata

bezpieczna

M

**Mruczek**

kot, 6 lat

zaginiony

Ostatnie skanowania

Mruczekdziś 12:41

Luna (ty)dziś 07:30

+

PanelSpaceryPlanUstawienia

`/panel`**Panel właścicielawłaściciel**

Mobilny układ z etapu 7: górny pasek, dolna nawigacja i pomarańczowy przycisk.

18:22Wi-Fi

petrace.pl/zwierzeta/luna

L

Luna

golden retriever

**Zaginiona**

Pokaż znalazcom widok alarmowy

DaneZdrowieAktywność

Urodzona12.03.2022

Waga28 kg

TagK7Q2-M9XD

Edytuj

Tag i QR

**Oznaczyć Lunę jako zaginioną?** Znalazcy zobaczą twój numer i komunikat.

Wiadomość dla znalazcy…

Anuluj

Tak, zaginęła

`/zwierzeta/:id`**Profil i tryb zaginięciawłaściciel**

Przełącznik w profilu otwiera okno potwierdzenia (twój komponent `Modal`).

18:25Wi-Fi

petrace.pl/zwierzeta/luna/tag

Tag Luny

Adres do zapisania na NFC

**petrace.pl/t/K7Q2-M9XD**

Historia skanowań

Chrome, Androidwt 14:02

Safari, iPhone (ty)pon 07:30

`/zwierzeta/:id/tag`**Tag, QR i audytwłaściciel**

Przy pierwszym wejściu przycisk „Utwórz tag”. Potem kod QR, adres do wpisania w NFC Tools i lista skanowań.

### Właściciel na komputerze

PeTrace

Panel

Spacery

Harmonogram

Ustawienia

\+ Rozpocznij spacer

Twoje zwierzęta

L

**Luna**

pies, golden retriever

bezpieczna

M

**Mruczek**

kot, dachowiec

zaginiony

Ostatnie skanowania

Mruczek, Chrome na Androidziedziś 12:41

Luna, tydziś 07:30

Luna, Safari na iPhoniewt 14:02

Od 1024 px sidebar z etapu 6 zastępuje dolny pasek. Dane i strony są te same.

## Baza danych

Wyobraź sobie szafę z szufladami. Każda szuflada to **tabela** i trzyma jeden rodzaj kartek. Każda kartka to **wiersz**, a rubryki na kartce to **kolumny**. Wszystkie kartki w jednej szufladzie mają te same rubryki.

Kliknij dowolny kolorowy identyfikator, np. , a podświetlą się wszystkie kartki, które się do niego odwołują.

#### Właściciele

users

Jedna kartka na osobę z kontem.

- `id`klucznumer kartki, unikalny, nadaje go baza
- `email`adres do logowania, nie może się powtórzyć
- `name`imię
- `phone`numer, na który dzwoni znalazca

Przykładowa kartka

Maciejmaciej@poczta.pl+48 600 100 200

#### Zwierzęta

pets

Jedna kartka na zwierzę. Każda wskazuje swojego właściciela.

- `id`klucznumer kartki zwierzęcia
- `owner_id`odnośniknumer kartki właściciela z szuflady „Właściciele”
- `name`, `species`, `breed`imię, gatunek, rasa
- `medical_notes`choroby, leki, alergie
- `is_lost`tak/nie: czy włączony tryb zaginięcia
- `lost_message`komunikat dla znalazcy

Przykładowe kartki

Lunapieszaginiona: niewłaściciel

Mruczekkotzaginiony: **tak**właściciel

#### Zawieszki

tags

Jedna kartka na zawieszkę. Łączy kod z adresu z konkretnym zwierzęciem.

- `code`kluczkod z adresu, np. K7Q2-M9XD
- `pet_id`odnośnikktórego zwierzęcia to zawieszka (najwyżej jedna na zwierzę)
- `is_active`tak/nie: czy działa

Przykładowe kartki

dlaaktywny

dlaaktywny

#### Skanowania

tag_scans

Zeszyt wejść. Nowa kartka przy każdym otwarciu strony zawieszki. Nikt jej potem nie zmienia.

- `tag_code`odnośnikktóra zawieszka
- `scanned_at`data i godzina
- `user_agent`przeglądarka i system telefonu
- `by_owner`tak/nie: czy skanował sam właściciel

Przykładowe kartki

dziś 12:41Chrome, Android

dziś 07:30właściciel

wt 14:02Safari, iPhone

#### Aktywności

activities

Dziennik opieki: karmienia i spacery.

- `pet_id`odnośnikktórego zwierzęcia dotyczy
- `type`karmienie albo spacer
- `occurred_at`kiedy
- `duration_min`ile minut (tylko spacer, opcjonalnie)
- `source`szybki zapis po skanie albo ręczny wpis

Przykładowe kartki

karmieniedziś 07:30szybki zapis

spacerwczoraj45 minręcznie

#### Przepustki logowania

login_tokens

Jednorazowe przepustki z maila. Kartka powstaje po kliknięciu „Wyślij link” i przestaje działać po użyciu albo po 15 minutach.

- `user_id`odnośnikdla kogo przepustka
- `token_hash`„odcisk” przepustki, nie sama przepustka
- `expires_at`do kiedy ważna
- `used_at`kiedy użyta (puste = jeszcze nie)

Przykładowa kartka

9f2c…e81ado 08:25użyta 08:12

**Dlaczego „odcisk”, a nie sama przepustka?** W mailu jest prawdziwy token, a w bazie tylko jego hash: wynik jednokierunkowej funkcji, z którego nie da się odtworzyć tokenu. Gdy ktoś kliknie link, serwer liczy hash z tokenu w linku i porównuje z kartką. Gdyby ktoś wykradł bazę, ma same odciski i nie zaloguje się na niczyje konto. Tak samo przechowywane są linki dla weterynarza (priorytet 2).

### Jak szuflady są ze sobą powiązane

- **Jeden właściciel ma wiele zwierząt.** Na każdej kartce zwierzęcia jest numer kartki właściciela (`owner_id`). Właściciel nie ma listy zwierząt, to zwierzęta wskazują na niego.
- **Jedno zwierzę ma najwyżej jedną zawieszkę.** Kartka zawieszki wskazuje zwierzę (`pet_id`), a baza pilnuje, żeby ten sam numer zwierzęcia nie pojawił się na dwóch zawieszkach.
- **Jedna zawieszka ma wiele skanowań.** Każda kartka w zeszycie wejść wskazuje kod zawieszki.
- **Jedno zwierzę ma wiele aktywności.** Każdy wpis w dzienniku wskazuje zwierzę.

Taki numer z innej szuflady to **klucz obcy** (na kartkach oznaczony jako „odnośnik”). Baza nie pozwoli zapisać zwierzęcia z numerem właściciela, który nie istnieje. To jest główny powód wyboru bazy relacyjnej PostgreSQL: sama pilnuje, żeby dane do siebie pasowały.

### Prześledźmy jeden skan, szuflada po szufladzie

Znalazca skanuje zawieszkę Mruczka `M4XD-8P2R`. Oznaczenia: czyta i zapisuje.

1. czyta**Zawieszki:** szuka kartki z kodem M4XD-8P2R. Jest, aktywna, wskazuje na zwierzę P2.
2. czyta**Zwierzęta:** otwiera kartkę P2. Mruczek, zaginiony: tak, właściciel U1.
3. czyta**Właściciele:** sprawdza, czy skanuje U1. Skanujący nie jest zalogowany, więc to nie właściciel.
4. zapisuje**Skanowania:** dokłada nową kartkę: M4XD-8P2R, teraz, Chrome na Androidzie, nie właściciel.
5. czyta**Właściciele:** bierze z kartki U1 tylko numer telefonu, bo wariant „zaginione” go potrzebuje. Imienia i maila nie wysyła.
6. Serwer odsyła: wariant `lost`, dane Mruczka, numer i komunikat. Lokalizacja znalazcy nigdzie nie jest zapisywana, bo idzie prosto do SMS-a.

## Słowniczek

Frontend

Część aplikacji działająca w przeglądarce: to, co widać i klika. U ciebie React w folderze `client/`.

Backend

Część działająca na serwerze: logika, zasady dostępu, rozmowa z bazą. U ciebie Express w `server/`.

API

Umówiony sposób, w jaki frontend prosi backend o dane. Zbiór adresów, na które można wysłać zapytanie.

Endpoint

Jeden konkretny adres API z metodą, np. `GET /api/pets` („daj listę zwierząt”) albo `POST /api/pets` („dodaj zwierzę”).

Mock

Udawana wersja czegoś, czego jeszcze nie ma. Twój `mocks/` udaje bazę danych.

Tabela, wiersz, kolumna

Szuflada, kartka, rubryka na kartce.

Klucz główny

Rubryka, która jednoznacznie odróżnia kartkę od innych w tej samej szufladzie, np. `id`.

Klucz obcy

Rubryka z numerem kartki z innej szuflady, np. `owner_id` w zwierzęciu.

Token

Długi losowy ciąg znaków działający jak przepustka, np. w linku logowania.

Hash

Odcisk danych: z tokenu łatwo go policzyć, ale z odcisku nie da się odtworzyć tokenu.

Sesja, ciasteczko

Po zalogowaniu serwer zostawia w przeglądarce ciasteczko. Przeglądarka dołącza je do każdego zapytania i dzięki temu serwer wie, kim jesteś.

Routing kontekstowy

Ten sam adres pokazuje różne widoki zależnie od sytuacji: kto skanuje i czy zwierzę zaginęło.

PWA

Strona internetowa, którą można zainstalować na telefonie jak aplikację, bez sklepu.

HTTPS

Szyfrowane połączenie. Bez niego przeglądarka nie da dostępu do lokalizacji ani nie zainstaluje PWA.

Szkice ekranów pokazują zakres z priorytetem 1 z `docs/01-zakres.md`. Pełny schemat bazy i lista endpointów są w `docs/04-architektura.md`.