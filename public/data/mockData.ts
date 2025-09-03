export interface ResourceData {
  Resource_Name: string
  Category: string
  Description: string
  Relevance: string
  Link: string
}

export const mockData: ResourceData[] = [
  {
    Resource_Name: "Processing",
    Category: "Tool",
    Description:
      "A flexible software sketchbook and a language for learning how to code within the context of the visual arts",
    Relevance: "High",
    Link: "https://processing.org",
  },
  {
    Resource_Name: "p5.js",
    Category: "Tool",
    Description:
      "A JavaScript library for creative coding, with a focus on making coding accessible and inclusive for artists, designers, educators, beginners",
    Relevance: "High",
    Link: "https://p5js.org",
  },
  {
    Resource_Name: "openFrameworks",
    Category: "Tool",
    Description: "An open source C++ toolkit for creative coding",
    Relevance: "Medium",
    Link: "https://openframeworks.cc",
  },
  {
    Resource_Name: "Creative Code Collective",
    Category: "Community",
    Description: "A community of artists, designers, and developers interested in creative coding",
    Relevance: "High",
    Link: "https://creativecode.org",
  },
  {
    Resource_Name: "The Kennedy Center",
    Category: "Venue",
    Description: "National cultural center with digital arts programming and live coding events",
    Relevance: "Medium",
    Link: "https://kennedy-center.org",
  },
  {
    Resource_Name: "Smithsonian Arts + Industries",
    Category: "Venue",
    Description: "Museum space featuring interactive digital art installations and workshops",
    Relevance: "Medium",
    Link: "https://aibuilding.si.edu",
  },
]
