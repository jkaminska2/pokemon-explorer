import { useMemo, useState, useEffect } from 'react'
import Header from './components/Header'
import PokemonCard from './components/PokemonCard'
import { typeColors } from './utils/typeColors'
import { usePokemon } from './hooks/usePokemon'
import { usePokemonSearch } from './hooks/usePokemonSearch'
import PokemonModal from './components/PokemonModal'

export default function App() {
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState(search)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [modalId, setModalId] = useState<number | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300)
    return () => clearTimeout(t)
  }, [search])

  const { typeQuery, infiniteQuery } = usePokemon({
    types: selectedTypes,
    search: debounced,
  })

  const { data: searchData } = usePokemonSearch({
    search: debounced,
    types: selectedTypes,
  })

  const all = useMemo(() => {
    if (debounced) {
      return searchData || []
    }

    if (selectedTypes.length > 0) {
      return typeQuery.data || []
    }

    return (infiniteQuery.data?.pages || []).flat()
  }, [debounced, searchData, selectedTypes, typeQuery.data, infiniteQuery.data])

  const types = Object.keys(typeColors)

  return (
    <div className="min-h-screen">
      <Header search={search} setSearch={setSearch} />

      <main className="max-w-screen-2xl mx-auto p-6">

        <div className="flex gap-3 flex-wrap justify-center mb-6">
          {types.map((t) => {
            const active = selectedTypes.includes(t)
            return (
              <button
                key={t}
                onClick={() => {
                  setSelectedTypes((s) =>
                    s.includes(t) ? s.filter((x) => x !== t) : [...s, t]
                  )
                }}
                aria-pressed={active}
                style={{
                  borderColor: active ? '#fff' : 'transparent',
                  backgroundColor: typeColors[t],
                }}
                className={`px-3 py-1 rounded-full text-sm capitalize text-white shadow-sm transition border ${
                  active ? 'border-white' : ''
                }`}
              >
                {t}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {all.length > 0 ? (
            all.map((p: any) => (
              <PokemonCard
                pokemon={p}
                key={p.id}
                onOpen={(id) => setModalId(id)}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400">
              {debounced
                ? 'No Pokémon found for your search.'
                : 'No Pokémon loaded yet.'}
            </div>
          )}
        </div>

        {selectedTypes.length === 0 && !debounced && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => infiniteQuery.fetchNextPage()}
              className="bg-blue-600 px-4 py-2 rounded-full"
              disabled={infiniteQuery.isFetchingNextPage}
            >
              {infiniteQuery.isFetchingNextPage ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        <PokemonModal id={modalId} onClose={() => setModalId(null)} />
      </main>
    </div>
  )
}