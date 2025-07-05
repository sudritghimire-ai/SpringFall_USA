"use client"

import { useEffect, useState, useCallback } from "react"
import { formatDate } from "../../../utils/formatDate"
import EditorJSHTML from "editorjs-html"

// Enhanced custom parsers with better styling
const customParsers = {
  delimiter: () =>
    `<div class="my-8 md:my-12 flex items-center justify-center">
      <div class="flex items-center gap-4 w-full max-w-md">
        <div class="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
        <div class="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg animate-pulse"></div>
        <div class="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
      </div>
    </div>`,

  embed: (block) => {
    const { service, source, embed } = block.data
    if (service === "youtube") {
      return `<figure class="my-8 md:my-12 group">
                <div class="relative bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-6 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-xl overflow-hidden">
                  <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10"></div>
                  <div class="relative aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500">
                    <iframe class="w-full h-full" src="${embed}" frameborder="0" allowfullscreen></iframe>
                  </div>
                  <figcaption class="mt-4 text-center text-sm text-white/80 font-medium">🎥 Educational Content</figcaption>
                </div>
              </figure>`
    }
    return `<a href="${source}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium text-sm">
              🔗 ${source}
            </a>`
  },

  table: (block) => {
    const { content } = block.data
    const tableRows = content
      .map((row, rowIndex) => {
        const tableCells = row
          .map((cell) => {
            if (rowIndex === 0) {
              return `<th class="px-6 py-4 bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 text-white border border-white/10 font-bold text-sm tracking-wider uppercase backdrop-blur-sm">${cell}</th>`
            }
            return `<td class="px-6 py-4 border border-slate-200/60 text-slate-700 font-medium text-sm hover:bg-blue-50/50 transition-colors duration-200">${cell}</td>`
          })
          .join("")
        const rowClasses =
          rowIndex === 0
            ? ""
            : "bg-white hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-300"
        return `<tr class="${rowClasses}">${tableCells}</tr>`
      })
      .join("")
    return `<div class="my-8 md:my-12 overflow-hidden rounded-2xl shadow-2xl border border-slate-200/60 bg-white backdrop-blur-xl">
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
      1: "text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-transparent bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text mt-12 md:mt-16 mb-6 md:mb-8 relative group",
      2: "text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 bg-clip-text mt-10 md:mt-12 mb-4 md:mb-6 relative group",
      3: "text-xl md:text-2xl lg:text-3xl font-bold text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text mt-8 md:mt-10 mb-3 md:mb-4 relative group",
      4: "text-lg md:text-xl lg:text-2xl font-semibold text-slate-800 mt-6 md:mt-8 mb-3 relative group",
      5: "text-base md:text-lg lg:text-xl font-semibold text-slate-700 mt-5 md:mt-6 mb-2 relative group",
      6: "text-sm md:text-base lg:text-lg font-semibold text-slate-600 mt-4 md:mt-5 mb-2 relative group",
    }

    const decorations = {
      1: `<div class="absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-16 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>`,
      2: `<div class="absolute -left-3 top-1/2 transform -translate-y-1/2 w-1.5 h-12 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>`,
      3: `<div class="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>`,
    }

    return `<h${level} id="${id}" class="${headerClasses[level] || headerClasses[6]}">
              ${decorations[level] || ""}
              ${text}
            </h${level}>`
  },

  quote: (block) => {
    const { text } = block.data
    return `<blockquote class="my-8 md:my-12 relative group">
              <div class="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-l-4 border-gradient-to-b from-blue-500 to-purple-500 rounded-r-2xl shadow-xl backdrop-blur-sm overflow-hidden transform group-hover:scale-[1.02] transition-all duration-500">
                <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
                <div class="relative p-6 md:p-8">
                  <div class="absolute top-4 left-4 text-blue-400/40 text-4xl font-serif">"</div>
                  <p class="text-slate-700 italic font-serif text-lg md:text-xl leading-relaxed mb-4 pl-8">${text}</p>
                  <footer class="text-sm text-slate-600 font-medium flex items-center gap-2">
                    <div class="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    Academic Insight
                  </footer>
                </div>
              </div>
            </blockquote>`
  },
}

const editorJSHTML = EditorJSHTML(customParsers)

// Enhanced Floating Action Bar
const FloatingActionBar = ({ readingProgress, onShare, onBookmark, onPrint, isBookmarked }) => (
  <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
    {/* Progress Circle */}
    <div className="relative w-14 h-14 group">
      <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="3" fill="none" className="text-slate-200" />
        <circle
          cx="28"
          cy="28"
          r="24"
          stroke="url(#progress-gradient)"
          strokeWidth="3"
          fill="none"
          strokeDasharray={`${2 * Math.PI * 24}`}
          strokeDashoffset={`${2 * Math.PI * 24 * (1 - readingProgress / 100)}`}
          className="transition-all duration-300 ease-out"
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
        <span className="text-xs font-bold text-slate-700">{Math.round(readingProgress)}%</span>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col gap-2">
      <button
        onClick={onShare}
        className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        title="Share Article"
      >
        <svg
          className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
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
        className={`w-12 h-12 ${isBookmarked ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-slate-500 to-slate-600"} hover:from-amber-500 hover:to-orange-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group`}
        title={isBookmarked ? "Remove Bookmark" : "Bookmark Article"}
      >
        <svg
          className={`w-5 h-5 group-hover:scale-110 transition-transform duration-200 ${isBookmarked ? "fill-current" : ""}`}
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
        className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        title="Print Article"
      >
        <svg
          className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
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

// Enhanced Header with glassmorphism
const BlogHeader = ({ isScrolled, isTocOpen, setIsTocOpen, readingTime }) => (
  <header
    className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${
      isScrolled
        ? "bg-white/80 backdrop-blur-2xl shadow-2xl border-b border-white/20"
        : "bg-gradient-to-r from-white/70 via-blue-50/60 to-purple-50/50 backdrop-blur-xl"
    }`}
  >
    <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsTocOpen(!isTocOpen)}
          className="lg:hidden bg-white/90 hover:bg-white shadow-xl hover:shadow-2xl rounded-2xl p-3 border border-white/40 hover:border-blue-200 transition-all duration-300 backdrop-blur-xl group"
          aria-label="Toggle Table of Contents"
        >
          <svg
            className="w-5 h-5 text-slate-700 group-hover:text-blue-600 transition-colors duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {readingTime && (
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-xl rounded-full border border-white/40 shadow-lg">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium text-slate-700">{readingTime} min read</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center flex-1">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-all duration-300">
            <span className="text-white text-xl">🎓</span>
          </div>
          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text tracking-tight">
              SpringFallUSA
            </h1>
            <p className="text-xs text-slate-600 font-medium tracking-wider">PREMIUM ACADEMIC RESOURCES</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-full border border-white/40">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-slate-700">Live</span>
        </div>
      </div>
    </div>
  </header>
)

// Enhanced TOC with better animations
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

        const indentClass = level > 2 ? "ml-6" : level > 1 ? "ml-3" : ""
        const levelColors = {
          1: "text-slate-800 font-bold",
          2: "text-blue-700 font-semibold",
          3: "text-purple-600 font-medium",
          4: "text-slate-600",
          5: "text-slate-500",
          6: "text-slate-400",
        }

        return (
          <li key={id} className={`toc-item mb-2 ${indentClass}`} style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
            <a
              href={`#${id}`}
              onClick={(e) => handleTOCClick(e, id)}
              className={`flex items-center py-3 px-4 rounded-xl transition-all duration-300 text-sm font-medium group relative overflow-hidden backdrop-blur-sm ${
                activeSection === id
                  ? "bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 text-blue-900 border border-blue-200/50 shadow-lg transform scale-[1.02]"
                  : `${levelColors[level]} hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/50 hover:text-blue-800 hover:shadow-md hover:transform hover:scale-[1.01] border border-transparent hover:border-blue-100`
              }`}
            >
              <span className="leading-tight flex-1 line-clamp-2">{title}</span>
              {activeSection === id && (
                <div className="absolute right-3 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
              )}
            </a>
          </li>
        )
      })
      .filter(Boolean)
  }

  return <ul className="space-y-1">{generateTOC(htmlContent)}</ul>
}

// Enhanced Mobile TOC
const MobileTOCOverlay = ({ isTocOpen, setIsTocOpen, htmlContent, activeSection, handleTOCClick }) => {
  if (!isTocOpen) return null

  return (
    <div className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-md" onClick={() => setIsTocOpen(false)}>
      <div
        className="bg-white/95 backdrop-blur-2xl w-[90vw] max-w-md h-full shadow-2xl overflow-y-auto mt-20 border-r border-white/20 rounded-r-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200/60 bg-gradient-to-r from-blue-50/80 to-purple-50/60">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">📚</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Table of Contents</h3>
            </div>
            <button
              onClick={() => setIsTocOpen(false)}
              className="text-slate-500 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100/60 transition-all duration-200"
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

// Enhanced Desktop TOC
const DesktopTOCSidebar = ({ htmlContent, activeSection, handleTOCClick }) => (
  <div className="hidden lg:block w-64 xl:w-72 fixed left-4 xl:left-6 top-24 h-[calc(100vh-6rem)] bg-white/90 backdrop-blur-2xl shadow-2xl border border-white/20 rounded-3xl overflow-hidden z-20 transition-all duration-500">
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-slate-200/60 bg-gradient-to-r from-blue-50/80 to-purple-50/60">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">📚</span>
          </div>
          <h4 className="text-lg font-bold text-slate-800">Table of Contents</h4>
        </div>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <TableOfContents htmlContent={htmlContent} activeSection={activeSection} handleTOCClick={handleTOCClick} />
      </div>
    </div>
  </div>
)

// Enhanced Related Institutions
const RelatedInstitutionsSidebar = ({ similarUniversities }) => {
  if (!similarUniversities || similarUniversities.length === 0) return null

  return (
    <div className="hidden xl:block w-80 absolute right-0 top-24 h-[calc(100vh-6rem)] bg-white/90 backdrop-blur-2xl shadow-2xl border border-white/20 rounded-3xl overflow-hidden z-20 transition-all duration-500">
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-slate-200/60 bg-gradient-to-r from-purple-50/80 to-pink-50/60">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">🏛️</span>
            </div>
            <h4 className="text-lg font-bold text-slate-800">Related Institutions</h4>
          </div>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {similarUniversities.map((university, index) => (
              <div
                key={university.id}
                className="group bg-gradient-to-br from-white to-slate-50/50 p-5 rounded-2xl shadow-lg border border-white/40 hover:shadow-2xl hover:border-purple-200/50 transition-all duration-500 backdrop-blur-sm transform hover:scale-[1.02] cursor-pointer"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 border border-blue-200/60 rounded-xl flex items-center justify-center group-hover:border-purple-400/50 transition-all duration-300 shadow-md">
                    <span className="text-blue-800 text-lg">🎓</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-base font-bold text-blue-900 leading-tight mb-1 group-hover:text-purple-800 transition-colors duration-300">
                      {university.name}
                    </h5>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-slate-500 font-medium">4.8</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed text-sm line-clamp-3 mb-3">{university.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Learn More</span>
                  <svg
                    className="w-4 h-4 text-purple-500 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced Article Header
const ArticleHeader = ({ title, category, createdAt, author, readingTime }) => (
  <header className="text-center mb-12 md:mb-16 pb-8 md:pb-12 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/20 rounded-3xl -mx-8 -my-8 backdrop-blur-sm"></div>
    <div className="relative">
      <div className="mb-8">
        <span className="inline-flex items-center gap-3 px-6 py-3 border-2 border-blue-200/60 text-blue-800 rounded-full text-sm font-bold tracking-wider uppercase bg-white/80 backdrop-blur-sm hover:border-purple-300 hover:shadow-xl transition-all duration-500 transform hover:scale-105">
          <span className="text-lg">🏆</span>
          {category}
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-transparent bg-gradient-to-r from-slate-800 via-blue-800 via-purple-800 to-pink-800 bg-clip-text mb-8 leading-tight tracking-tight px-4">
        {title}
      </h1>

      <div className="flex items-center justify-center space-x-6 text-slate-600 flex-wrap gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/40 shadow-lg">
          <span className="text-amber-600 text-lg">📅</span>
          <time className="font-medium text-sm">{formatDate(createdAt)}</time>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/40 shadow-lg">
          <span className="text-blue-600 text-lg">✍️</span>
          <span className="font-medium text-sm">{author || "SpringFallUSA Editorial"}</span>
        </div>

        {readingTime && (
          <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/40 shadow-lg">
            <span className="text-purple-600 text-lg">⏱️</span>
            <span className="font-medium text-sm">{readingTime} min read</span>
          </div>
        )}
      </div>
    </div>
  </header>
)

// Enhanced Cover Image
const CoverImage = ({ coverImg, title }) => {
  if (!coverImg) return null

  return (
    <figure className="mb-12 md:mb-16 group">
      <div className="relative bg-gradient-to-br from-white to-slate-50/50 p-6 md:p-8 rounded-3xl border border-white/40 shadow-2xl backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="relative overflow-hidden rounded-2xl shadow-2xl group-hover:scale-[1.02] transition-transform duration-700">
          <img
            src={coverImg || "/placeholder.svg"}
            alt="Article cover"
            className="w-full h-auto max-h-80 md:max-h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        <figcaption className="mt-6 text-center text-sm text-slate-600 italic font-medium tracking-wide">
          Featured illustration: "{title}"
        </figcaption>
      </div>
    </figure>
  )
}

// Enhanced Rating Section
const RatingSection = ({ rating }) => (
  <footer className="mt-16 md:mt-20 pt-8 md:pt-12 border-t border-gradient-to-r from-transparent via-slate-200 to-transparent">
    <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 border-2 border-blue-200/60 p-8 md:p-12 rounded-3xl text-center hover:border-purple-300 hover:shadow-2xl transition-all duration-700 backdrop-blur-sm relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">🏆</span>
          </div>
          <span className="font-black text-2xl text-slate-800">Academic Rating</span>
        </div>
        <div className="text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text mb-6">
          {rating}
        </div>
        <p className="text-sm text-slate-600 italic font-medium tracking-wide">
          Evaluated by SpringFallUSA Academic Review Board
        </p>
        <div className="flex justify-center mt-6">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-6 h-6 text-amber-400 fill-current mx-1" viewBox="0 0 20 20">
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
  const { title, description, content, coverImg, category, rating, author, createdAt, similarUniversities } = blog || {}
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

  // run once immediately so TOC is correct even on first render
  handleScroll();

  return () => window.removeEventListener("scroll", handleScroll)
}, [htmlContent])



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
      // You could add a toast notification here
    }
  }, [title, description])

  const handleBookmark = useCallback(() => {
    setIsBookmarked(!isBookmarked)
    // You could save to localStorage or send to API here
  }, [isBookmarked])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 via-purple-50/20 to-pink-50/10 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Enhanced Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200/50 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-300 ease-out shadow-lg"
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

        {/* Related Institutions Sidebar */}
        <RelatedInstitutionsSidebar similarUniversities={similarUniversities} />

        {/* Main Content */}
        <div className="flex-1 lg:ml-72 xl:ml-80 xl:mr-88 transition-all duration-500">
          <div className="max-w-4xl mx-auto lg:max-w-3xl xl:max-w-4xl">
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
              <div className="prose prose-lg max-w-none">
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

        .font-outfit { font-family: 'Inter', system-ui, sans-serif; }
        .font-serif-academic { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; }

        .academic-content {
          font-family: 'Inter', system-ui, sans-serif;
          line-height: 1.8;
          font-size: 1rem;
          color: #475569;
        }

        @media (min-width: 768px) {
          .academic-content {
            font-size: 1.125rem;
            line-height: 1.9;
          }
        }

        @media (min-width: 1024px) {
          .academic-content {
            font-size: 1.25rem;
            line-height: 2;
          }
        }

        .academic-content h1, .academic-content h2, .academic-content h3,
        .academic-content h4, .academic-content h5, .academic-content h6 {
          font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
          scroll-margin-top: 180px;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
        }

        .academic-content p {
          margin-bottom: 1.75rem;
          text-align: justify;
          hyphens: auto;
          color: #475569;
        }

        .academic-content ul, .academic-content ol {
          margin: 2rem 0;
          padding-left: 2rem;
        }

        .academic-content li {
          margin-bottom: 0.75rem;
          line-height: 1.8;
          color: #475569;
        }

        .academic-content img {
          margin: 2.5rem auto;
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

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Enhanced scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: linear-gradient(to bottom, #f1f5f9, #e2e8f0);
          border-radius: 8px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3B82F6, #8B5CF6);
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
          border-radius: 12px;
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
