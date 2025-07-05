"use client"

import { useEffect, useState } from "react"
import { formatDate } from "../../../utils/formatDate"
import EditorJSHTML from "editorjs-html"

const customParsers = {
  delimiter: () =>
    `<div class="my-16 flex items-center justify-center">
      <div class="flex items-center gap-6 w-full max-w-2xl">
        <div class="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-slate-400"></div>
          <div class="w-3 h-3 rounded-full bg-slate-500"></div>
          <div class="w-2 h-2 rounded-full bg-slate-400"></div>
        </div>
        <div class="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
      </div>
    </div>`,

  embed: (block) => {
    const { service, source, embed } = block.data
    if (service === "youtube") {
      return `<figure class="my-12 group">
                <div class="relative bg-white p-8 rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                  <div class="relative aspect-video rounded-xl overflow-hidden border border-slate-300 shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
                    <iframe class="w-full h-full" src="${embed}" frameborder="0" allowfullscreen></iframe>
                  </div>
                  <figcaption class="mt-6 text-center text-sm text-slate-600 font-medium">📹 Educational Video Content</figcaption>
                </div>
              </figure>`
    }
    return `<a href="${source}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium text-sm">
              🔗 External Resource
            </a>`
  },

  table: (block) => {
    const { content } = block.data
    const tableRows = content
      .map((row, rowIndex) => {
        const tableCells = row
          .map((cell) => {
            if (rowIndex === 0) {
              return `<th class="px-6 py-4 bg-slate-800 text-white border border-slate-300 font-bold text-sm tracking-wider uppercase">${cell}</th>`
            }
            return `<td class="px-6 py-4 border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors duration-200">${cell}</td>`
          })
          .join("")
        const rowClasses = rowIndex === 0 ? "" : "bg-white hover:bg-slate-50 transition-all duration-300"
        return `<tr class="${rowClasses}">${tableCells}</tr>`
      })
      .join("")

    return `<div class="my-12 overflow-hidden rounded-xl shadow-xl border border-slate-200 bg-white">
              <div class="overflow-x-auto">
                <table class="w-full min-w-[600px] border-collapse">
                  ${tableRows}
                </table>
              </div>
            </div>`
  },

  header: (block) => {
    const { text, level } = block.data
    const id = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")

    const headerClasses = {
      1: "text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mt-16 mb-8 relative group border-b-4 border-slate-200 pb-4",
      2: "text-3xl md:text-4xl font-bold text-slate-800 mt-12 mb-6 relative group border-b-2 border-slate-200 pb-3",
      3: "text-2xl md:text-3xl font-bold text-slate-700 mt-10 mb-5 relative group",
      4: "text-xl md:text-2xl font-semibold text-slate-700 mt-8 mb-4 relative group",
      5: "text-lg md:text-xl font-semibold text-slate-600 mt-6 mb-3 relative group",
      6: "text-base md:text-lg font-semibold text-slate-600 mt-5 mb-2 relative group",
    }

    const decorations = {
      1: `<div class="absolute -left-6 top-1/2 transform -translate-y-1/2 w-3 h-20 bg-slate-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>`,
      2: `<div class="absolute -left-5 top-1/2 transform -translate-y-1/2 w-2 h-16 bg-slate-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>`,
      3: `<div class="absolute -left-4 top-1/2 transform -translate-y-1/2 w-1.5 h-12 bg-slate-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>`,
    }

    return `<h${level} id="${id}" class="${headerClasses[level] || headerClasses[6]}">
              ${decorations[level] || ""}
              ${text}
            </h${level}>`
  },
}

const editorJSHTML = EditorJSHTML(customParsers)

const SingleBlogCard = ({ blog }) => {
  const { title, description, content, coverImg, category, rating, author, createdAt, similarUniversities } = blog || {}
  const [activeSection, setActiveSection] = useState(null)
  const [tocOpen, setTocOpen] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)

  const parsedContent = editorJSHTML.parse(content)
  const htmlContent = Array.isArray(parsedContent) ? parsedContent.join("") : parsedContent

  const generateTOC = (content) => {
    const headings = content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/g)
    if (!headings) return []

    return headings
      .map((heading, index) => {
        const title = heading.replace(/<[^>]*>/g, "")
        const id = heading.match(/id="([^"]*)"/)?.[1]
        const level = heading.match(/<h([1-6])/)?.[1]
        if (!id) return null

        const indentClass = level > 2 ? "ml-8" : level > 1 ? "ml-4" : ""
        const levelStyles = {
          1: "text-slate-900 font-bold text-base",
          2: "text-slate-800 font-semibold text-sm",
          3: "text-slate-700 font-medium text-sm",
          4: "text-slate-600 text-sm",
          5: "text-slate-500 text-xs",
          6: "text-slate-400 text-xs",
        }

        return (
          <li key={id} className={`toc-item mb-1 ${indentClass}`} style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
            <a
              href={`#${id}`}
              onClick={(e) => handleTOCClick(e, id)}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-300 group relative overflow-hidden ${
                activeSection === id
                  ? "bg-slate-800 text-white shadow-lg transform scale-[1.02]"
                  : `${levelStyles[level]} hover:bg-slate-100 hover:text-slate-900 hover:shadow-md hover:transform hover:scale-[1.01] border border-transparent hover:border-slate-200`
              }`}
            >
              <span className="leading-tight flex-1 line-clamp-2">{title}</span>
              {activeSection === id && (
                <div className="absolute right-3 w-2 h-2 bg-white rounded-full animate-pulse shadow-lg"></div>
              )}
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

      // Calculate reading progress
      const article = document.querySelector("article")
      if (article) {
        const scrollTop = window.scrollY
        const docHeight = article.offsetHeight
        const winHeight = window.innerHeight
        const scrollPercent = scrollTop / (docHeight - winHeight)
        setReadingProgress(Math.min(100, Math.max(0, scrollPercent * 100)))
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
        top: target.offsetTop - 120,
        behavior: "smooth",
      })
    }
    if (window.innerWidth < 1024) {
      setTocOpen(false)
    }
  }

  const toggleTOC = () => {
    setTocOpen(!tocOpen)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 relative">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Academic Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🎓</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">SpringFallUSA</h1>
                <p className="text-xs text-slate-600 font-semibold tracking-widest uppercase">Academic Excellence</p>
              </div>
            </div>

            {/* Mobile TOC Toggle */}
            <button
              onClick={toggleTOC}
              className="lg:hidden bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm">Contents</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${tocOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile TOC Overlay */}
      {tocOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm" onClick={() => setTocOpen(false)}>
          <div
            className="bg-white w-[85vw] max-w-sm h-full shadow-2xl overflow-y-auto mt-16 border-r border-slate-200 rounded-r-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">📚</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Table of Contents</h3>
                </div>
                <button
                  onClick={() => setTocOpen(false)}
                  className="text-slate-500 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-all duration-200"
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

      <div className="flex max-w-7xl mx-auto">
        {/* Desktop Sidebar TOC */}
        <div className="hidden lg:block w-80 fixed left-6 top-24 h-[calc(100vh-7rem)] bg-white shadow-2xl border border-slate-200 rounded-2xl overflow-hidden z-20">
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">📚</span>
                </div>
                <h4 className="text-xl font-bold text-slate-900">Table of Contents</h4>
              </div>
              <div className="w-20 h-1 bg-slate-800 rounded-full"></div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-1">{generateTOC(htmlContent)}</ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-96 px-4 sm:px-6 lg:px-8 py-8">
          <article className="max-w-4xl mx-auto">
            {/* Article Header */}
            <header className="text-center mb-16 pb-12 border-b-2 border-slate-200 relative">
              <div className="mb-8">
                <span className="inline-flex items-center px-6 py-3 border-2 border-slate-800 text-slate-800 rounded-full text-sm font-bold tracking-wider uppercase bg-white hover:bg-slate-800 hover:text-white transition-all duration-500 transform hover:scale-105 shadow-lg">
                  <span className="mr-2">🏆</span>
                  {category}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-8 leading-tight tracking-tight font-serif">
                {title}
              </h1>

              <div className="flex items-center justify-center space-x-6 text-slate-600 flex-wrap gap-4">
                <div className="flex items-center space-x-2 px-4 py-2 bg-slate-100 rounded-full border border-slate-200 shadow-sm">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <time className="font-semibold text-sm">{formatDate(createdAt)}</time>
                </div>

                <div className="flex items-center space-x-2 px-4 py-2 bg-slate-100 rounded-full border border-slate-200 shadow-sm">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="font-semibold text-sm">{author || "SpringFallUSA Editorial"}</span>
                </div>
              </div>
            </header>

            {/* Cover Image */}
            {coverImg && (
              <figure className="mb-16 group">
                <div className="relative bg-white p-8 rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                  <div className="relative overflow-hidden rounded-xl shadow-2xl group-hover:scale-[1.02] transition-transform duration-700">
                    <img
                      src={coverImg || "/placeholder.svg"}
                      alt="Article cover"
                      className="w-full h-auto max-h-96 object-cover"
                    />
                  </div>
                  <figcaption className="mt-6 text-center text-sm text-slate-600 italic font-semibold">
                    Featured illustration: "{title}"
                  </figcaption>
                </div>
              </figure>
            )}

            {/* Article Content */}
            <div className="prose prose-xl max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                className="academic-content text-slate-700 leading-relaxed"
              />
            </div>

            {/* Similar Universities Section */}
            {similarUniversities && similarUniversities.length > 0 && (
              <section className="mt-20 pt-12 border-t-2 border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center font-serif">
                  Related Academic Institutions
                </h2>
                <div className="grid gap-6 md:gap-8">
                  {similarUniversities.map((university) => (
                    <div
                      key={university.id}
                      className="bg-gradient-to-r from-slate-50 to-white p-8 rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] group"
                    >
                      <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-slate-900 transition-colors duration-300 font-serif">
                        {university.name}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-lg">{university.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rating Section */}
            <footer className="mt-20 pt-12 border-t-2 border-slate-200">
              <div className="bg-slate-50 border-2 border-slate-800 p-12 rounded-2xl text-center hover:shadow-2xl transition-all duration-700 relative overflow-hidden group">
                <div className="relative">
                  <div className="flex items-center justify-center space-x-4 mb-8">
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-3xl">🏆</span>
                    </div>
                    <span className="font-black text-3xl text-slate-900">Academic Rating</span>
                  </div>

                  <div className="text-7xl md:text-8xl font-black text-slate-900 mb-8">{rating}</div>

                  <p className="text-sm text-slate-600 italic font-semibold tracking-wide mb-8">
                    Evaluated by SpringFallUSA Academic Review Board
                  </p>

                  <div className="flex justify-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-8 h-8 text-amber-500 fill-current mx-1" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </article>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        
        .academic-content {
          font-family: 'Inter', system-ui, sans-serif;
          line-height: 1.8;
          font-size: 1.125rem;
          color: #475569;
        }
        
        @media (min-width: 768px) {
          .academic-content {
            font-size: 1.25rem;
            line-height: 1.9;
          }
        }
        
        @media (min-width: 1024px) {
          .academic-content {
            font-size: 1.375rem;
            line-height: 2;
          }
        }
        
        .academic-content h1, .academic-content h2, .academic-content h3,
        .academic-content h4, .academic-content h5, .academic-content h6 {
          font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
          scroll-margin-top: 120px;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          color: #1e293b;
        }
        
        .academic-content p {
          margin-bottom: 2rem;
          text-align: justify;
          hyphens: auto;
          color: #475569;
        }
        
        .academic-content ul, .academic-content ol {
          margin: 2.5rem 0;
          padding-left: 2rem;
        }
        
        .academic-content li {
          margin-bottom: 1rem;
          line-height: 1.8;
          color: #475569;
        }
        
        .academic-content img {
          margin: 3rem auto;
          border-radius: 12px;
          box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
        }
        
        .academic-content a {
          color: #1e293b;
          text-decoration: none;
          font-weight: 600;
          border-bottom: 2px solid #1e293b;
          transition: all 0.3s ease;
        }
        
        .academic-content a:hover {
          color: #475569;
          border-bottom-color: #475569;
        }
        
        .font-serif {
          font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
        }
        
        .toc-item {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 8px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 8px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
        
        * {
          scroll-behavior: smooth;
        }
        
        button:focus-visible,
        a:focus-visible {
          outline: 3px solid #1e293b;
          outline-offset: 2px;
          border-radius: 8px;
        }
      `}</style>
    </div>
  )
}

export default SingleBlogCard
