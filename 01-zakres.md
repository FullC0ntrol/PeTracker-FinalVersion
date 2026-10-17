# Zakres projektu

> **Status:** wersja robocza. Zmiany względem karty projektu wymagają akceptacji promotora.

Zasada: najkrótsza droga do działającej, wdrożonej aplikacji. Rdzeń pracy (identyfikacja bez instalacji aplikacji + routing kontekstowy) musi być dopracowany. Reszta jest uproszczona albo trafia do rozdziału „Kierunki rozwoju”.

## Priorytet 1 — musi działać

| Funkcja | Wersja w projekcie |
|---|---|
| Strona tagu z routingiem kontekstowym | 4 widoki: nieznany tag, znalazca (dane zamaskowane), zaginione (pełny profil), właściciel (szybki zapis) |
| Widok znalazcy | zdjęcie, imię, uwagi medyczne, przycisk „Zadzwoń” (`tel:`) |
| Lokalizacja od znalazcy | GPS telefonu → link `sms:` z lokalizacją Google Maps; **nic nie trafia do bazy** |
| Tryb zaginięcia | przełącznik w profilu zwierzęcia z potwierdzeniem w oknie modalnym |
| Logowanie | magic link (prawdziwy e-mail z jednorazowym linkiem) |
| Zwierzęta | lista, dodawanie (jeden formularz), profil, edycja |
| Tag | wygenerowanie kodu w panelu, kod QR, adres do zapisania na tagu NFC |
| Szybki zapis właściciela | po skanie własnego tagu: przyciski „Karmienie” i „Spacer” |
| Audyt bezpieczeństwa | lista skanowań tagu (data, godzina, przeglądarka) |
| PWA | manifest, ikony, instalowalność, podstawowy service worker |
| Backend | Node.js + Express + PostgreSQL, tylko endpointy dla funkcji z tej tabeli |
| Wdrożenie | Docker na własnym VPS, domena, HTTPS |

## Priorytet 2 — jeśli zostanie czas

| Funkcja | Wersja uproszczona |
|---|---|
| Udostępnianie weterynarzowi | link z tokenem i datą ważności, podgląd danych medycznych tylko do odczytu |
| Spacery | ręczny wpis (data, czas trwania, opcjonalnie dystans), lista i suma z 7 dni, bez wykresów |
| Mapa przy wysyłaniu lokalizacji | mała mapa Leaflet z pozycją znalazcy przed wysłaniem SMS |

## Priorytet 3 — tylko przy dużym zapasie

| Funkcja | Wersja uproszczona |
|---|---|
| Harmonogram | lista przypomnień z datą, bez powiadomień |

## Kierunki rozwoju (opisane w pracy, nie implementowane)

- Powiadomienia push o przypomnieniach (Web Push, VAPID; na iOS działają tylko w zainstalowanej PWA)
- Śledzenie spaceru przez GPS i wykresy aktywności (przeglądarki ograniczają geolokalizację przy wygaszonym ekranie)
- Zapis zgłoszeń lokalizacji w bazie i mapa zgłoszeń w trybie zaginięcia
- Korekta pinezki na mapie przez znalazcę (map picker)
- Przybliżona lokalizacja skanu na podstawie adresu IP w audycie
- Potwierdzenie wibracją (API wibracji nie działa w Safari na iOS)
- Wybór zakresu danych udostępnianych weterynarzowi
- Ustawienia powiadomień, wieloetapowy formularz zwierzęcia
- Leniwe ładowanie tras, testy jednostkowe, panel deweloperski

## Dodatek

- Ankieta na grupach o zaginionych zwierzętach, jeśli praca pisemna będzie wymagała uzupełnienia (szczegóły w `08-ankieta.md`).

## Zmiany względem karty projektu (do omówienia z promotorem)

| W karcie | W projekcie |
|---|---|
| Push Reminders | kierunek rozwoju |
| Analityka spacerów, wykresy 7-dniowe | ręczny wpis i suma z 7 dni (priorytet 2) |
| Map Picker | kierunek rozwoju |
| Web Haptics | kierunek rozwoju |
| Audyt z lokalizacją z IP i mapą | lista skanowań bez lokalizacji |
| Vet Quick Share | wersja uproszczona (priorytet 2) |
| Rejestracja tagu ze strony głównej | generowanie tagu w panelu właściciela |
