const pokeBall = new URL('../../poke-ball.png', import.meta.url).href

type Props = {
  search: string
  setSearch: (v: string) => void
}

export default function Header({ search, setSearch }: Props) {
  return (
    <header className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col items-center justify-center gap-4 mb-6">
        <div className="text-3xl font-bold flex items-center gap-3">
          <img src={pokeBall} alt="Pokeball" className="w-10 h-10" />
          <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300 bg-clip-text text-transparent">
            Pokémon Explorer
          </span>
        </div>
      </div>

      <div className="flex justify-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Pokémon..."
          aria-label="Search Pokémon"
          className="w-full max-w-xl bg-gray-800 border border-gray-700 rounded-full px-4 py-2 focus:outline-none"
        />
      </div>
    </header>
  )
}
