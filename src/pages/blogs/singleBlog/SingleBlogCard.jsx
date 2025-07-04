"use client"

import { useEffect, useState } from "react"
import { formatDate } from "../../../utils/formatDate"
import EditorJSHTML from "editorjs-html"

const customParsers = {
  delimiter: () => '<hr class="my-8 border-t border-amber-300/30" />',

  embed: (block) => {
    const { service, source, embed } = block.data
    if (service === "youtube") {
      return `<div class="my-8 bg-white rounded-2xl p-6 shadow-sm border border-amber-200/50">
                <div class="aspect-video rounded-xl overflow-hidden bg-gray-100">
                  <iframe class="w-full h-full" src="${embed}" frameborder="0" allowfullscreen></iframe>
                </div>
                <p class="mt-4 text-sm text-gray-600 text-center font-medium">Educational Video Content</p>
              </div>`
    }
    return `<a href="${source}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-amber-600 underline decoration-2 underline-offset-4 transition-colors font-medium">${source}</a>`
  },

  table: (block) => {
    const { content } = block.data
    const tableRows = content
      .map((row, rowIndex) => {
        const tableCells = row
          .map((cell) => {
            if (rowIndex === 0) {
              return `<th class="px-6 py-4 bg-gray-900 text-white text-sm font-semibold text-left">${cell}</th>`
            }
            return `<td class="px-6 py-4 border-b border-gray-100 text-gray-700">${cell}</td>`
          })
          .join("")
        return `<tr class="hover:bg-amber-50/50 transition-colors">${tableCells}</tr>`
      })
      .join("")
    return `<div class="my-8 overflow-hidden rounded-2xl shadow-sm border border-amber-200/50">
              <table class="w-full bg-white">
                ${tableRows}
              </table>
            </div>`
  },

  header: (block) => {
    const { text, level } = block.data
    const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")
    
    const headerClasses = {
      1: "text-4xl font-bold text-gray-900 mt-16 mb-8 pb-4 border-b-2 border-amber-400",
      2: "text-3xl font-semibold text-gray-800 mt-12 mb-6",
      3: "text-2xl font-medium text-gray-800 mt-10 mb-5",
      4: "text-xl font-medium text-gray-700 mt-8 mb-4",
      5: "text-lg font-medium text-gray-700 mt-6 mb-3",
      6: "text-base font-medium text-gray-600 mt-5 mb-2",
    }
    return `<h${level} id="${id}" class="${headerClasses[level] || headerClasses[6]} scroll-mt-24">${text}</h${level}>`
  },

  quote: (block) => {
    const { text } = block.data
    return `<blockquote class="my-8 bg-gradient-to-r from-blue-50 to-amber-50 border-l-4 border-blue-500 rounded-r-2xl p-8 relative">
              <div class="absolute top-4 left-4 text-blue-400 text-3xl opacity-50">"</div>
              <p class="text-gray-700 text-lg leading-relaxed italic pl-8">${text}</p>
              <footer class="mt-4 text-sm text-gray-500 pl-8">— Academic Source</footer>
            </blockquote>`
  },
}

const editorJSHTML = EditorJSHTML(customParsers)

const SingleBlogCard = ({ blog }) => {
  const { title, description, content, coverImg, category, rating, author, createdAt, similarUniversities } = blog || {}
  const [activeSection, setActiveSection] = useState(null)
  const [isTocOpen, setIsTocOpen] = useState(false)
  const [isRelatedOpen, setIsRelatedOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const parsedContent = editorJSHTML.parse(content)
  const htmlContent = Array.isArray(parsedContent) ? parsedContent.join("") : parsedContent

  const generateTOC = (content) => {
    const headings = content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/g)
    if (!headings) return []

    return headings
      .map((heading, index) => {
        const title = heading.replace(/<[^>]*>/g, "")
        const id = heading.match(/id="([^"]*)"/)?.[1]
        const level = Number.parseInt(heading.match(/<h([1-6])/)?.[1])
        if (!id) return null

        return {
          id,
          title,
          level,
          index
        }
      })
      .filter(Boolean)
  }

  const tocItems = generateTOC(htmlContent)

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
      let currentSection = ""

      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 150) {
          currentSection = section.id
        }
      })

      setActiveSection(currentSection)
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleTOCClick = (e, id) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 120,
        behavior: "smooth",
      })
    }
    setIsTocOpen(false)
  }

  return (
    <div className="min-h-screen bg-amber-50/30" style={{ backgroundColor: "#FFFBEB" }}>
      {/* Modern Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-amber-200/50"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsTocOpen(!isTocOpen)}
              className="lg:hidden p-2 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-200 border border-amber-200/50"
              aria-label="Toggle navigation"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">🎓</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SpringFallUSA</h1>
                <p className="text-xs text-gray-600 -mt-1">Academic Excellence</p>
              </div>
            </div>

            {/* Mobile Related Button */}
            <button
              onClick={() => setIsRelatedOpen(!isRelatedOpen)}
              className="lg:hidden p-2 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-200 border border-amber-200/50"
              aria-label="Toggle related content"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile TOC Overlay */}
      {isTocOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsTocOpen(false)}>
          <div className="bg-white w-80 h-full shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-amber-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Contents</h3>
                <button
                  onClick={() => setIsTocOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <nav className="p-6">
              {tocItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleTOCClick(e, item.id)}
                  className={`block py-3 px-4 rounded-xl transition-all duration-200 ${
                    item.level > 1 ? `ml-${(item.level - 1) * 4}` : ""
                  } ${
                    activeSection === item.id
                      ? "bg-blue-100 text-blue-900 font-semibold border-l-4 border-amber-500"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-amber-600">
                      {item.level === 1 ? "📖" : item.level === 2 ? "📄" : "•"}
                    </span>
                    <span>{item.title}</span>
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Related Overlay */}
      {isRelatedOpen && similarUniversities && similarUniversities.length > 0 && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsRelatedOpen(false)}>
          <div className="bg-white w-80 h-full shadow-2xl overflow-y-auto ml-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-blue-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Related</h3>
                <button
                  onClick={() => setIsRelatedOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {similarUniversities.map((university) => (
                <div
                  key={university.id}
                  className="bg-gradient-to-br from-white to-amber-50/50 p-4 rounded-2xl border border-amber-200/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm">🏛️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                        {university.name}
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {university.description?.substring(0, 80)}...
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Desktop TOC Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-lg border border-amber-200/50 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-amber-50 px-6 py-4 border-b border-amber-200/50">
                  <h3 className="font-bold text-gray-900 flex items-center space-x-2">
                    <span>📚</span>
                    <span>Table of Contents</span>
                  </h3>
                </div>
                <nav className="p-6 max-h-96 overflow-y-auto">
                  {tocItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => handleTOCClick(e, item.id)}
                      className={`block py-3 px-4 rounded-xl transition-all duration-200 mb-2 ${
                        item.level > 1 ? `ml-${(item.level - 1) * 4}` : ""
                      } ${
                        activeSection === item.id
                          ? "bg-blue-100 text-blue-900 font-semibold border-l-4 border-amber-500 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-700"
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span className="text-amber-600 text-sm">
                          {item.level === 1 ? "📖" : item.level === 2 ? "📄" : "•"}
                        </span>
                        <span className="text-sm leading-tight">{item.title}</span>
                      </span>
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-6">
            <article className="bg-white rounded-2xl shadow-lg border border-amber-200/50 overflow-hidden">
              {/* Article Header */}
              <header className="px-8 py-12 bg-gradient-to-br from-white via-blue-50/30 to-amber-50/30">
                <div className="text-center">
                  <div className="mb-6">
                    <span className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-blue-700 rounded-full text-sm font-semibold border border-blue-200/50 shadow-sm">
                      <span>🏆</span>
                      <span>{category}</span>
                    </span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {title}
                  </h1>
                  <div className="flex items-center justify-center space-x-4 text-gray-600 flex-wrap">
                    <time className="text-sm font-medium">{formatDate(createdAt)}</time>
                    <span className="text-amber-500">•</span>
                    <span className="text-sm font-medium text-blue-600 hover:text-amber-600 transition-colors cursor-pointer">
                      By {author || "SpringFallUSA Editorial"}
                    </span>
                  </div>
                </div>
              </header>

              {/* Cover Image */}
              {coverImg && (
                <div className="px-8 py-6">
                  <figure className="relative">
                    <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
                      <img
                        src={coverImg || "/placeholder.svg"}
                        alt="Article cover"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <figcaption className="mt-4 text-center text-sm text-gray-600 italic">
                      Featured illustration: "{title}"
                    </figcaption>
                  </figure>
                </div>
              )}

              {/* Article Content */}
              <div className="px-8 py-6">
                <div
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                />
              </div>

              {/* Rating Section */}
              {rating && (
                <footer className="px-8 py-6 border-t border-gray-100 bg-gradient-to-r from-blue-50/50 to-amber-50/50">
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl border border-amber-200/50 shadow-sm">
                      <span className="text-2xl">🏆</span>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Academic Rating</p>
                        <p className="text-2xl font-bold text-amber-600">{rating}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-gray-500 italic">
                      Evaluated by SpringFallUSA Academic Review Board
                    </p>
                  </div>
                </footer>
              )}
            </article>
          </main>

          {/* Desktop Related Sidebar */}
          {similarUniversities && similarUniversities.length > 0 && (
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24">
                <div className="bg-white rounded-2xl shadow-lg border border-amber-200/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-50 to-blue-50 px-6 py-4 border-b border-amber-200/50">
                    <h3 className="font-bold text-gray-900 flex items-center space-x-2">
                      <span>🏛️</span>
                      <span>Related Institutions</span>
                    </h3>
                  </div>
                  <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                    {similarUniversities.map((university) => (
                      <div
                        key={university.id}
                        className="group bg-gradient-to-br from-white to-amber-50/30 p-4 rounded-2xl border border-amber-200/30 hover:shadow-lg hover:border-blue-200/50 transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                            <span className="text-blue-600 text-lg">🎓</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-2 group-hover:text-blue-700 transition-colors">
                              {university.name}
                            </h4>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {university.description?.substring(0, 100)}...
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', system-ui, sans-serif;
        }
        
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          font-family: 'Inter', system-ui, sans-serif;
          font-weight: 700;
        }
        
        .prose p {
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }
        
        .prose ul, .prose ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }
        
        .prose li {
          margin-bottom: 0.5rem;
          line-height: 1.7;
        }
        
        .prose a {
          color: #2563eb;
          text-decoration: underline;
          text-decoration-color: #f59e0b;
          text-underline-offset: 4px;
          transition: all 0.2s ease;
        }
        
        .prose a:hover {
          color: #f59e0b;
          text-decoration-color: #2563eb;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #fef3c7;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #f59e0b;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #d97706;
        }
      `}</style>
    </div>
  )
}

export default SingleBlogCard
