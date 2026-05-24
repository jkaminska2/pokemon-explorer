import { useQuery } from '@tanstack/react-query'

export type BasicPokemon = {
  id: number
  name: string
  sprite?: string | null
  types: string[]
}

async function fetchPokemonNames() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000')
  const data = await res.json()
  return data.results as Array<{ name: string; url: string }>
}

async function fetchPokemonDetails(name: string): Promise<BasicPokemon> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
  const d = await res.json()
  return {
    id: d.id,
    name: d.name,
    sprite: d.sprites.front_default,
    types: d.types.map((t: any) => t.type.name),
  }
}

export function usePokemonSearch(filters: { search: string; types: string[] }) {
  return useQuery(
    ['pokemon-search', filters],
    async () => {
      const allNames = await fetchPokemonNames()
      const normalized = filters.search.trim().toLowerCase()
      const matched = allNames
        .filter((pokemon) => pokemon.name.includes(normalized))
        .slice(0, 36)

      const details = await Promise.all(matched.map((pokemon) => fetchPokemonDetails(pokemon.name)))
      return details.filter((pokemon) => {
        if (filters.types.length === 0) return true
        return filters.types.every((type) => pokemon.types.includes(type))
      })
    },
    {
      enabled: !!filters.search,
      staleTime: 1000 * 60 * 60,
      cacheTime: 1000 * 60 * 60,
    }
  )
}
