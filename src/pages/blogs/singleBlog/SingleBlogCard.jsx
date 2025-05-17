"use client"

import { useEffect, useState } from "react"
import { formatDate } from "../../../utils/formatDate"

// Debug component to show the structure of the content
const DebugContent = ({ content }) => {
  const [showDebug, setShowDebug] = useState(false)

  return (
    <div className="mb-8 border border-orange-300 bg-orange-50 p-4 rounded-lg">
      <button onClick={() => setShowDebug(!showDebug)} className="bg-orange-500 text-white px-4 py-2 rounded mb-4">
        {showDebug ? "Hide" : "Show"} Content Structure
      </button>

      {showDebug && (
        <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-auto max-h-[500px] text-xs">
          {JSON.stringify(content, null, 2)}
        </pre>
      )}

      <div className="text-sm text-orange-800 mt-2">
        <p>If you see this debug panel in production, click the button above to inspect your content structure.</p>
        <p>This will help identify why the lists aren't rendering correctly.</p>
      </div>
    </div>
  )
}

// Extremely simplified list renderer
const SimpleListRenderer = ({ content }) => {
  // Try different ways to access list data
  const renderLists = () => {
    try {
      const elements = []

      // Check if content is an array (direct blocks array)
      if (Array.isArray(content)) {
        content.forEach((block, index) => {
          if (block?.type === "list") {
            elements.push(
              <div key={`list-${index}`} className="border-l-4 border-blue-500 pl-4 my-4">
                <h4 className="font-bold mb-2">List found (array method):</h4>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(block.data, null, 2)}
                </pre>
                {renderListItems(block.data)}
              </div>,
            )
          }
        })
      }

      // Check if content has blocks property
      if (content?.blocks && Array.isArray(content.blocks)) {
        content.blocks.forEach((block, index) => {
          if (block?.type === "list") {
            elements.push(
              <div key={`list-blocks-${index}`} className="border-l-4 border-green-500 pl-4 my-4">
                <h4 className="font-bold mb-2">List found (blocks method):</h4>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(block.data, null, 2)}
                </pre>
                {renderListItems(block.data)}
              </div>,
            )
          }
        })
      }

      // If we found no lists using standard methods, try to find any object that looks like a list
      if (elements.length === 0) {
        const jsonString = JSON.stringify(content)
        if (jsonString.includes('"type":"list"') || jsonString.includes('"type": "list"')) {
          elements.push(
            <div key="list-search" className="border-l-4 border-red-500 pl-4 my-4">
              <h4 className="font-bold mb-2">List found (search method), but couldn't render properly</h4>
              <p>The content contains list data but in an unexpected structure.</p>
            </div>,
          )
        }
      }

      return elements.length > 0 ? (
        elements
      ) : (
        <div className="border-l-4 border-yellow-500 pl-4 my-4">
          <h4 className="font-bold mb-2">No lists found in content</h4>
          <p>The content doesn't appear to contain any list blocks.</p>
        </div>
      )
    } catch (err) {
      console.error("Error rendering lists:", err)
      return (
        <div className="border-l-4 border-red-500 pl-4 my-4">
          <h4 className="font-bold mb-2">Error rendering lists</h4>
          <p>{err.message}</p>
        </div>
      )
    }
  }

  // Try to render list items with multiple fallbacks
  const renderListItems = (data) => {
    try {
      // Check if we have items array
      if (!data || !data.items || !Array.isArray(data.items)) {
        return <p className="text-red-500">No items array found in list data</p>
      }

      const style = data.style === "ordered" ? "decimal" : "disc"
      const ListTag = data.style === "ordered" ? "ol" : "ul"

      return (
        <ListTag className={`list-${style} pl-5 my-4 space-y-1`}>
          {data.items.map((item, i) => {
            let content = "Unknown item format"

            // Try different item formats
            if (typeof item === "string") {
              content = item
            } else if (typeof item === "object") {
              if (item === null) {
                content = "null"
              } else if (item.content) {
                content = item.content
              } else if (item.text) {
                content = item.text
              } else if (item.html) {
                content = item.html
              } else {
                // Last resort - stringify the object
                try {
                  content = JSON.stringify(item)
                } catch (e) {
                  content = "Complex item"
                }
              }
            }

            return (
              <li key={i} className="ml-4 mb-2">
                {content}
              </li>
            )
          })}
        </ListTag>
      )
    } catch (err) {
      console.error("Error rendering list items:", err)
      return <p className="text-red-500">Error: {err.message}</p>
    }
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-8">
      <h3 className="text-xl font-bold mb-4">List Renderer Debug</h3>
      {renderLists()}
    </div>
  )
}

const SingleBlogCard = ({ blog }) => {
  const { title, description, content, coverImg, category, rating, author, createdAt, similarUniversities } = blog || {}
  const [activeSection, setActiveSection] = useState(null)
  const [tocOpen, setTocOpen] = useState(false)
  const [contentType, setContentType] = useState("unknown")

  // Detect content type
  useEffect(() => {
    if (!content) {
      setContentType("empty")
      return
    }

    try {
      if (typeof content === "string") {
        // Try to parse if it's a JSON string
        try {
          const parsed = JSON.parse(content)
          setContentType("json-string")
          console.log("Content is a JSON string:", parsed)
        } catch (e) {
          setContentType("plain-string")
          console.log("Content is a plain string")
        }
      } else if (Array.isArray(content)) {
        setContentType("array")
        console.log("Content is an array with", content.length, "items")
      } else if (typeof content === "object") {
        if (content.blocks && Array.isArray(content.blocks)) {
          setContentType("editorjs-object")
          console.log("Content is an EditorJS object with", content.blocks.length, "blocks")
        } else {
          setContentType("other-object")
          console.log("Content is an object but not in expected EditorJS format")
        }
      } else {
        setContentType(`other-${typeof content}`)
        console.log("Content is of type:", typeof content)
      }
    } catch (err) {
      setContentType("error")
      console.error("Error detecting content type:", err)
    }
  }, [content])

  return (
    <div className="relative">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Main Content */}
        <div className="flex-1 p-3 sm:p-4 lg:p-8 min-h-screen">
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
            {/* Debug information */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-8">
              <h3 className="text-lg font-bold text-blue-800 mb-2">Content Type: {contentType}</h3>
              <p className="text-sm text-blue-700">
                This debug panel shows what type of content structure was detected.
              </p>
            </div>

            {/* Debug content structure */}
            <DebugContent content={content} />

            {/* Simple list renderer */}
            <SimpleListRenderer content={content} />

            {/* Original content rendering - keep this for other content types */}
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700 overflow-x-hidden">
              {/* We'll keep this empty for now to focus on debugging */}
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
