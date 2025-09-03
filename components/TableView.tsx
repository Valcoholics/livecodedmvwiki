"use client"

import { useState, useMemo } from "react"
import type { ResourceData } from "../hooks/useCSVData"

interface TableViewProps {
  data: ResourceData[]
  onClose: () => void
}

type SortField = "Resource_Name" | "Category" | "Location_Scope" | "none"
type SortDirection = "asc" | "desc"

export default function TableView({ data, onClose }: TableViewProps) {
  const [sortField, setSortField] = useState<SortField>("none")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const sortedData = useMemo(() => {
    if (sortField === "none") return data

    return [...data].sort((a, b) => {
      const aValue = a[sortField] || ""
      const bValue = b[sortField] || ""

      const comparison = aValue.localeCompare(bValue)
      return sortDirection === "asc" ? comparison : -comparison
    })
  }, [data, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return ""
    return sortDirection === "asc" ? " ↑" : " ↓"
  }

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-95 z-40 p-10 overflow-auto font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold font-sans">LiveCodeDMV Resources</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border-2 border-black font-bold font-sans hover:bg-gray-50"
          >
            Close ✕
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 mr-2 font-sans">Sort by:</span>
          <button
            onClick={() => {
              setSortField("none")
              setSortDirection("asc")
            }}
            className={`px-3 py-1 text-xs rounded font-bold font-sans ${sortField === "none" ? "bg-black text-white" : "bg-white border border-gray-300 hover:bg-gray-50"}`}
          >
            Default
          </button>
          <button
            onClick={() => handleSort("Category")}
            className={`px-3 py-1 text-xs rounded font-bold font-sans ${sortField === "Category" ? "bg-black text-white" : "bg-white border border-gray-300 hover:bg-gray-50"}`}
          >
            Category{getSortIndicator("Category")}
          </button>
          <button
            onClick={() => handleSort("Location_Scope")}
            className={`px-3 py-1 text-xs rounded font-bold font-sans ${sortField === "Location_Scope" ? "bg-black text-white" : "bg-white border border-gray-300 hover:bg-gray-50"}`}
          >
            Location{getSortIndicator("Location_Scope")}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed max-w-6xl font-sans">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-40 font-sans">
                    Resource Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-32 font-sans">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-80 font-sans">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-28 font-sans">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-20 font-sans">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-bold text-black break-words font-sans">
                      {item.Resource_Name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-sans">
                      <span
                        className={`px-2 py-1 text-xs font-bold rounded-full font-sans ${getCategoryStyle(item.Category)}`}
                      >
                        {item.Category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 break-words font-sans">{item.Description}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 break-words font-sans">{item.Location_Scope}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-sans">
                      {item.Link && item.Link !== "[link]" ? (
                        <a
                          href={item.Link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline font-sans"
                        >
                          Visit →
                        </a>
                      ) : (
                        <span className="text-gray-400 font-sans">No link</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function getCategoryStyle(category: string): string {
  const styles: { [key: string]: string } = {
    "Global Community": "bg-red-100 text-red-800",
    "Cultural Heritage": "bg-green-100 text-green-800",
    "Education/Pedagogy": "bg-blue-100 text-blue-800",
    "Tools & Resources": "bg-yellow-100 text-yellow-800",
    "Performance Venues": "bg-cyan-100 text-cyan-800",
    "Regional Events": "bg-orange-100 text-orange-800",
    "Arts Organizations": "bg-purple-100 text-purple-800",
    "Community Spaces": "bg-pink-100 text-pink-800",
    "Representation & Equity": "bg-indigo-100 text-indigo-800",
    "Local Community": "bg-teal-100 text-teal-800",
    "Professional Networks": "bg-gray-100 text-gray-800",
  }

  return styles[category] || "bg-gray-100 text-gray-800"
}
