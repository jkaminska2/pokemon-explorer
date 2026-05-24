import { useQuery } from '@tanstack/react-query'

async function fetchDetails(nameOrId: string | number) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`)
  if (!res.ok) throw new Error('Not found')
  const data = await res.json()

  const speciesRes = await fetch(data.species.url)
  const species = await speciesRes.json()

  let evoChain = null
  if (species.evolution_chain?.url) {
    const evoRes = await fetch(species.evolution_chain.url)
    evoChain = await evoRes.json()
  }

  const encountersRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}/encounters`)
  const encounters = encountersRes.ok ? await encountersRes.json() : []

  return { data, species, evoChain, encounters }
}

export function usePokemonDetails(nameOrId: string | number, enabled = true) {
    type PokemonDetails = {
      data: any
      species: any
      evoChain: any
      encounters: any[]
    }
    return useQuery<PokemonDetails>(
      ['pokemon-detail', nameOrId],
      () => fetchDetails(nameOrId),
      { enabled: !!nameOrId && enabled }
    )
}
