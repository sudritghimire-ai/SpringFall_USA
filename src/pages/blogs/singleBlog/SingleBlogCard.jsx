"use client"

import { useEffect, useState, useCallback } from "react"
import EditorJSHTML from "editorjs-html"
import { ChevronDown, ChevronUp, Clock, User, Calendar, Share2, Bookmark, Printer, Eye } from "lucide-react"

// Utility function for date formatting
const formatDate = (dateString) => {
  if (!dateString) return ""
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (error) {
    return ""
  }
}

// Enhanced custom parsers with stunning styling
const customParsers = {
  delimiter: () =>
    `<div class="my-16 flex items-center justify-center">
      <div class="flex items-center gap-8 w-full max-w-3xl">
        <div class="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-slate-400"></div>
        <div class="flex items-center gap-3">
          <div class="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse shadow-lg"></div>
          <div class="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse shadow-lg" style="animation-delay: 0.5s"></div>
          <div class="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-red-500 animate-pulse shadow-lg" style="animation-delay: 1s"></div>
        </div>
        <div class="flex-1 h-px bg-gradient-to-r from-slate-400 via-slate-300 to-transparent"></div>
      </div>
    </div>`,

  embed: (block) => {
    const { service, source, embed } = block.data
    if (service === "youtube") {
      return `<figure class="my-16 group">
                <div class="relative bg-gradient-to-br from-slate-50 to-white p-8 rounded-3xl shadow-2xl border border-slate-200/60 overflow-hidden transform group-hover:scale-[1.02] transition-all duration-700">
                  <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
                  <div class="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/50">
                    <iframe class="w-full h-full" src="${embed}" frameborder="0" allowfullscreen></iframe>
                  </div>
                  <figcaption class="mt-6 text-center text-sm text-slate-600 font-medium tracking-wide">🎥 Educational Video Content</figcaption>
                </div>
              </figure>`
    }
    return `<a href="${source}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:scale-105 font-semibold text-sm tracking-wide">
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
              return `<th class="px-8 py-6 bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 text-white border border-white/20 font-bold text-sm tracking-wider uppercase backdrop-blur-sm">${cell}</th>`
            }
            return `<td class="px-8 py-6 border border-slate-200/60 text-slate-700 font-medium text-sm hover:bg-blue-50/50 transition-colors duration-300">${cell}</td>`
          })
          .join("")
        const rowClasses =
          rowIndex === 0
            ? ""
            : "bg-white hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-500"
        return `<tr class="${rowClasses}">${tableCells}</tr>`
      })
      .join("")

    return `<div class="my-16 overflow-hidden rounded-3xl shadow-2xl border border-slate-200/60 bg-white backdrop-blur-xl">
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

    const headerStyles = {
      1: "text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text mt-20 mb-10 relative group",
      2: "text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 bg-clip-text mt-16 mb-8 relative group",
      3: "text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text mt-12 mb-6 relative group",
      4: "text-2xl md:text-3xl font-semibold text-slate-800 mt-10 mb-5 relative group",
      5: "text-xl md:text-2xl font-semibold text-slate-700 mt-8 mb-4 relative group",
      6: "text-lg md:text-xl font-semibold text-slate-600 mt-6 mb-3 relative group",
    }

    const decorations = {
      1: `<div class="absolute -left-8 top-1/2 transform -translate-y-1/2 w-4 h-24 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-lg"></div>`,
      2: `<div class="absolute -left-6 top-1/2 transform -translate-y-1/2 w-3 h-20 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-lg"></div>`,
      3: `<div class="absolute -left-5 top-1/2 transform -translate-y-1/2 w-2 h-16 bg-gradient-to-b from-pink-500 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-lg"></div>`,
    }

    return `<h${level} id="${id}" class="${headerStyles[level] || headerStyles[6]} scroll-mt-32">
              ${decorations[level] || ""}
              ${text}
            </h${level}>`
  },

  quote: (block) => {
    const { text } = block.data
    return `<blockquote class="my-16 relative group">
              <div class="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-l-8 border-gradient-to-b from-blue-500 to-purple-500 rounded-r-3xl shadow-2xl backdrop-blur-sm overflow-hidden transform group-hover:scale-[1.02] transition-all duration-700">
                <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10"></div>
                <div class="relative p-12">
                  <div class="absolute top-8 left-8 text-blue-400/60 text-8xl font-serif leading-none">"</div>
                  <p class="text-slate-700 italic font-serif text-2xl leading-relaxed mb-6 pl-16">${text}</p>
                  <footer class="text-sm text-slate-600 font-semibold flex items-center gap-4 pl-16">
                    <div class="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    Academic Insight
                  </footer>
                </div>
              </div>
            </blockquote>`
  },

  paragraph: (block) => {
    const { text } = block.data
    return `<p class="mb-8 text-slate-700 leading-relaxed text-lg md:text-xl font-medium tracking-wide">${text}</p>`
  },
}

const editorJSHTML = EditorJSHTML(customParsers)

// Enhanced Floating Action Bar
const FloatingActionBar = ({ readingProgress, onShare, onBookmark, onPrint, isBookmarked }) => (
  <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
    {/* Progress Circle */}
    <div className="relative w-20 h-20 group">
      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="6" fill="none" className="text-slate-200" />
        <circle
          cx="40"
          cy="40"
          r="35"
          stroke="url(#progress-gradient)"
          strokeWidth="6"
          fill="none"
          strokeDasharray={`${2 * Math.PI * 35}`}
          strokeDashoffset={`${2 * Math.PI * 35 * (1 - readingProgress / 100)}`}
          className="transition-all duration-500 ease-out drop-shadow-lg"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-slate-800">{Math.round(readingProgress)}%</span>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col gap-3">
      <button
        onClick={onShare}
        className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-500 flex items-center justify-center group backdrop-blur-xl"
        title="Share Article"
      >
        <Share2 className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
      </button>

      <button
        onClick={onBookmark}
        className={`w-16 h-16 ${isBookmarked ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-slate-500 to-slate-600"} hover:from-amber-500 hover:to-orange-500 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-500 flex items-center justify-center group backdrop-blur-xl`}
        title={isBookmarked ? "Remove Bookmark" : "Bookmark Article"}
      >
        <Bookmark
          className={`w-7 h-7 group-hover:scale-110 transition-transform duration-300 ${isBookmarked ? "fill-current" : ""}`}
        />
      </button>

      <button
        onClick={onPrint}
        className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-500 flex items-center justify-center group backdrop-blur-xl"
        title="Print Article"
      >
        <Printer className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
      </button>
    </div>
  </div>
)

// Enhanced Header
const BlogHeader = ({ isScrolled, tocOpen, setTocOpen, readingTime, viewCount }) => (
  <header
    className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${
      isScrolled
        ? "bg-white/90 backdrop-blur-2xl shadow-2xl border-b border-white/20"
        : "bg-gradient-to-r from-white/80 via-blue-50/60 to-purple-50/50 backdrop-blur-xl"
    }`}
  >
    <div className="flex items-center justify-between px-6 lg:px-12 py-6 max-w-8xl mx-auto">
      <div className="flex items-center gap-6">
        <button
          onClick={() => setTocOpen(!tocOpen)}
          className="lg:hidden bg-white/90 hover:bg-white shadow-2xl hover:shadow-3xl rounded-2xl p-4 border border-white/40 hover:border-blue-200 transition-all duration-500 backdrop-blur-xl group"
          aria-label="Toggle Table of Contents"
        >
          {tocOpen ? (
            <ChevronUp className="w-6 h-6 text-slate-700 group-hover:text-blue-600 transition-colors duration-300" />
          ) : (
            <ChevronDown className="w-6 h-6 text-slate-700 group-hover:text-blue-600 transition-colors duration-300" />
          )}
        </button>

        <div className="flex items-center gap-4">
          {readingTime && (
            <div className="hidden sm:flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-xl rounded-full border border-white/40 shadow-xl">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-slate-700">{readingTime} min read</span>
            </div>
          )}

          {viewCount && (
            <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-xl rounded-full border border-white/40 shadow-xl">
              <Eye className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-slate-700">{viewCount.toLocaleString()} views</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center flex-1">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-500">
            <span className="text-white text-2xl">🎓</span>
          </div>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text tracking-tight">
              SpringFallUSA
            </h1>
            <p className="text-xs text-slate-600 font-bold tracking-widest uppercase">Premium Academic Resources</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-full border border-green-200/50">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
          <span className="text-sm font-bold text-green-800">Live</span>
        </div>
      </div>
    </div>
  </header>
)

// Enhanced TOC Component
const TableOfContents = ({ htmlContent, activeSection, handleTOCClick }) => {
  const generateTOC = (content) => {
    const headings = content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/g)
    if (!headings) return []

    return headings
      .map((heading, index) => {
        const title = heading.replace(/<[^>]*>/g, "")
        const id = heading.match(/id="([^"]*)"/)?.[1]
        const level = heading.match(/<h([1-6])/)?.[1]
        if (!id) return null

        const indentClass = level >= "3" ? "ml-8" : level >= "2" ? "ml-4" : ""
        const levelColors = {
          1: "text-slate-900 font-bold text-base",
          2: "text-blue-800 font-semibold text-sm",
          3: "text-purple-700 font-medium text-sm",
          4: "text-slate-600 text-sm",
          5: "text-slate-500 text-xs",
          6: "text-slate-400 text-xs",
        }

        return (
          <li key={id} className={`toc-item mb-2 ${indentClass}`} style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
            <a
              href={`#${id}`}
              onClick={(e) => handleTOCClick(e, id)}
              className={`flex items-center py-4 px-6 rounded-2xl transition-all duration-500 text-sm font-medium group relative overflow-hidden backdrop-blur-sm ${
                activeSection === id
                  ? "bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 text-blue-900 border-2 border-blue-200/50 shadow-xl transform scale-[1.02]"
                  : `${levelColors[level]} hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/50 hover:text-blue-800 hover:shadow-lg hover:transform hover:scale-[1.01] border-2 border-transparent hover:border-blue-100`
              }`}
            >
              <span className="leading-tight flex-1 line-clamp-2">{title}</span>
              {activeSection === id && (
                <div className="absolute right-4 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
              )}
            </a>
          </li>
        )
      })
      .filter(Boolean)
  }

  return <ul className="space-y-2">{generateTOC(htmlContent)}</ul>
}

// Main Component
const SingleBlogCard = ({ blog }) => {
  const { title, description, content, coverImg, category, rating, author, createdAt } = blog || {}

  const [activeSection, setActiveSection] = useState(null)
  const [tocOpen, setTocOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [readingTime, setReadingTime] = useState(null)
  const [viewCount] = useState(Math.floor(Math.random() * 50000) + 10000)

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
        top: target.offsetTop - 200,
        behavior: "smooth",
      })
    }
    if (window.innerWidth < 1024) {
      setTocOpen(false)
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 via-purple-50/20 to-pink-50/10 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Enhanced Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-2 bg-slate-200/50 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-500 ease-out shadow-lg"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Header */}
      <BlogHeader
        isScrolled={isScrolled}
        tocOpen={tocOpen}
        setTocOpen={setTocOpen}
        readingTime={readingTime}
        viewCount={viewCount}
      />

      {/* Mobile TOC Overlay */}
      {tocOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-md" onClick={() => setTocOpen(false)}>
          <div
            className="bg-white/95 backdrop-blur-2xl w-[90vw] max-w-md h-full shadow-2xl overflow-y-auto mt-24 border-r border-white/20 rounded-r-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 border-b border-slate-200/60 bg-gradient-to-r from-blue-50/80 to-purple-50/60">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-xl">📚</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Table of Contents</h3>
                </div>
                <button
                  onClick={() => setTocOpen(false)}
                  className="text-slate-500 hover:text-slate-700 p-3 rounded-2xl hover:bg-slate-100/60 transition-all duration-300"
                  aria-label="Close Table of Contents"
                >
                  <ChevronUp className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-8">
              <TableOfContents
                htmlContent={htmlContent}
                activeSection={activeSection}
                handleTOCClick={handleTOCClick}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex pt-28 max-w-8xl mx-auto px-6 md:px-8 relative">
        {/* Desktop TOC Sidebar */}
        <div className="hidden lg:block w-96 fixed left-8 top-32 h-[calc(100vh-8rem)] bg-white/90 backdrop-blur-2xl shadow-2xl border border-white/20 rounded-3xl overflow-hidden z-20 transition-all duration-700">
          <div className="h-full flex flex-col">
            <div className="p-8 border-b border-slate-200/60 bg-gradient-to-r from-blue-50/80 to-purple-50/60">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-xl">
                  <span className="text-white text-2xl">📚</span>
                </div>
                <h4 className="text-2xl font-bold text-slate-800">Table of Contents</h4>
              </div>
              <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <TableOfContents
                htmlContent={htmlContent}
                activeSection={activeSection}
                handleTOCClick={handleTOCClick}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-[26rem] transition-all duration-700">
          <div className="max-w-5xl mx-auto">
            <article className="px-6 md:px-12 lg:px-16 py-12 md:py-16">
              {/* Article Header */}
              <header className="text-center mb-20 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/20 rounded-3xl -mx-12 -my-12 backdrop-blur-sm"></div>
                <div className="relative">
                  <div className="mb-12">
                    <span className="inline-flex items-center gap-4 px-10 py-5 border-3 border-blue-200/60 text-blue-800 rounded-full text-sm font-bold tracking-wider uppercase bg-white/80 backdrop-blur-sm hover:border-purple-300 hover:shadow-2xl transition-all duration-700 transform hover:scale-105">
                      <span className="text-2xl">🏆</span>
                      {category}
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-transparent bg-gradient-to-r from-slate-800 via-blue-800 via-purple-800 to-pink-800 bg-clip-text mb-12 leading-tight tracking-tight px-6">
                    {title}
                  </h1>

                  <div className="flex items-center justify-center space-x-8 text-slate-600 flex-wrap gap-6">
                    <div className="flex items-center gap-4 px-8 py-4 bg-white/60 backdrop-blur-sm rounded-full border border-white/40 shadow-xl">
                      <Calendar className="w-6 h-6 text-amber-600" />
                      <time className="font-semibold text-sm">{formatDate(createdAt)}</time>
                    </div>

                    <div className="flex items-center gap-4 px-8 py-4 bg-white/60 backdrop-blur-sm rounded-full border border-white/40 shadow-xl">
                      <User className="w-6 h-6 text-blue-600" />
                      <span className="font-semibold text-sm">{author || "SpringFallUSA Editorial"}</span>
                    </div>

                    {readingTime && (
                      <div className="flex items-center gap-4 px-8 py-4 bg-white/60 backdrop-blur-sm rounded-full border border-white/40 shadow-xl">
                        <Clock className="w-6 h-6 text-purple-600" />
                        <span className="font-semibold text-sm">{readingTime} min read</span>
                      </div>
                    )}
                  </div>
                </div>
              </header>

              {/* Cover Image */}
              {coverImg && (
                <figure className="mb-20 group">
                  <div className="relative bg-gradient-to-br from-white to-slate-50/50 p-10 md:p-12 rounded-3xl border border-white/40 shadow-2xl backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl group-hover:scale-[1.02] transition-transform duration-700">
                      <img
                        src={coverImg || "/placeholder.svg"}
                        alt="Article cover"
                        className="w-full h-auto max-h-96 md:max-h-[32rem] object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    </div>
                    <figcaption className="mt-8 text-center text-sm text-slate-600 italic font-semibold tracking-wide">
                      Featured illustration: "{title}"
                    </figcaption>
                  </div>
                </figure>
              )}

              {/* Article Content */}
              <div className="prose prose-2xl max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                  className="academic-content text-slate-700 leading-relaxed"
                />
              </div>

              {/* Rating Section */}
              <footer className="mt-24 pt-16 border-t-4 border-gradient-to-r from-transparent via-slate-200 to-transparent">
                <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 border-3 border-blue-200/60 p-16 rounded-3xl text-center hover:border-purple-300 hover:shadow-2xl transition-all duration-700 backdrop-blur-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="relative">
                    <div className="flex items-center justify-center gap-6 mb-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl">
                        <span className="text-white text-4xl">🏆</span>
                      </div>
                      <span className="font-black text-4xl text-slate-800">Academic Rating</span>
                    </div>

                    <div className="text-8xl md:text-9xl font-black text-transparent bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text mb-12">
                      {rating}
                    </div>

                    <p className="text-sm text-slate-600 italic font-semibold tracking-wide mb-12">
                      Evaluated by SpringFallUSA Academic Review Board
                    </p>

                    <div className="flex justify-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-10 h-10 text-amber-400 fill-current mx-2" viewBox="0 0 20 20">
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

        .font-outfit { font-family: 'Inter', system-ui, sans-serif; }
        .font-serif-academic { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; }

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
          scroll-margin-top: 200px;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
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
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
        }

        .academic-content a {
          color: #3B82F6;
          text-decoration: none;
          font-weight: 600;
          background: linear-gradient(to right, #3B82F6, #8B5CF6);
          background-size: 0% 2px;
          background-position: 0% 100%;
          background-repeat: no-repeat;
          transition: all 0.3s ease;
        }

        .academic-content a:hover {
          background-size: 100% 2px;
          color: #8B5CF6;
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

        /* Enhanced scrollbar */
        ::-webkit-scrollbar {
          width: 12px;
        }

        ::-webkit-scrollbar-track {
          background: linear-gradient(to bottom, #f1f5f9, #e2e8f0);
          border-radius: 12px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3B82F6, #8B5CF6);
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563EB, #7C3AED);
        }

        /* Smooth animations */
        * {
          scroll-behavior: smooth;
        }

        /* Enhanced focus states */
        button:focus-visible,
        a:focus-visible {
          outline: 3px solid #3B82F6;
          outline-offset: 2px;
          border-radius: 16px;
        }

        /* Print styles */
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

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .academic-content {
            color: #e2e8f0;
          }
          
          .academic-content h1, .academic-content h2, .academic-content h3,
          .academic-content h4, .academic-content h5, .academic-content h6 {
            color: #f1f5f9;
          }
        }
      `}</style>
    </div>
  )
}

export default SingleBlogCard
