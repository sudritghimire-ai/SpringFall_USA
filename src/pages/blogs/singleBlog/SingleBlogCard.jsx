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
    return `<h${level} id="${id}" class="${headerClasses[level] || headerClasses[6]}">${text}</h${level}>`
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

      <div className="min-h-screen bg-white">

      {/* Fixed Header Bar */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
            : 'bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-sm'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          {/* Left: Hamburger Menu (Mobile Only) */}
          <div className="flex items-center lg:w-20">
            <button
              onClick={() => setIsTocOpen(!isTocOpen)}
              className="lg:hidden bg-white/80 hover:bg-white shadow-md hover:shadow-lg rounded-xl p-2.5 border border-gray-200 hover:border-blue-200 transition-all duration-200"
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
                <h1 className="text-lg font-serif-academic font-bold text-slate-800 tracking-wide">
                  SpringFallUSA
                </h1>
                <p className="text-xs text-gray-600 font-outfit -mt-1">Academic Resources</p>
              </div>
            </div>
          </div>

          {/* Right: Future Icons Space */}
          <div className="flex items-center gap-2 lg:w-20 justify-end">
            {/* Placeholder for future icons like search, user menu, etc. */}
            <div className="w-8 h-8 flex items-center justify-center">
              {/* Future: Search, User Profile, etc. */}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile TOC Overlay */}
      {isTocOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setIsTocOpen(false)}
        >
          <div 
            className="bg-white w-80 h-full shadow-2xl overflow-y-auto mt-16" 
            onClick={(e) => e.stopPropagation()}
          >
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

      <div className="flex pt-16">
        {/* Desktop Sidebar TOC */}
        <div className="hidden lg:block lg:w-80 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-2xl border-r border-gray-200 overflow-y-auto z-30">
          <div className="p-8">
            {/* TOC Header */}
            <div className="mb-6">
              <h4 className="text-base font-serif-academic font-semibold text-slate-700 mb-1">Table of Contents</h4>
              <div className="w-12 h-0.5 bg-amber-600 rounded-full"></div>
            </div>

            <ul className="space-y-1">{generateTOC(htmlContent)}</ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-80">
          <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:px-12 font-outfit">
            {/* Header Section */}
            <header className="text-center mb-12 pb-8 border-b-2 border-gray-200">
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-800 rounded-full text-sm font-medium tracking-wide uppercase font-outfit bg-transparent hover:border-blue-300 transition-colors">
                  <span className="text-base">🏆</span>
                  {category}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif-academic font-bold text-slate-800 mb-6 leading-tight">
                {title}
              </h1>
              <div className="flex items-center justify-center space-x-4 text-gray-600 font-outfit flex-wrap">
                <time className="font-serif-academic italic text-sm">{formatDate(createdAt)}</time>
                <span className="text-amber-600 hidden sm:inline">•</span>
                <span className="text-blue-800 hover:text-amber-600 cursor-pointer font-medium text-sm">
                  By {author || "SpringFallUSA Editorial"}
                </span>
              </div>
            </header>

            {/* Cover Image */}
            {coverImg && (
              <figure className="mb-12">
                <div className="relative bg-white p-4 rounded-xl shadow-lg border border-gray-200 max-w-4xl mx-auto">
                  <img
                    src={coverImg || "/placeholder.svg"}
                    alt="Article cover"
                    className="w-full h-auto max-h-80 object-cover rounded-lg"
                  />
                  <figcaption className="mt-4 text-center text-sm text-gray-600 italic font-serif-academic">
                    Featured illustration: "{title}"
                  </figcaption>
                </div>
              </figure>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                className="academic-content text-gray-700 leading-relaxed"
              />
            </div>

            {/* Similar Universities Section */}
            {similarUniversities && similarUniversities.length > 0 && (
              <section className="mt-16 pt-12 border-t-2 border-amber-600">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-serif-academic font-bold text-slate-800 mb-3">Related Institutions</h2>
                  <div className="w-16 h-1 bg-amber-600 rounded-full mx-auto"></div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {similarUniversities.map((university) => (
                    <div
                      key={university.id}
                      className="bg-white p-8 rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-transparent border border-blue-200 rounded-lg flex items-center justify-center group-hover:border-amber-400 transition-colors">
                          <span className="text-blue-800 text-lg">🎓</span>
                        </div>
                        <h3 className="text-xl font-serif-academic font-semibold text-blue-900 leading-tight">
                          {university.name}
                        </h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed font-outfit">{university.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rating Section */}
            <footer className="mt-16 pt-8 border-t border-gray-200">
              <div className="bg-transparent border border-blue-200 p-8 rounded-xl text-center hover:border-amber-300 transition-colors">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-amber-600 text-lg">🏆</span>
                  <span className="font-serif-academic font-semibold text-slate-800 text-lg">Academic Rating</span>
                </div>
                <div className="text-3xl font-bold text-amber-600 mb-2">{rating}</div>
                <p className="text-sm text-gray-600 italic font-outfit">
                  Evaluated by SpringFallUSA Academic Review Board
                </p>
              </div>
            </footer>
          </article>
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
          box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
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
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
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
