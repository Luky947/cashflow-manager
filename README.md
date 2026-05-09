# Cash Flow Manager

Osobní správce peněžních toků — offline-first PWA pro sledování příjmů, výdajů, rozpočtů a opakujících se plateb.

## Tech stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Zustand** — centrální store s `persist` middleware (localStorage)
- **React Router v6** — client-side routing

## Funkce (Milestone 1 — základ)

- Centrální Zustand store s kompletním CRUD pro transakce, kategorie, rozpočty a opakující se platby
- localStorage persistence pod klíčem `cashflow-app-v1`
- Ochrana před vyčištěním storage (Safari iOS fix) — detekce při hydrataci
- Seed data: 5 kategorií + 10 ukázkových transakcí za poslední 2 měsíce
- React Router routing pro 4 stránky

## Spuštění

```bash
npm install
npm run dev
```

## Struktura projektu

```
src/
├── types/index.ts          # Všechny TypeScript interfacy
├── store/useAppStore.ts    # Centrální Zustand store
├── utils/storage.ts        # localStorage helpers (integrity check, size)
├── data/seed.ts            # Výchozí kategorie + ukázkové transakce
├── pages/
│   ├── Dashboard.tsx
│   ├── Transactions.tsx
│   ├── Analytics.tsx
│   └── Settings.tsx
└── App.tsx                 # Router + seed init
```

## Plán milestones

| Milestone | Obsah |
|-----------|-------|
| M1 ✅     | Store, typy, routing, seed data |
| M2        | Dashboard — přehled měsíce, grafy, bilance |
| M3        | Správa transakcí — přidávání, editace, filtrování |
| M4        | Rozpočty a opakující se platby |
| M5        | Export, analytika, PWA manifest |
