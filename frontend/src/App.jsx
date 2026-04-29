import { useState } from 'react'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setResults([])

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Bir hata oluştu.')
      setResults(data.results)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold text-emerald-400">🐑 ekonomiKOYUN</h1>
        <p className="text-sm text-gray-400">Türkiye için oyun fiyat karşılaştırma</p>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">

        {/* Arama kutusu */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Oyun ara... (örn: witcher, cyberpunk)"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            {loading ? '...' : 'Ara'}
          </button>
        </form>

        {/* Hata */}
        {error && (
          <p className="text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-3 mb-6">
            {error}
          </p>
        )}

        {/* Sonuçlar */}
        {results.length > 0 && (
          <ul className="space-y-3">
            {results.map((game) => (
              <li key={game.externalId}>
                <a
                  href={game.storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-3 transition-colors"
                >
                  {game.coverUrl && (
                    <img
                      src={game.coverUrl}
                      alt={game.title}
                      className="w-24 h-9 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 text-left">
                    <p className="font-medium text-white">{game.title}</p>
                    <p className="text-xs text-gray-400">Steam · #{game.externalId}</p>
                  </div>
                  <span className="text-emerald-400 text-sm">Steam'de gör →</span>
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Boş sonuç */}
        {!loading && results.length === 0 && query && !error && (
          <p className="text-gray-500 text-center">Sonuç bulunamadı.</p>
        )}
      </main>
    </div>
  )
}

export default App
