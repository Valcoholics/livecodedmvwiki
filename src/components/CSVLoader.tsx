'use client'

import { useState, useCallback } from 'react'
import Papa from 'papaparse'
import { ResourceData } from '@/data/mockData'

interface CSVLoaderProps {
  onDataLoad: (data: ResourceData[]) => void
}

export default function CSVLoader({ onDataLoad }: CSVLoaderProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data as ResourceData[]
          
          // Validate data structure
          const validData = data.filter(row => 
            row.Resource_Name && 
            row.Category && 
            row.Description
          )

          if (validData.length === 0) {
            throw new Error('No valid data found in CSV')
          }

          onDataLoad(validData)
          setLoading(false)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to parse CSV')
          setLoading(false)
        }
      },
      error: (error) => {
        setError(`CSV parsing error: ${error.message}`)
        setLoading(false)
      }
    })
  }, [onDataLoad])

  return (
    <div className="fixed top-5 left-5 z-50 bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200">
      <h3 className="text-sm font-bold mb-2">Load CSV Data</h3>
      
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        disabled={loading}
        className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      
      {loading && (
        <p className="text-xs text-blue-600 mt-2">Loading CSV...</p>
      )}
      
      {error && (
        <p className="text-xs text-red-600 mt-2">{error}</p>
      )}
      
      <p className="text-xs text-gray-500 mt-2">
        Expected columns: Resource_Name, Category, Description, Relevance, Link
      </p>
    </div>
  )
}
