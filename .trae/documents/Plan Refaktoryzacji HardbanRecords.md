Oto plan działania naprawczego i refaktoryzacji, który uwzględnia Twoje wymagania oraz naprawę struktury po wstępnych przenosinach plików:

# Plan Kompleksowej Refaktoryzacji i Optymalizacji

## 1. Struktura i Konfiguracja (Naprawa i Uporządkowanie)
Wstępnie przeniosłem pliki do katalogu `src/`, ale wymaga to dokończenia i naprawy konfiguracji.
- **Naprawa Importów**: Zaktualizuję `vite.config.ts` ustawiając alias `@` na katalog `src`, co ułatwi zarządzanie ścieżkami.
- **Aktualizacja TSConfig**: Dostosuję `tsconfig.json` do nowej struktury katalogów (`baseUrl`, `paths`).
- **Weryfikacja Plików**: Upewnię się, że wszystkie komponenty, strony i serwisy znajdują się w odpowiednich podkatalogach wewnątrz `src/`.
- **Globalny Refactor Importów**: Automatycznie poprawię wszystkie ścieżki importów w plikach `.tsx` i `.ts`, aby odzwierciedlały nową strukturę (zamiana `../../` na `@/` tam gdzie to możliwe).

## 2. Analiza i Czystość Kodu (SOLID / DRY / KISS)
- **Statyczna Analiza**: Uruchomię pełny audyt ESLint i naprawię wszystkie błędy (w tym `no-explicit-any`, nieużywane zmienne).
- **Wydzielenie Warstw**:
  - Przeniosę definicje Providerów z `App.tsx` do dedykowanego `src/providers/AppProviders.tsx`.
  - Wydzielę logikę routingu do `src/routes/AppRoutes.tsx`.
- **Eliminacja Duplikacji**: Przeanalizuję komponenty pod kątem powtarzalnego kodu (np. podobne karty dashboardu) i utworzę generyczne komponenty UI.

## 3. Optymalizacja i Czyszczenie
- **Usunięcie Nieużywanych Plików**: Zidentyfikuję i usunę martwy kod oraz pliki tymczasowe.
- **Zależności**: Sprawdzę `package.json` i usunę nieużywane biblioteki.

## 4. Testy (Weryfikacja)
- **Konfiguracja Vitest**: Skonfiguruję środowisko testowe kompatybilne z Vite.
- **Testy Jednostkowe**: Dodam testy dla kluczowych funkcji (np. `AuthContext`, utility functions).
- **Smoke Tests**: Zweryfikuję, czy aplikacja buduje się i uruchamia poprawnie (`npm run build`).

## 5. Dokumentacja
- **README.md**: Zaktualizuję dokumentację startową.
- **Struktura Projektu**: Opiszę nową architekturę w `docs/ARCHITECTURE.md`.

Czy akceptujesz ten plan naprawczy i refaktoryzacyjny? Po potwierdzeniu natychmiast przystąpię do naprawy importów i konfiguracji, aby przywrócić działanie aplikacji.