"use client"

import { useState, useEffect } from "react"
import Papa from "papaparse"

export interface ResourceData {
  Resource_Name: string
  Category: string
  Sub_Category?: string
  Location_Scope?: string
  Description: string
  Relevance: string
  Link: string
  "Access type"?: string
}

export function useCSVData(csvPath: string) {
  const [data, setData] = useState<ResourceData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCSV = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(csvPath)
        if (!response.ok) {
          throw new Error(`Failed to fetch CSV: ${response.statusText}`)
        }

        const csvText = await response.text()

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            try {
              const parsedData = results.data as ResourceData[]

              const validData = parsedData
                .filter((row) => row.Resource_Name && row.Category && row.Description)
                .map((row) => ({
                  Resource_Name: row.Resource_Name || "",
                  Category: row.Category || "",
                  Sub_Category: row.Sub_Category || "",
                  Location_Scope: row.Location_Scope || "",
                  Description: row.Description || "",
                  Relevance: row.Relevance || "",
                  Link: row.Link || "",
                  "Access type": row["Access type"] || "",
                }))

              setData(validData)
              console.log(`Loaded ${validData.length} resources from CSV`)
              setLoading(false)
            } catch (err) {
              console.error("Error processing CSV data:", err)
              setError("Failed to process CSV data")
              setLoading(false)
            }
          },
          error: (error) => {
            console.error("Papa Parse error:", error)
            setError(`CSV parsing error: ${error.message}`)
            setLoading(false)
          },
        })
      } catch (err) {
        console.error("Error loading CSV:", err)
        setError(err instanceof Error ? err.message : "Failed to load CSV")
        setLoading(false)
      }
    }

    loadCSV()
  }, [csvPath])

  return { data, loading, error }
}
