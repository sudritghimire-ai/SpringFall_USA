"use client"

import { useEffect, useState } from "react"
import { formatDate } from "../../../utils/formatDate"
import EditorJSHTML from "editorjs-html"

const customParsers = {
  delimiter: () => '<hr class="my-8 border-t-2 border-amber-200 opacity-60" />',

  embed: (block) => {
    const { service, source, embed } = block.data
    if (service === "youtube") {
      return `<figure class="my-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div class="aspect-video rounded-lg overflow-hidden border border-gray-300">
                  <iframe class="w-full h-full" src="${embed}" frameborder="0" allowfullscreen></iframe>
                </div>
                <figcaption class="mt-3 text-sm text-gray-600 italic font-serif-academic text-center">Educational Video Content</figcaption>
              </figure>`
    }
    return `<a href="${source}" target="_blank" rel="noopener noreferrer" class="text-blue-800 hover:text-amber-600 underline decoration-2 underline-offset-2 transition-colors">${source}</a>`
  },

  table: (block) => {
    const { content } = block.data
    const tableRows = content
      .map((row, rowIndex) => {
        const tableCells = row
          .map((cell) => {
            if (rowIndex === 0) {
              return `<th class="px-6 py-4 bg-slate-800 text-white border border-gray-300 font-serif-academic text-sm font-semibold tracking-wide">${cell}</th>`
            }
            return `<td class="px-6 py-4 border border-gray-300 text-gray-700 font-outfit">${cell}</td>`
          })
          .join("")
        return `<tr class="even:bg-gray-50 hover:bg-blue-50 transition-colors">${tableCells}</tr>`
      })
      .join("")
    return `<div class="my-8 overflow-x-auto">
              <table class="w-full border-collapse border border-gray-300 shadow-md rounded-xl overflow-hidden bg-white">
                ${tableRows}
              </table>
            </div>`
  },

  header: (block) => {
    const { text, level } = block.data
    const id = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")

    const headerClasses = {
      1: "text-4xl font-serif-academic font-bold text-slate-800 mt-12 mb-6 pb-4 border-b-2 border-amber-600",
      2: "text-3xl font-serif-academic font-semibold text-blue-900 mt-10 mb-5",
      3: "text-2xl font-serif-academic font-medium text-blue-800 mt-8 mb-4",
      4: "text-xl font-serif-academic font-medium text-gray-800 mt-6 mb-3",
      5: "text-lg font-serif-academic font-medium text-gray-700 mt-5 mb-3",
      6: "text-base font-serif-academic font-medium text-gray-600 mt-4 mb-2",
    }
    return `<h${level} id="${id}" class="${headerClasses[level] || headerClasses[6]} scroll-mt-24">${text}</h${level}>`
  },

  quote: (block) => {
    const { text } = block.data
    return `<blockquote class="my-8 pl-8 pr-6 py-6 bg-blue-50 border-l-4 border-blue-800 rounded-r-xl shadow-sm relative">
              <div class="absolute top-4 left-4 text-blue-300 text-2xl">"</div>
              <p class="text-gray-700 italic font-serif-academic text-lg leading-relaxed ml-4">${text}</p>
              <footer class="mt-4 text-sm text-gray-600 font-outfit ml-4">— Academic Source</footer>
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

        const indentClass = level > 2 ? "ml-8" : level > 1 ? "ml-4" : ""

        return (
          <li key={id} className={`toc-item mb-2 ${indentClass}`} style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
            <a
              href={`#${id}`}
              onClick={(e) => handleTOCClick(e, id)}
              className={`flex items-center gap-2 py-2.5 px-3 rounded-lg transition-all duration-200 text-sm font-outfit group ${
                activeSection === id
                  ? "bg-blue-100 text-blue-900 border-l-4 border-amber-600 shadow-sm font-medium"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-800 hover:shadow-sm"
              }`}
            >
              <span className="text-amber-600 opacity-70 group-hover:opacity-100 transition-opacity text-sm">
                {level === 1 ? "📖" : level === 2 ? "📄" : "•"}
              </span>
              <span className="leading-tight">{title}</span>
            </a>
          </li>
        )
      })
      .filter(Boolean)
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
      let currentSection = ""

      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 200) {
          currentSection = section.id
        }
      })

      setActiveSection(currentSection)
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleTOCClick = (e, id) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 140,
        behavior: "smooth",
      })
    }
    setIsTocOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-stone-50" style={{ backgroundColor: "#fefdf8" }}>
      {/* Fixed Header Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
            : "bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-sm"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          {/* Left: Hamburger Menu (Mobile Only) */}
          <div className="flex items-center xl:w-20">
            <button
              onClick={() => setIsTocOpen(!isTocOpen)}
              className="xl:hidden bg-white/80 hover:bg-white shadow-md hover:shadow-lg rounded-xl p-2.5 border border-gray-200 hover:border-blue-200 transition-all duration-200"
              aria-label="Toggle Table of Contents"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Center: SpringFallUSA Brand */}
          <div className="flex items-center justify-center flex-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-800 to-amber-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white text-sm">🎓</span>
              </div>
              <div className="text-center">
                <h1 className="text-lg font-serif-academic font-bold text-slate-800 tracking-wide">SpringFallUSA</h1>
                <p className="text-xs text-gray-600 font-outfit -mt-1">Academic Resources</p>
              </div>
            </div>
          </div>

          {/* Right: Related Menu (Mobile Only) */}
          <div className="flex items-center xl:w-20 justify-end">
            {similarUniversities && similarUniversities.length > 0 && (
              <button
                onClick={() => setIsRelatedOpen(!isRelatedOpen)}
                className="xl:hidden bg-white/80 hover:bg-white shadow-md hover:shadow-lg rounded-xl p-2.5 border border-gray-200 hover:border-blue-200 transition-all duration-200"
                aria-label="Toggle Related Institutions"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile TOC Overlay */}
      {isTocOpen && (
        <div
          className="xl:hidden fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setIsTocOpen(false)}
        >
          <div className="bg-white w-80 h-full shadow-2xl overflow-y-auto mt-16" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-amber-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎓</span>
                  <h3 className="text-lg font-serif-academic font-bold text-slate-800">Table of Contents</h3>
                </div>
                <button
                  onClick={() => setIsTocOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 transition-colors"
                  aria-label="Close Table of Contents"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-1">{generateTOC(htmlContent)}</ul>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Related Overlay */}
      {isRelatedOpen && similarUniversities && similarUniversities.length > 0 && (
        <div
          className="xl:hidden fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setIsRelatedOpen(false)}
        >
          <div
            className="bg-white w-80 h-full shadow-2xl overflow-y-auto mt-16 ml-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-blue-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏛️</span>
                  <h3 className="text-lg font-serif-academic font-bold text-slate-800">Related Institutions</h3>
                </div>
                <button
                  onClick={() => setIsRelatedOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 transition-colors"
                  aria-label="Close Related Institutions"
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
                  className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-transparent border border-blue-200 rounded-lg flex items-center justify-center group-hover:border-amber-400 transition-colors">
                      <span className="text-blue-800 text-lg">🎓</span>
                    </div>
                    <h3 className="text-lg font-serif-academic font-semibold text-blue-900 leading-tight">
                      {university.name}
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed font-outfit text-sm">{university.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* CSS Grid Layout - 12 columns */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Column - Table of Contents (3 columns on desktop) */}
            <aside className="hidden xl:block xl:col-span-3">
              <div className="sticky top-24">
                <div className="bg-white rounded-2xl shadow-lg border border-amber-200/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-amber-50 px-6 py-4 border-b border-amber-200/50">
                    <h3 className="font-bold text-gray-900 flex items-center space-x-2">
                      <span>📚</span>
                      <span>Table of Contents</span>
                    </h3>
                  </div>
                  <nav className="p-6 max-h-96 overflow-y-auto">
                    <ul className="space-y-1">{generateTOC(htmlContent)}</ul>
                  </nav>
                </div>
              </div>
            </aside>

            {/* Center Column - Main Content (6 columns on desktop) */}
            <main className="xl:col-span-6">
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
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-academic font-bold text-slate-800 mb-6 leading-tight">
                      {title}
                    </h1>
                    <div className="flex items-center justify-center space-x-4 text-gray-600 font-outfit flex-wrap">
                      <time className="font-serif-academic italic text-sm">{formatDate(createdAt)}</time>
                      <span className="text-amber-600 hidden sm:inline">•</span>
                      <span className="text-blue-800 hover:text-amber-600 cursor-pointer font-medium text-sm">
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
                      <figcaption className="mt-4 text-center text-sm text-gray-600 italic font-serif-academic">
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

            {/* Right Column - Related Institutions (3 columns on desktop) */}
            {similarUniversities && similarUniversities.length > 0 && (
              <aside className="hidden xl:block xl:col-span-3">
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

          {/* Mobile Related Institutions Section - Below main content */}
          {similarUniversities && similarUniversities.length > 0 && (
            <section className="xl:hidden mt-8">
              <div className="bg-white rounded-2xl shadow-lg border border-amber-200/50 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-50 to-blue-50 px-6 py-4 border-b border-amber-200/50">
                  <h3 className="font-bold text-gray-900 flex items-center space-x-2">
                    <span>🏛️</span>
                    <span>Related Institutions</span>
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {similarUniversities.map((university) => (
                      <div
                        key={university.id}
                        className="group bg-gradient-to-br from-white to-amber-50/30 p-6 rounded-2xl border border-amber-200/30 hover:shadow-lg hover:border-blue-200/50 transition-all duration-300"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                            <span className="text-blue-600 text-lg">🎓</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 leading-tight mb-2 group-hover:text-blue-700 transition-colors">
                              {university.name}
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{university.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
        
        .font-outfit { font-family: 'Outfit', system-ui, sans-serif; }
        .font-serif-academic { font-family: 'EB Garamond', Georgia, 'Times New Roman', serif; }
        
        .academic-content {
          font-family: 'Outfit', system-ui, sans-serif;
          line-height: 1.8;
        }
        
        .academic-content h1, .academic-content h2, .academic-content h3,
        .academic-content h4, .academic-content h5, .academic-content h6 {
          font-family: 'EB Garamond', Georgia, 'Times New Roman', serif;
        }
        
        .academic-content p {
          margin-bottom: 1.5rem;
          text-align: justify;
          hyphens: auto;
        }
        
        .academic-content ul, .academic-content ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }
        
        .academic-content li {
          margin-bottom: 0.75rem;
          line-height: 1.7;
        }
        
        .academic-content img {
          margin: 2rem auto;
          border-radius: 12px;
          box-shadow: none;
          border: none;
        }
        
        .academic-content a {
          color: #1e40af;
          text-decoration: underline;
          text-decoration-color: #d97706;
          text-underline-offset: 3px;
          transition: all 0.2s ease;
        }
        
        .academic-content a:hover {
          color: #d97706;
          text-decoration-color: #1e40af;
        }
        
        .toc-item {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(10px);
        }
        
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
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

        /* Responsive adjustments */
        @media (max-width: 320px) {
          .academic-content {
            font-size: 0.9rem;
          }
        }
        
        @media (min-width: 768px) and (max-width: 1023px) {
          .academic-content {
            font-size: 1.1rem;
          }
        }
        
        @media (min-width: 1440px) {
          .academic-content {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </div>
  )
}

export default SingleBlogCard
