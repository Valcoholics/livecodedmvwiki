"use client"

import { useEffect, useRef } from "react"
import p5 from "p5"
import { mockData } from "../data/mockData.js"

interface P5SketchProps {
  data?: any[]
}

export default function P5Sketch({ data: propData }: P5SketchProps) {
  const sketchRef = useRef<HTMLDivElement>(null)
  const p5InstanceRef = useRef<p5 | null>(null)

  const resetCamera = () => {
    if (p5InstanceRef.current) {
      const p = p5InstanceRef.current
      // Reset camera to default position
      p.camera(0, 0, 800, 0, 0, 0, 0, 1, 0)
    }
  }

  useEffect(() => {
    if (!sketchRef.current) return

    const sketch = (p: p5) => {
      let data: any[] = mockData // Start with mock data immediately
      let randomPoint = 0
      const interval = 0.8
      let orbitcontroly = 0
      let boxSz: number
      const x: number[] = []
      const y: number[] = []
      const z: number[] = []
      let openurl = false
      let currenturl = ""
      let interRegular: p5.Font | null = null
      let interBold: p5.Font | null = null

      p.preload = () => {
        console.log("[v0] Starting preload")

        // Try to load fonts, but don't fail if they don't exist
        try {
          interRegular = p.loadFont("/fonts/Inter-Regular.ttf")
          console.log("[v0] Regular font loaded")
        } catch (error) {
          console.warn("[v0] Regular font loading failed:", error)
        }

        try {
          interBold = p.loadFont("/fonts/Inter-Bold.ttf")
          console.log("[v0] Bold font loaded")
        } catch (error) {
          console.warn("[v0] Bold font loading failed:", error)
        }

        // Try to load CSV but don't fail if it doesn't exist
        try {
          const csvData = p.loadTable("/data/wiki-resources.csv", "csv", "header")
          if (csvData) {
            console.log("[v0] CSV data loaded")
          }
        } catch (error) {
          console.warn("[v0] CSV file not found, will use mock data:", error)
        }

        console.log("[v0] Preload completed")
      }

      p.setup = () => {
        console.log("[v0] Starting setup")

        try {
          p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
          console.log("[v0] Canvas created:", p.windowWidth, p.windowHeight)

          p.frameRate(60)
          console.log("[v0] Frame rate set")

          // Use prop data if available
          if (propData && Array.isArray(propData) && propData.length > 0) {
            console.log("[v0] Using data from props:", propData.length, "items")
            data = propData
          } else {
            console.log("[v0] Using mock data:", mockData.length, "items")
            data = mockData
          }

          console.log("[v0] Data set, length:", data.length)

          // Calculate box size safely
          boxSz = Math.max(p.height / 4, 100) // Ensure minimum size
          console.log("[v0] Box size calculated:", boxSz)

          // Set positions for all data points
          console.log("[v0] Setting positions for", data.length, "data points")
          for (let i = 0; i < data.length; i++) {
            console.log("[v0] Processing item", i, ":", data[i]?.Resource_Name)

            const newBox_x = boxSz - p.map(i, 0, data.length - 1, 0, boxSz * 2)
            const relevanceScore = getRelevanceScore(data[i]?.Relevance || "")
            const newBox_y = boxSz - p.map(relevanceScore, 0, 5, 0, boxSz)

            x[i] = newBox_x
            y[i] = newBox_y
            z[i] = p.random(-boxSz, boxSz)

            console.log("[v0] Position set for item", i, ":", { x: x[i], y: y[i], z: z[i] })
          }

          randomPoint = Math.floor(p.random(0, data.length))
          console.log("[v0] Random point set:", randomPoint)

          console.log("[v0] Setup completed successfully")
        } catch (error) {
          console.error("[v0] Error in setup:", error)
        }
      }

      p.draw = () => {
        try {
          p.background(241)
          orbitcontroly = p.frameCount * 0.01

          if (!Array.isArray(data) || data.length === 0) {
            console.warn("[v0] No valid data in draw")
            return
          }

          // Get random point every interval
          if (p.frameCount % (interval * 100) === 0) {
            randomPoint = Math.floor(p.random(0, data.length))
          }

          // Draw wireframe container box
          p.noFill()
          p.orbitControl(1, 1, 0.5, { minDistance: 800 , maxDistance: 1500 })
          p.rotateY(orbitcontroly)
          p.stroke(0)
          p.strokeWeight(1)
          p.box(boxSz * 2)

          drawGrid(p, boxSz)

          // Draw all data points
          for (let i = 0; i < data.length; i++) {
            p.push()
            p.translate(x[i] || 0, y[i] || 0, z[i] || 0)

            const color = getCategoryColor(data[i]?.Category || "")
            p.fill(color[0], color[1], color[2])
            p.noStroke()

            if (i === randomPoint) {
              p.sphere(10)
            } else {
              p.box(3)
            }
            p.pop()
          }

          // Draw info card
          if (data && data.length > 0 && randomPoint >= 0 && randomPoint < data.length && data[randomPoint]) {
            p.push()
            p.resetMatrix()
            p.camera(0, 0, 800, 0, 0, 0, 0, 1, 0)

            const item = data[randomPoint]
            drawCard(p, -p.width / 2, p.height / 2 - 100, item)
            p.pop()

            // Check mouse hover for link
            if (p.mouseX > 0 && p.mouseX < p.width / 2 && p.mouseY > p.height - 60 && p.mouseY < p.height) {
              p.cursor(p.HAND)
              openurl = true
              currenturl = item?.Link || ""
            } else {
              p.cursor(p.ARROW)
              openurl = false
            }
          }
        } catch (error) {
          console.error("[v0] Error in draw:", error)
        }
      }

      p.mouseClicked = () => {
        if (openurl && currenturl && currenturl !== "[link]") {
          window.open(currenturl)
        }
      }

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight)
      }

      function drawGrid(p: p5, boxSz: number) {
        p.stroke(200)
        p.strokeWeight(0.3)

        for (let j = 0; j < boxSz * 2; j += boxSz / 5) {
          for (let k = 0; k < boxSz * 2; k += boxSz / 5) {
            p.push()
            p.translate(-boxSz, boxSz, -boxSz)
            p.rotateX(p.PI / 2)
            p.line(k, 0, k, boxSz * 2)
            p.line(0, j, boxSz * 2, j)
            p.pop()
          }
        }
      }

      function drawCard(p: p5, xloc: number, yloc: number, item: any) {
        if (!item) return

        const resourceName = item.Resource_Name || "Unknown Resource"
        const category = item.Category || "Unknown Category"
        const description = item.Description || "No description available"
        const relevance = item.Relevance || "Unknown"
        const link = item.Link || ""

        // Use default font if custom fonts failed to load
        if (interBold) {
          p.textFont(interBold)
        }
        p.textSize(16)
        const nameWidth = p.textWidth(resourceName)

        // Calculate card width based only on resource name with padding
        const cardWidth = Math.max(nameWidth + 40, 240)
        const cardHeight = 170

        let adjustedX = xloc
        let adjustedY = yloc

        // Boundary checks
        if (adjustedX + cardWidth > p.width / 2) {
          adjustedX = p.width / 2 - cardWidth - 20
        }
        if (adjustedX < -p.width / 2) {
          adjustedX = -p.width / 2 + 20
        }
        if (adjustedY + cardHeight > p.height / 2) {
          adjustedY = p.height / 2 - cardHeight - 20
        }
        if (adjustedY < -p.height / 2) {
          adjustedY = -p.height / 2 + 20
        }

        // White card with border
        p.fill(255, 255, 255, 240)
        p.stroke(200)
        p.strokeWeight(1)
        p.rect(adjustedX, adjustedY, cardWidth, cardHeight)

        p.noStroke()
        p.textAlign(p.LEFT)

        // Resource name
        if (interBold) p.textFont(interBold)
        p.fill(0, 0, 0, 255)
        p.textSize(16)
        p.text(resourceName, adjustedX + 20, adjustedY + 30)

        // Category
        if (interRegular) p.textFont(interRegular)
        p.fill(100, 100, 100, 255)
        p.textSize(12)
        p.text(category, adjustedX + 20, adjustedY + 50)

        // Description
        if (interRegular) p.textFont(interRegular)
        p.fill(60, 60, 60, 255)
        p.textSize(10)
        p.text(description, adjustedX + 20, adjustedY + 70, cardWidth - 40, 60)

        // Relevance
        if (interRegular) p.textFont(interRegular)
        p.fill(120, 120, 120, 255)
        p.textSize(9)
        p.text("Relevance: " + relevance, adjustedX + 20, adjustedY + 125, cardWidth - 40, 30)

        // Link
        if (link && link !== "[link]") {
          if (interRegular) p.textFont(interRegular)
          p.fill(0, 100, 200, 255)
          p.text("Click to visit →", adjustedX + 20, adjustedY + 155)
        }
      }

      function getRelevanceScore(relevanceText: string): number {
        if (!relevanceText) return 1

        const text = relevanceText.toLowerCase()
        if (text.includes("high") || text.includes("core") || text.includes("essential")) return 5
        if (text.includes("important") || text.includes("key")) return 4
        if (text.includes("medium") || text.includes("useful") || text.includes("helpful")) return 3
        if (text.includes("low") || text.includes("supplementary") || text.includes("additional")) return 2
        return 1
      }

      function getCategoryColor(category: string): [number, number, number] {
        const categoryColors: { [key: string]: [number, number, number] } = {
          "Global Community": [255, 100, 100],
          "Cultural Heritage": [100, 255, 100],
          "Education/Pedagogy": [100, 100, 255],
          "Tools & Resources": [255, 255, 100],
          "Performance Venues": [100, 255, 255],
          "Regional Events": [255, 150, 50],
          "Arts Organizations": [180, 100, 255],
          "Community Spaces": [255, 100, 200],
          "Representation & Equity": [200, 50, 150],
          "Local Community": [50, 200, 200],
          "Professional Networks": [150, 150, 150],
          Tool: [100, 150, 255],
          Community: [255, 150, 100],
          Venue: [150, 255, 150],
        }

        return categoryColors[category] || [150, 150, 150]
      }
    }

    // Create p5 instance
    p5InstanceRef.current = new p5(sketch, sketchRef.current)

    // Cleanup and recreate when data changes
    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove()
        p5InstanceRef.current = null
      }
    }
  }, [propData])

  return (
    <div className="relative w-full h-full">
      <div ref={sketchRef} className="w-full h-full" />
      <button
        onClick={resetCamera}
        className="fixed top-20 right-5 z-40 px-4 py-2 bg-white border-2 border-black font-bold cursor-pointer hover:bg-gray-50"
      >
        Reset View
      </button>
    </div>
  )
}
