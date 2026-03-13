# Plan Projektu & TODO (Roadmapa MVP)

## Faza 1: Fundamenty i Infrastruktura (Setup)

- [x] Inicjalizacja repozytorium (Monorepo/Turborepo ze strukturą apps/ i packages/).
- [x] Utworzenie projektu Backendowego w `apps/api` (NestJS + GraphQL + TypeScript).
- [x] Utworzenie projektu Frontendowego Mobile w `apps/mobile` (React Native / Expo).
- [x] Utworzenie projektu Frontendowego Web w `apps/web` (Next.js + React).
- [x] Utworzenie współdzielonych paczek w `packages/` (core, ui, config).
- [x] Konfiguracja Dockerfile i `docker-compose.yml` (PostgreSQL, Redis).
- [x] Konfiguracja ORM (Prisma) dla bazy danych w `packages/core`.
- [x] Migracja schematu bazy danych (tabele z pliku `Architektura bazy danych.rb`).

## Faza 2: Backend - Autoryzacja i Użytkownicy

- [x] Implementacja rejestracji (Email + Hasło).
- [x] Weryfikacja wieku (18+).
- [x] Implementacja logowania w oparciu o JWT.
- [x] Zarządzanie profilem użytkownika (edycja danych, awatar, bio).
- [ ] Zarządzanie preferencjami lokalizacyjnymi (PostGIS / koordynaty).

## Faza 3: Design System i Frontend MVP

- [x] Implementacja podstawowego motywu (Dark mode, kolory Primary, Secondary, czcionka Inter).
- [x] Konfiguracja głównej nawigacji (Bottom Tab Bar: Home, Discover, Live, Messages, Profile).
- [x] Ekran Onboardingu (Welcome, Preferencje, Utworzenie Profilu).
- [x] Ekran Profilu (wyświetlanie podstawowych danych i galerii/placeholderów).

## Faza 4: Społeczność i Randki

- [x] Endpointy Backendowe do Feed'u (TikTok-style) i logika algorytmu postów.
- [x] Ekran HOME: Odtwarzanie wideo/zdjęć w pełnym ekranie i gesty (swipe up).
- [x] Mechanizm "Like" i "Follow" (Backend).
- [x] Ekran DISCOVER i filtry wyszukiwania.
- [ ] Architektura Randkowa: algorytm dopasowania i system "Swipe" / "Match".

## Faza 5: Czat i Komunikacja

- [x] Konfiguracja WebSockets (lub Socket.io) / Redis PubSub dla czatu.
- [x] Lista konwersacji (Inbox).
- [x] Czat 1:1 (wysyłanie tekstu).
- [ ] Wysyłanie mediów w czacie.

## Faza 6: Marketplace i Ekonomia (Tokeny)

- [x] Baza danych dla portfela tokenów i historii transakcji.
- [x] Endpointy do dodawania i przeglądania ogłoszeń (Services).
- [x] Ekran dodawania ogłoszenia z cennikiem i formularzem.
- [x] Integracja systemu mikropłatności (kupowanie tokenów - symulacja).
- [x] Implementacja zakupu usług (Service Purchase).
- [ ] Mechanizm "Zablokowanych treści" (Unlock content za tokeny).

## Faza 7: Live Streaming (Trudna technologia)

- [x] Wyboredostawcy/technologii do streamingu (np. AWS IVS, Mux, Ant Media).
- [x] Endpointy pozwalające streamerowi na rozpoczęcie transmisji.
- [x] Odtwarzacz z wideo w aplikacji na żywo (HLS / WebRTC).
- [x] Czat na żywo nakładany na wideo.
- [x] Napiwki na żywo (Tip) z mikroanimacjami do systemu tokenów.
- [x] Prywatne pokazy (Private Show).

## Faza 8: Bezpieczeństwo i Optymalizacje

- [ ] System zgłaszania / moderacji treści.
- [ ] Optymalizacja CDN dla multimediów.
- [ ] Dodanie weryfikacji tożsamości (Selfie).
- [ ] Wdrożenie produkcyjne.
