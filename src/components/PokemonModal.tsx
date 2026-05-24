import React from 'react'
import { usePokemonDetails } from '../hooks/usePokemonDetails'

type Props = {
  id: number | null
  onClose: () => void
}

export default function PokemonModal({ id, onClose }: Props) {
  const { data, isLoading, error } = usePokemonDetails(id ?? 0, !!id)

  if (!id) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white text-black rounded-lg max-w-3xl w-full p-6 z-10">
        <button className="absolute right-4 top-4" onClick={onClose} aria-label="Close">✕</button>

        {isLoading && <div>Loading...</div>}
        {!!error && <div>Error loading details</div>}

        {data && (
          <div>
            <header className="flex items-center gap-4">
              <img src={data.data.sprites.front_default} alt="sprite" className="w-20 h-20" />
              <div>
                <h2 className="text-2xl capitalize">{data.data.name}</h2>
                <div className="text-sm text-gray-600">#{String(data.data.id).padStart(3, '0')}</div>
              </div>
            </header>

            <section className="mt-4">
              <h3 className="font-semibold">Sprites</h3>
              <div className="flex gap-3 mt-2 overflow-auto">
                {Object.values(data.data.sprites)
                  .filter((s: any) => typeof s === 'string')
                  .map((s: any, idx) => (
                    <img key={idx} src={s} alt={`sprite-${idx}`} className="w-24 h-24 bg-gray-100" />
                  ))}
              </div>
            </section>

            <section className="mt-4">
              <h3 className="font-semibold">Evolutions</h3>
              <div className="mt-2">
                {data.evoChain ? (
                  <EvolutionList chain={data.evoChain.chain} />
                ) : (
                  <div className="text-sm text-gray-600">No evolution data</div>
                )}
              </div>
            </section>

            <section className="mt-4">
              <h3 className="font-semibold">Encounter Locations</h3>
              <div className="mt-2">
                {data.encounters && data.encounters.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {data.encounters.slice(0, 10).map((loc: any, i: number) => (
                      <li key={i}>{loc.location_area.name}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-600">No encounter data</div>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

function EvolutionList({ chain }: any) {
  const items: string[] = []
  let node = chain
  while (node) {
    items.push(node.species.name)
    node = node.evolves_to && node.evolves_to[0]
  }

  return (
    <div className="flex gap-3 items-center">
      {items.map((n, i) => (
        <div key={n} className="flex items-center gap-2">
          <div className="capitalize">{n}</div>
          {i < items.length - 1 && <div>→</div>}
        </div>
      ))}
    </div>
  )
}
