# Pokemon Explorer

Simple React + TypeScript app to browse Pokémon by type using PokeAPI.

Tech:
- Vite + React + TypeScript
- Tailwind CSS
- @tanstack/react-query for data fetching

Run locally:

1. Install dependencies:

```bash
npm install
```

2. Run dev server:

```bash
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

Features:
- Explore Pokémon list with cards showing sprite, name, number and type pills.
- Type color backgrounds and smooth gradients for dual-types.
- Multi-select type filters and search with debounce.
- Load more pagination (24 per page).
- Modal with Pokémon details: sprites gallery, evolution chain and encounter locations.

Notes:
- Use the search box to filter by name. Click type pills to filter by types (multi-select supported). 
- Colors for types are defined in src/utils/typeColors.ts.