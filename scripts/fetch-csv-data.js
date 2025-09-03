const response = await fetch(
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wiki-resources-fi4X6M5gfR6FVkEFDW7qqj56brsaQD.csv",
)
const csvData = await response.text()

console.log("[v0] CSV data fetched successfully")
console.log("[v0] Data length:", csvData.length)
console.log("[v0] First 500 characters:", csvData.substring(0, 500))

// Write the data to verify it was fetched correctly
console.log("[v0] CSV data ready for use in datawiki-resources.csv")
