// Script to fetch and save wiki resources CSV data
const fs = require("fs")
const path = require("path")

async function fetchWikiResources() {
  try {
    console.log("[v0] Fetching wiki resources CSV data...")

    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wiki-resources-sFSvGhl52i1D887RCiZ4bugZgvQtZ1.csv",
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const csvData = await response.text()
    console.log("[v0] CSV data fetched successfully")
    console.log("[v0] Data preview:", csvData.substring(0, 200) + "...")

    // Create public/data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "public", "data")
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
      console.log("[v0] Created public/data directory")
    }

    // Write CSV file
    const filePath = path.join(dataDir, "wiki-resources.csv")
    fs.writeFileSync(filePath, csvData)
    console.log("[v0] Wiki resources CSV saved to public/data/wiki-resources.csv")

    // Parse and display first few rows for verification
    const lines = csvData.split("\n")
    console.log("[v0] Total rows:", lines.length)
    console.log("[v0] Header:", lines[0])
    if (lines.length > 1) {
      console.log("[v0] First data row:", lines[1])
    }
  } catch (error) {
    console.error("[v0] Error fetching wiki resources:", error)
  }
}

fetchWikiResources()
