import React from 'react'
import { typeColors } from '../utils/typeColors'

type Props = {
  pokemon: { id: number; name: string; sprite?: string | null; types: string[] }
  onOpen?: (id: number) => void
}

export default function PokemonCard({ pokemon, onOpen }: Props) {
  const colors = pokemon.types.map((t) => typeColors[t] || '#777')
  const bg =
    colors.length === 1
      ? colors[0]
      : `linear-gradient(135deg, ${colors[0]}, ${colors[1] || colors[0]})`

  return (
    <button
      onClick={() => onOpen?.(pokemon.id)}
      className="relative overflow-hidden rounded-[2rem] p-6 sm:p-8 min-h-[260px] hover:scale-[1.01] transition-transform focus:outline-none shadow-2xl w-full max-w-[500px] lg:max-w-[700px] mx-auto"
      style={{ background: bg}}
      aria-label={`Open details for ${pokemon.name}`}
    >
      <div className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="relative flex h-full flex-col items-center justify-center gap-4 text-center text-white">
        <div className="p-2">
          {pokemon.sprite ? (
            <img src={pokemon.sprite} alt={pokemon.name} className="h-32 w-32 object-contain" />
          ) : (
            <div className="h-24 w-24 bg-white/20" />
          )}
        </div>

        <div>
          <div className="text-2xl font-semibold capitalize">{pokemon.name}</div>
          <div className="text-sm text-white/70 mt-1">#{String(pokemon.id).padStart(3, '0')}</div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {pokemon.types.map((t) => (
            <span
              key={t}
              className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs text-white capitalize"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}
