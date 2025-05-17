"use client"

import { useEffect, useState } from "react"
import { formatDate } from "../../../utils/formatDate"
import { ChevronDown, ChevronUp } from "lucide-react"

// Custom renderer for EditorJS blocks
const renderEditorJSBlock = (block) => {
  if (!block || !block.type) return null

  try {
    switch (block.type) {
      case "header":
        const { text, level } = block.data
        const id = text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "")
        return (
          <div key={id} className="mt-6 md:mt-8 mb-3 md:mb-4">
            {level === 1 && (
              <h1 id={id} className="text-3xl md:text-4xl font-semibold text-gray-900">
                {text}
              </h1>
            )}
            {level === 2 && (
              <h2 id={id} className="text-2xl md:text-3xl font-semibold text-blue-800">
                {text}
              </h2>
            )}
            {level === 3 && (
              <h3 id={id} className="text-xl md:text-2xl font-semibold text-indigo-700">
                {text}
              </h3>
            )}
            {level === 4 && (
              <h4 id={id} className="text-lg md:text-xl font-semibold text-gray-800">
                {text}
              </h4>
            )}
            {level === 5 && (
              <h5 id={id} className="text-base md:text-lg font-semibold text-gray-800">
                {text}
              </h5>
            )}
            {level === 6 && (
              <h6 id={id} className="text-sm md:text-base font-semibold text-gray-800">
                {text}
              </h6>
            )}
          </div>
        )

      case "paragraph":
        return (
          <p key={`p-${block.id || Math.random()}`} className="my-4 text-sm md:text-base text-gray-700">
            {block.data.text}
          </p>
        )

      case "list":
        const { style, items } = block.data

        // Render list items based on the exact structure we found
        const renderListItems = (items) => {
          return items.map((item, index) => {
            // Extract content from the item object
            const content = item.content || ""

            return (
              <li key={`list-item-${index}`} className="ml-4 mb-2 text-sm md:text-base">
                {content}
              </li>
            )
          })
        }

        // Render ordered or unordered list
        if (style === "ordered") {
          return (
            <ol
              key={`ol-${block.id || Math.random()}`}
              className="list-decimal pl-5 md:pl-6 my-4 space-y-1 text-gray-700"
            >
              {renderListItems(items)}
            </ol>
          )
        } else {
          return (
            <ul key={`ul-${block.id || Math.random()}`} className="list-disc pl-5 md:pl-6 my-4 space-y-1 text-gray-700">
              {renderListItems(items)}
            </ul>
          )
        }

      case "delimiter":
        return <hr key={`hr-${block.id || Math.random()}`} className="my-8 border-t-2 border-gray-300 shadow-intense" />

      case "table":
        const { content } = block.data
        return (
          <div key={`table-${block.id || Math.random()}`} className="overflow-x-auto my-4">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                {content.map((row, rowIndex) => (
                  <tr key={`row-${rowIndex}`}>
                    {row.map((cell, cellIndex) => {
                      if (rowIndex === 0) {
                        return (
                          <th
                            key={`th-${cellIndex}`}
                            className="px-2 py-1 md:px-4 md:py-2 bg-blue-600 text-white border text-sm md:text-base"
                          >
                            {cell}
                          </th>
                        )
                      }
                      return (
                        <td key={`td-${cellIndex}`} className="px-2 py-1 md:px-4 md:py-2 border text-sm md:text-base">
                          {cell}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      case "embed":
        const { service, source, embed } = block.data
        if (service === "youtube") {
          return (
            <div key={`embed-${block.id || Math.random()}`} className="aspect-w-16 aspect-h-9 mb-6">
              <iframe
                className="w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-xl"
                src={embed}
                frameBorder="0"
                allowFullScreen
              />
            </div>
          )
        }
        return (
          <a
            key={`embed-link-${block.id || Math.random()}`}
            href={source}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {source}
          </a>
        )

      default:
        // For any other block types
        return null
    }
  } catch (err) {
    console.error(`Error rendering block of type ${block.type}:`, err)
    return null
  }
}

const SingleBlogCard = ({ blog }) => {
  const { title, description, content, coverImg, category, rating, author, createdAt, similarUniversities } = blog || {}
  const [activeSection, setActiveSection] = useState(null)
  const [tocOpen, setTocOpen] = useState(false)

  // Extract headings for TOC
  const extractHeadings = () => {
    if (!content || !content.blocks) return []

    return content.blocks
      .filter((block) => block.type === "header")
      .map((block) => {
        const { text, level } = block.data
        const id = text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "")

        return { id, text, level }
      })
  }

  const headings = content?.blocks ? extractHeadings() : []

  useEffect(() => {
    const handleScroll = () => {
      try {
        const sections = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
        let currentSection = ""

        sections.forEach((section) => {
          if (window.scrollY >= section.offsetTop - 120) {
            currentSection = section.id
          }
        })

        setActiveSection(currentSection)
      } catch (err) {
        console.error("Error in scroll handler:", err)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleTOCClick = (e, id) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 100,
        behavior: "smooth",
      })
    }
    // Close mobile TOC after clicking
    if (window.innerWidth < 1024) {
      setTocOpen(false)
    }
  }

  const toggleTOC = () => {
    setTocOpen(!tocOpen)
  }

  // Render TOC items
  const renderTOCItems = () => {
    return headings.map((heading, index) => {
      const animationDelay = `${(index + 1) * 0.2}s`

      return (
        <li
          key={heading.id}
          className={`toc-item mb-2 md:mb-3 ${heading.level >= 3 ? "ml-3 md:ml-4" : ""}`}
          style={{ animationDelay }}
        >
          <a
            href={`#${heading.id}`}
            onClick={(e) => handleTOCClick(e, heading.id)}
            className={`block py-1 px-2 rounded transition-colors text-sm md:text-base ${
              activeSection === heading.id
                ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
                : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
            }`}
          >
            {heading.text}
          </a>
        </li>
      )
    })
  }

  return (
    <div className="relative">
      {/* Mobile TOC Toggle */}
      {headings.length > 0 && (
        <div className="lg:hidden sticky top-0 z-10 bg-white shadow-md p-3">
          <button
            onClick={toggleTOC}
            className="flex items-center justify-between w-full bg-blue-50 text-blue-700 p-3 rounded-lg font-medium"
          >
            <span>Table of Contents</span>
            {tocOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {/* Mobile TOC Content */}
          {tocOpen && (
            <div className="bg-white border border-gray-200 rounded-lg mt-2 p-3 shadow-lg max-h-[60vh] overflow-y-auto">
              <ul className="space-y-1">{renderTOCItems()}</ul>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Desktop Sidebar TOC */}
        {headings.length > 0 && (
          <div className="hidden lg:block lg:w-64 p-4 fixed top-20 left-0 h-[calc(100vh-5rem)] overflow-y-auto animate-toc">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Contents</h3>
            <ul className="space-y-2 text-sm">{renderTOCItems()}</ul>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 p-3 sm:p-4 lg:p-8 ${headings.length > 0 ? "lg:ml-64" : ""} min-h-screen`}>
          <div className="text-center mb-6 lg:mb-8">
            <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-3 lg:mb-4">{title}</h1>
            <p className="text-sm md:text-base text-gray-600 italic">
              {formatDate(createdAt)} by <span className="text-blue-600 hover:underline cursor-pointer">Admin</span>
            </p>
          </div>

          {coverImg && (
            <div className="relative mb-6 lg:mb-8 rounded-xl overflow-hidden shadow-lg">
              <img
                src={coverImg || "/placeholder.svg"}
                alt={title || "Blog cover"}
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-white font-semibold text-sm sm:text-lg bg-black bg-opacity-60 px-2 py-1 sm:px-3 sm:py-1 rounded-md">
                {category}
              </div>
            </div>
          )}

          <div className="space-y-6 lg:space-y-8">
            {/* Render content blocks directly */}
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700 overflow-x-hidden">
              {content?.blocks?.map((block) => renderEditorJSBlock(block))}
            </div>

            {similarUniversities && similarUniversities.length > 0 && (
              <div className="border-t pt-6 lg:pt-8 mt-6 lg:mt-8">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6">Similar Universities</h2>
                {similarUniversities.map((university) => (
                  <div key={university.id} className="bg-gray-50 p-4 lg:p-6 rounded-lg mb-4 lg:mb-6">
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-700 mb-2 lg:mb-3">{university.name}</h3>
                    <p className="text-sm md:text-base text-gray-600">{university.description}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 lg:pt-6 text-base lg:text-lg border-t">
              <span className="font-semibold text-gray-800">Ratings: </span>
              <span className="text-blue-700 font-semibold">{rating}</span>
              <span className="text-gray-500 text-sm md:text-base"> (as evaluated by SpringFallUSA.)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleBlogCard
