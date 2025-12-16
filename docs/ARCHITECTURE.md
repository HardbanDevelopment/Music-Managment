# Architektura Projektu HardbanRecords Lab

## Wprowadzenie
Ten dokument opisuje architekturę i decyzje projektowe podjęte podczas refaktoryzacji projektu HardbanRecords Lab.

## Struktura Katalogów
Projekt został zorganizowany zgodnie z konwencją `src/` zawierającą cały kod źródłowy aplikacji frontendowej.

- `src/components`: Komponenty UI, podzielone na domeny (np. `music`, `layout`, `dashboard`).
- `src/pages`: Główne widoki aplikacji, odpowiadające trasom routingu.
- `src/providers`: Konteksty React (Context API) zarządzające stanem globalnym (Auth, Toast).
- `src/routes`: Konfiguracja routingu (React Router).
- `src/services`: Logika komunikacji z API (Supabase, Gemini).
- `src/types`: Definicje typów TypeScript.

## Główne Zmiany Refaktoryzacyjne

### 1. Aliasy Importów
Wprowadzono alias `@/` wskazujący na katalog `src/`. Upraszcza to importy i eliminuje problemy z zagnieżdżonymi ścieżkami względnymi (np. `../../components`).

### 2. Separacja Odpowiedzialności (SOLID)
- **App.tsx**: Został uproszczony i służy jedynie jako punkt wejścia komponujący Providery i Routing.
- **Providers**: Wydzielono logikę `AuthProvider` i `ToastProvider` do oddzielnych plików.
- **Routes**: Logika routingu i lazy-loading stron znajduje się w `AppRoutes.tsx`.
- **Layout**: `MainLayout` odpowiada za strukturę strony (Sidebar + Content).

### 3. Testowanie
Skonfigurowano **Vitest** jako runner testów oraz **React Testing Library** do testowania komponentów.
- Pliki testowe znajdują się w katalogu `tests/`.
- Komenda `npm test` uruchamia testy.

### 4. Jakość Kodu
- **ESLint**: Skonfigurowano reguły lintowania dla TypeScript i React.
- **TypeScript**: Włączono ścisłe sprawdzanie typów.

## Konwencje
- Nazwy plików komponentów: PascalCase (np. `Sidebar.tsx`).
- Nazwy plików użytkowych/funkcji: camelCase (np. `api.ts`).
- Importy: Używaj aliasu `@/` dla importów wewnętrznych.

## Dalszy Rozwój
- Rozbudowa testów jednostkowych dla serwisów.
- Implementacja testów E2E (np. Playwright).
- Dalsza optymalizacja bundle size poprzez lazy loading komponentów.
