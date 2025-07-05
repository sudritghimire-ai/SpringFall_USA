"use client"

import { useEffect, useState, useCallback } from "react"
import { formatDate } from "./formatDate"
import EditorJSHTML from "editorjs-html"

// Enhanced custom parsers with academic styling
const customParsers = {
  delimiter: () =>
    `<div class="my-12 flex items-center justify-center">
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

  quote: (block) => {
    const { text } = block.data
    return `<blockquote class="my-12 relative group">
              <div class="relative bg-slate-50 border-l-6 border-slate-800 rounded-r-xl shadow-lg overflow-hidden transform group-hover:scale-[1.01] transition-all duration-500">
                <div class="relative p-8">
                  <div class="absolute top-6 left-6 text-slate-400 text-5xl font-serif leading-none">"</div>
                  <p class="text-slate-700 italic font-serif text-xl leading-relaxed mb-4 pl-12">${text}</p>
                  <footer class="text-sm text-slate-600 font-medium flex items-center gap-3 pl-12">
                    <div class="w-12 h-0.5 bg-slate-400 rounded-full"></div>
                    Academic Citation
                  </footer>
                </div>
              </div>
            </blockquote>`
  },
}

const editorJSHTML = EditorJSHTML(customParsers)

// Enhanced Floating Action Bar
const FloatingActionBar = ({ readingProgress, onShare, onBookmark, onPrint, isBookmarked }) => (
  <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
    {/* Progress Circle */}
    <div className="relative w-16 h-16 group">
      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-slate-200" />
        <circle
          cx="32"
          cy="32"
          r="28"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeDasharray={`${2 * Math.PI * 28}`}
          strokeDashoffset={`${2 * Math.PI * 28 * (1 - readingProgress / 100)}`}
          className="text-slate-800 transition-all duration-300 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-slate-800">{Math.round(readingProgress)}%</span>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col gap-3">
      <button
        onClick={onShare}
        className="w-14 h-14 bg-slate-800 hover:bg-slate-700 text-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        title="Share Article"
      >
        <svg
          className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
          />
        </svg>
      </button>

      <button
        onClick={onBookmark}
        className={`w-14 h-14 ${isBookmarked ? "bg-amber-600 hover:bg-amber-500" : "bg-slate-600 hover:bg-slate-500"} text-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group`}
        title={isBookmarked ? "Remove Bookmark" : "Bookmark Article"}
      >
        <svg
          className={`w-6 h-6 group-hover:scale-110 transition-transform duration-200 ${isBookmarked ? "fill-current" : ""}`}
          fill={isBookmarked ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </button>

      <button
        onClick={onPrint}
        className="w-14 h-14 bg-slate-700 hover:bg-slate-600 text-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        title="Print Article"
      >
        <svg
          className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
          />
        </svg>
      </button>
    </div>
  </div>
)

// Enhanced Header
const BlogHeader = ({ isScrolled, isTocOpen, setIsTocOpen, readingTime }) => (
  <header
    className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
      isScrolled ? "bg-white/95 backdrop-blur-xl shadow-xl border-b border-slate-200" : "bg-white/90 backdrop-blur-lg"
    }`}
  >
    <div className="flex items-center justify-between px-6 lg:px-8 py-5 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsTocOpen(!isTocOpen)}
          className="lg:hidden bg-white hover:bg-slate-50 shadow-lg hover:shadow-xl rounded-xl p-3 border border-slate-200 hover:border-slate-300 transition-all duration-300 group"
          aria-label="Toggle Table of Contents"
        >
          <svg
            className="w-5 h-5 text-slate-700 group-hover:text-slate-900 transition-colors duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {readingTime && (
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-full border border-slate-200 shadow-sm">
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-semibold text-slate-700">{readingTime} min read</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center flex-1">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300">
            <span className="text-white text-xl">🎓</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">SpringFallUSA</h1>
            <p className="text-xs text-slate-600 font-semibold tracking-widest uppercase">Premium Academic Resources</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full border border-green-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-green-800">Live</span>
        </div>
      </div>
    </div>
  </header>
)

// Enhanced TOC
const TableOfContents = ({ htmlContent, activeSection, handleTOCClick }) => {
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

  return <ul className="space-y-1">{generateTOC(htmlContent)}</ul>
}

// Mobile TOC Overlay
const MobileTOCOverlay = ({ isTocOpen, setIsTocOpen, htmlContent, activeSection, handleTOCClick }) => {
  if (!isTocOpen) return null

  return (
    <div className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm" onClick={() => setIsTocOpen(false)}>
      <div
        className="bg-white w-[85vw] max-w-sm h-full shadow-2xl overflow-y-auto mt-20 border-r border-slate-200 rounded-r-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">📚</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Table of Contents</h3>
            </div>
            <button
              onClick={() => setIsTocOpen(false)}
              className="text-slate-500 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-all duration-200"
              aria-label="Close Table of Contents"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6">
          <TableOfContents htmlContent={htmlContent} activeSection={activeSection} handleTOCClick={handleTOCClick} />
        </div>
      </div>
    </div>
  )
}

// Desktop TOC Sidebar
const DesktopTOCSidebar = ({ htmlContent, activeSection, handleTOCClick }) => (
  <div className="hidden lg:block w-80 fixed left-6 top-24 h-[calc(100vh-7rem)] bg-white shadow-2xl border border-slate-200 rounded-2xl overflow-hidden z-20 transition-all duration-500">
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">📚</span>
          </div>
          <h4 className="text-xl font-bold text-slate-900">Table of Contents</h4>
        </div>
        <div className="w-20 h-1 bg-slate-800 rounded-full"></div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <TableOfContents htmlContent={htmlContent} activeSection={activeSection} handleTOCClick={handleTOCClick} />
      </div>
    </div>
  </div>
)

// Article Header
const ArticleHeader = ({ title, category, createdAt, author, readingTime }) => (
  <header className="text-center mb-16 pb-12 relative overflow-hidden">
    <div className="absolute inset-0 bg-slate-50 rounded-2xl -mx-8 -my-8"></div>
    <div className="relative">
      <div className="mb-8">
        <span className="inline-flex items-center gap-3 px-8 py-4 border-2 border-slate-800 text-slate-800 rounded-full text-sm font-bold tracking-wider uppercase bg-white hover:bg-slate-800 hover:text-white transition-all duration-500 transform hover:scale-105 shadow-lg">
          <span className="text-lg">🏆</span>
          {category}
        </span>
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-slate-900 mb-12 leading-tight tracking-tight px-4">
        {title}
      </h1>

      <div className="flex items-center justify-center space-x-8 text-slate-600 flex-wrap gap-4">
        <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full border border-slate-200 shadow-lg">
          <span className="text-slate-700 text-lg">📅</span>
          <time className="font-semibold text-sm">{formatDate(createdAt)}</time>
        </div>

        <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full border border-slate-200 shadow-lg">
          <span className="text-slate-700 text-lg">✍️</span>
          <span className="font-semibold text-sm">{author || "SpringFallUSA Editorial"}</span>
        </div>

        {readingTime && (
          <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full border border-slate-200 shadow-lg">
            <span className="text-slate-700 text-lg">⏱️</span>
            <span className="font-semibold text-sm">{readingTime} min read</span>
          </div>
        )}
      </div>
    </div>
  </header>
)

// Cover Image
const CoverImage = ({ coverImg, title }) => {
  if (!coverImg) return null

  return (
    <figure className="mb-16 group">
      <div className="relative bg-white p-8 rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="relative overflow-hidden rounded-xl shadow-2xl group-hover:scale-[1.02] transition-transform duration-700">
          <img
            src={coverImg || "/placeholder.svg"}
            alt="Article cover"
            className="w-full h-auto max-h-96 object-cover"
          />
        </div>
        <figcaption className="mt-6 text-center text-sm text-slate-600 italic font-semibold tracking-wide">
          Featured illustration: "{title}"
        </figcaption>
      </div>
    </figure>
  )
}

// Rating Section
const RatingSection = ({ rating }) => (
  <footer className="mt-20 pt-12 border-t-2 border-slate-200">
    <div className="bg-slate-50 border-2 border-slate-800 p-12 rounded-2xl text-center hover:shadow-2xl transition-all duration-700 relative overflow-hidden group">
      <div className="relative">
        <div className="flex items-center justify-center gap-4 mb-8">
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
)

// Main Component
const SingleBlogCard = ({ blog }) => {
  const { title, description, content, coverImg, category, rating, author, createdAt } = blog || {}

  const [activeSection, setActiveSection] = useState(null)
  const [isTocOpen, setIsTocOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [readingTime, setReadingTime] = useState(null)

  const parsedContent = editorJSHTML.parse(content)
  const htmlContent = Array.isArray(parsedContent) ? parsedContent.join("") : parsedContent

  // Calculate reading time
  useEffect(() => {
    const wordCount = htmlContent.replace(/<[^>]*>/g, "").split(/\s+/).length
    const avgWordsPerMinute = 200
    const time = Math.ceil(wordCount / avgWordsPerMinute)
    setReadingTime(time)
  }, [htmlContent])

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

  const handleTOCClick = useCallback((e, id) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 180,
        behavior: "smooth",
      })
    }
    setIsTocOpen(false)
  }, [])

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }, [title, description])

  const handleBookmark = useCallback(() => {
    setIsBookmarked(!isBookmarked)
  }, [isBookmarked])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 z-50">
        <div
          className="h-full bg-slate-800 transition-all duration-300 ease-out shadow-lg"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Header */}
      <BlogHeader isScrolled={isScrolled} isTocOpen={isTocOpen} setIsTocOpen={setIsTocOpen} readingTime={readingTime} />

      {/* Mobile TOC Overlay */}
      <MobileTOCOverlay
        isTocOpen={isTocOpen}
        setIsTocOpen={setIsTocOpen}
        htmlContent={htmlContent}
        activeSection={activeSection}
        handleTOCClick={handleTOCClick}
      />

      <div className="flex pt-20 max-w-7xl mx-auto px-4 md:px-6 relative">
        {/* Desktop TOC Sidebar */}
        <DesktopTOCSidebar htmlContent={htmlContent} activeSection={activeSection} handleTOCClick={handleTOCClick} />

        {/* Main Content */}
        <div className="flex-1 lg:ml-96 transition-all duration-500">
          <div className="max-w-4xl mx-auto">
            <article className="px-4 md:px-8 lg:px-12 py-8 md:py-12">
              {/* Article Header */}
              <ArticleHeader
                title={title}
                category={category}
                createdAt={createdAt}
                author={author}
                readingTime={readingTime}
              />

              {/* Cover Image */}
              <CoverImage coverImg={coverImg} title={title} />

              {/* Article Content */}
              <div className="prose prose-xl max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                  className="academic-content text-slate-700 leading-relaxed"
                />
              </div>

              {/* Rating */}
              <RatingSection rating={rating} />
            </article>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <FloatingActionBar
        readingProgress={readingProgress}
        onShare={handleShare}
        onBookmark={handleBookmark}
        onPrint={handlePrint}
        isBookmarked={isBookmarked}
      />

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
          scroll-margin-top: 180px;
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

        @media print {
          .fixed, .sticky {
            display: none !important;
          }

          .academic-content {
            font-size: 12pt;
            line-height: 1.6;
            color: black;
          }

          .academic-content h1, .academic-content h2, .academic-content h3 {
            color: black;
            page-break-after: avoid;
          }

          .academic-content p {
            orphans: 3;
            widows: 3;
          }
        }
      `}</style>
    </div>
  )
}

export default SingleBlogCard
