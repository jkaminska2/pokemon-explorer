import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

type BasicPokemon = {
  id: number
  name: string
  sprite?: string | null
  types: string[]
}

async function fetchPokemonDetails(url: string): Promise<BasicPokemon> {
  const r = await fetch(url)
  const d = await r.json()
  return {
    id: d.id,
    name: d.name,
    sprite: d.sprites.front_default,
    types: d.types.map((t: any) => t.type.name),
  }
}

async function fetchPokemonPage(offset: number, limit = 24): Promise<BasicPokemon[]> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
  const data = await res.json()
  return Promise.all(data.results.map((p: any) => fetchPokemonDetails(p.url)))
}

async function fetchPokemonsByTypes(types: string[]): Promise<BasicPokemon[]> {
  const all: BasicPokemon[] = []

  for (const t of types) {
    const res = await fetch(`https://pokeapi.co/api/v2/type/${t}`)
    const data = await res.json()

    const pokes = await Promise.all(
      data.pokemon.map((p: any) => fetchPokemonDetails(p.pokemon.url))
    )

    all.push(...pokes)
  }

  const unique = new Map(all.map((p) => [p.id, p]))

  return Array.from(unique.values()).sort((a, b) => a.id - b.id)
}

export function usePokemon(filters: { types: string[]; search: string }) {
  const { types, search } = filters

  const typeQuery = useQuery(
    ['pokemon-by-types', types],
    () => fetchPokemonsByTypes(types),
    {
      enabled: types.length > 0 && search.length === 0,
    }
  )

  const infiniteQuery = useInfiniteQuery(
    ['pokemon', filters],
    ({ pageParam = 0 }) => fetchPokemonPage(pageParam),
    {
      getNextPageParam: (_, pages) => pages.length * 24,
      enabled: types.length === 0 && search.length === 0,
    }
  )

  return {
    typeQuery,
    infiniteQuery,
  }
}