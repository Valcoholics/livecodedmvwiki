"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { useCSVData } from "../hooks/useCSVData"
import TableView from "../components/TableView"

// Dynamically import P5Sketch to avoid SSR issues
const P5Sketch = dynamic(() => import("../src/components/P5Sketch"), {
  ssr: false,
  loading: () => (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white bg-opacity-90 p-5 rounded-lg shadow-lg">
      <img src="/images/loading.gif" alt="Loading..." className="h-16 w-16 mx-auto" />
      <p className="mt-4 text-center">Loading visualization...</p>
    </div>
  ),
})

export default function Home() {
  const [showTable, setShowTable] = useState(false)

  const { data, loading, error } = useCSVData("/data/wiki-resources.csv")

  return (
    <main className="h-screen bg-gray-100 relative font-sans">
      {/* Controls */}
      <div className="fixed top-5 right-5 z-50">
        <button
          onClick={() => setShowTable(!showTable)}
          className="block mb-2 px-4 py-2 bg-white border-2 border-black font-bold font-sans cursor-pointer hover:bg-gray-50"
        >
          Table View
        </button>
      </div>

      {/* Loading/Error States */}
      {loading && (
        <div className="fixed top-1/2 right-5 z-50 bg-white p-3 rounded shadow flex items-center gap-2">
          <p className="text-sm font-sans">Loading CSV...</p>
        </div>
      )}

      {error && (
        <div className="fixed bottom-5 right-5 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="text-sm font-sans">{error}</p>
        </div>
      )}

      {/* P5.js Sketch */}
      <P5Sketch data={data} />

      {/* Table View */}
      {showTable && <TableView data={data} onClose={() => setShowTable(false)} />}
    </main>
  )
}
