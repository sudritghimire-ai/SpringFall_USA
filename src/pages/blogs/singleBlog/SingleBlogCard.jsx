"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { formatDate } from "../../../utils/formatDate"
import EditorJSHTML from "editorjs-html"

const customParsers = {
  delimiter: () =>
    '<div class="my-24 flex items-center justify-center"><div class="flex items-center gap-4"><div class="w-16 h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent opacity-60"></div><div class="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg"></div><div class="w-16 h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent opacity-60"></div></div></div>',
  
  embed: (block) => {
    const { service, source, embed } = block.data
    if (service === "youtube") {
      return `<div class="my-20 group">
                <div class="relative aspect-video rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200/50 bg-gradient-to-br from-slate-100 to-slate-200 transform transition-all duration-700 hover:scale-[1.02] hover:shadow-3xl">
                  <iframe class="w-full h-full" src="${embed}" frameborder="0" allowfullscreen></iframe>
                  <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div class="mt-6 text-center">
                  <div class="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                    <div class="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    Video Content
                  </div>
                </div>
              </div>`
    }
    return `<div class="my-12 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
              <a href="${source}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-3 text-indigo-600 hover:text-indigo-800 font-semibold transition-all duration-300 hover:bg-white px-4 py-2 rounded-lg">
                <div class="w-3 h-3 bg-indigo-500 rounded-full"></div>
                ${source}
              </a>
            </div>`
  },
  
  table: (block) => {
    const { content } = block.data
    const tableRows = content
      .map((row, rowIndex) => {
        const tableCells = row
          .map((cell, cellIndex) => {
            if (rowIndex === 0) {
              return `<th class="px-8 py-6 bg-gradient-to-r from-slate-50 via-white to-slate-50 text-slate-800 border-b-2 border-slate-200 text-base font-bold tracking-wide text-left first:rounded-tl-3xl last:rounded-tr-3xl">${cell}</th>`
            }
            return `<td class="px-8 py-6 border-b border-slate-100 text-base text-slate-700 transition-all duration-300 hover:bg-slate-50/70 hover:text-slate-900">${cell}</td>`
          })
          .join("")
        return `<tr class="hover:bg-slate-50/40 transition-all duration-300 hover:shadow-sm">${tableCells}</tr>`
      })
      .join("")
    return `<div class="my-20 overflow-hidden rounded-3xl border border-slate-200 shadow-2xl bg-white hover:shadow-3xl transition-shadow duration-700">
              <div class="overflow-x-auto">
                <table class="table-auto w-full">${tableRows}</table>
              </div>
            </div>`
  },
  
  header: (block) => {
    const { text, level } = block.data
    const id = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
    
    const spacing = level === 1 ? "mt-24 mb-12" : level === 2 ? "mt-20 mb-10" : "mt-16 mb-8"
    const size =
      level === 1
        ? "text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
        : level === 2
          ? "text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
          : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"

    return `<div class="${spacing}">
              <h${level} id="${id}" class="scroll-mt-32 ${size} font-bold text-slate-900 leading-tight font-serif tracking-tight hover:text-indigo-900 transition-colors duration-500 group cursor-pointer">
                ${text}
                <div class="w-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 group-hover:w-16 mt-4"></div>
              </h${level}>
            </div>`
  },
  
  paragraph: (block) => {
    const { text } = block.data
    return `<p class="text-xl leading-relaxed text-slate-700 mb-8 font-medium tracking-wide">${text}</p>`
  },
  
  list: (block) => {
    const { style, items } = block.data
    const listItems = items.map(item => `<li class="mb-4 text-xl text-slate-700 leading-relaxed">${item}</li>`).join('')
    const listType = style === 'ordered' ? 'ol' : 'ul'
    const listClass = style === 'ordered' ? 'list-decimal' : 'list-disc'
    
    return `<${listType} class="${listClass} pl-8 my-12 space-y-4">${listItems}</${listType}>`
  }
}

const editorJSHTML = EditorJSHTML(customParsers)

const SingleBlogCard = ({ blog }) => {
  const { title, description, content, coverImg, category, rating, author, createdAt, similarUniversities } = blog || {}
  const [activeSection, setActiveSection] = useState(null)
  const [tocOpen, setTocOpen] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [completionRate, setCompletionRate] = useState(0)
  const [estimatedReadTime, setEstimatedReadTime] = useState(0)
  const [scrollDirection, setScrollDirection] = useState('down')
  const [isScrolling, setIsScrolling] = useState(false)
  const [viewedSections, setViewedSections] = useState(new Set())
  
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef(null)
  const contentRef = useRef(null)

  const parsedContent = editorJSHTML.parse(content)
  const htmlContent = Array.isArray(parsedContent) ? parsedContent.join("") : parsedContent

  // Calculate estimated reading time
  useEffect(() => {
    if (htmlContent) {
      const wordCount = htmlContent.replace(/<[^>]*>/g, '').split(/\s+/).length
      const readTime = Math.ceil(wordCount / 200) // Average reading speed
      setEstimatedReadTime(readTime)
    }
  }, [htmlContent])

  const generateTOC = useCallback((content) => {
    const headings = content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/g)
    if (!headings) return []

    return headings
      .map((heading, index) => {
        const title = heading.replace(/<[^>]*>/g, "")
        const id = heading.match(/id="([^"]*)"/)?.[1]
        const level = heading.match(/<h([1-6])/)?.[1]
        if (!id) return null

        const animationDelay = `${(index + 1) * 0.1}s`
        const isViewed = viewedSections.has(id)

        return (
          <li
            key={id}
            className={`toc-item mb-4 ${
              level >= "3" ? "ml-12" : level === "2" ? "ml-6" : ""
            } opacity-0 animate-fade-in-up transform transition-all duration-500`}
            style={{ animationDelay }}
          >
            <a
              href={`#${id}`}
              onClick={(e) => handleTOCClick(e, id)}
              className={`group relative block py-4 px-6 rounded-2xl transition-all duration-500 text-base font-semibold border-l-4 hover:scale-105 transform ${
                activeSection === id
                  ? "bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 text-indigo-700 border-indigo-500 shadow-xl translate-x-4 scale-105"
                  : "text-slate-600 hover:text-slate-900 border-transparent hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:border-slate-300 hover:translate-x-3 hover:shadow-lg"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="block truncate leading-relaxed pr-4">{title}</span>
                <div className="flex items-center gap-2">
                  {isViewed && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                  <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                    activeSection === id 
                      ? "bg-indigo-100 text-indigo-600" 
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    H{level}
                  </div>
                </div>
              </div>
              
              {activeSection === id && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-12 bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-500 rounded-r-full shadow-lg animate-pulse"></div>
              )}
              
              <div className={`mt-2 h-1 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full transition-all duration-500 ${
                activeSection === id ? "opacity-100" : "opacity-0"
              }`}></div>
            </a>
          </li>
        )
      })
      .filter(Boolean)
  }, [activeSection, viewedSections])

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    const direction = currentScrollY > lastScrollY.current ? 'down' : 'up'
    setScrollDirection(direction)
    lastScrollY.current = currentScrollY
    
    setIsScrolling(true)
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false)
    }, 150)

    const sections = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    let currentSection = ""
    const newViewedSections = new Set(viewedSections)

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect()
      if (rect.top <= 200) {
        currentSection = section.id
        newViewedSections.add(section.id)
      }
    })

    setActiveSection(currentSection)
    setViewedSections(newViewedSections)

    // Calculate reading progress
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
    setReadingProgress(Math.min(100, Math.max(0, progress)))

    // Calculate completion rate
    const viewedCount = newViewedSections.size
    const totalSections = sections.length
    const completion = totalSections > 0 ? (viewedCount / totalSections) * 100 : 0
    setCompletionRate(Math.min(100, completion))
  }, [viewedSections])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
    }
  }, [handleScroll])

  const handleTOCClick = (e, id) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (target) {
      const yOffset = -120
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }

    if (window.innerWidth < 1024) {
      setTocOpen(false)
    }
  }

  const toggleTOC = () => {
    setTocOpen(!tocOpen)
  }

  const formatReadingTime = (minutes) => {
    if (minutes < 1) return "< 1 min read"
    return `${minutes} min read`
  }

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen">
      {/* Enhanced Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-2 bg-slate-200/50 z-50 backdrop-blur-sm">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 shadow-lg"
          style={{ width: `${readingProgress}%` }}
        >
          <div className="absolute right-0 top-0 w-4 h-full bg-white/30 animate-pulse"></div>
        </div>
      </div>

      {/* Floating Reading Stats */}
      <div className={`fixed top-6 right-6 z-40 transition-all duration-500 ${
        isScrolling ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-2'
      }`}>
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-slate-700">{Math.round(readingProgress)}%</span>
            </div>
            <div className="w-px h-4 bg-slate-300"></div>
            <div className="text-slate-600 font-medium">
              {formatReadingTime(estimatedReadTime)}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile TOC Toggle */}
      <div className="lg:hidden sticky top-2 z-40 mx-4 mt-4">
        <div className="backdrop-blur-2xl bg-white/95 border border-slate-200/60 rounded-3xl shadow-2xl overflow-hidden">
          <button
            onClick={toggleTOC}
            className="flex items-center justify-between w-full p-6 font-bold transition-all duration-500 hover:bg-slate-50"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <div className="text-left">
                <div className="text-slate-800 text-lg">Table of Contents</div>
                <div className="text-slate-500 text-sm font-medium">
                  {Math.round(completionRate)}% completed • {viewedSections.size} sections viewed
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-xs bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1 rounded-full font-bold">
                {Math.round(readingProgress)}%
              </div>
              <div
                className="transition-transform duration-500 text-slate-500"
                style={{ transform: tocOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </div>
            </div>
          </button>

          {tocOpen && (
            <div className="border-t border-slate-200 bg-white/98 backdrop-blur-2xl">
              <div className="p-6">
                {/* Mobile Progress Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                    <div className="text-2xl font-bold text-indigo-600">{Math.round(readingProgress)}%</div>
                    <div className="text-xs text-slate-600 font-medium">Progress</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">{viewedSections.size}</div>
                    <div className="text-xs text-slate-600 font-medium">Sections</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-pink-50 to-indigo-50 rounded-xl">
                    <div className="text-2xl font-bold text-pink-600">{estimatedReadTime}</div>
                    <div className="text-xs text-slate-600 font-medium">Min Read</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                    <span className="font-semibold">Reading Progress</span>
                    <span className="font-bold text-indigo-600">{Math.round(readingProgress)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 relative"
                      style={{ width: `${readingProgress}%` }}
                    >
                      <div className="absolute right-0 top-0 w-2 h-full bg-white/40 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto">
                  <ul className="space-y-2">{generateTOC(htmlContent)}</ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex">
        {/* Enhanced Desktop Sidebar TOC with Better Spacing */}
        <div className="hidden lg:block lg:w-[480px] xl:w-[520px] 2xl:w-[560px] fixed top-0 left-0 h-screen z-30">
          <div className="h-full bg-gradient-to-b from-white via-slate-50/30 to-white backdrop-blur-2xl border-r border-slate-200/60 shadow-2xl">
            <div className="p-8 xl:p-10 2xl:p-12 h-full overflow-y-auto">
              {/* Enhanced Header Section */}
              <div className="mb-12 pb-8 border-b-2 border-slate-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                  </div>
                  <h3 className="text-3xl xl:text-4xl font-bold text-slate-800 font-serif">Contents</h3>
                </div>
                <div className="w-24 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-lg mb-8"></div>

                {/* Enhanced Progress Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-5 rounded-2xl border border-indigo-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-700">Progress</span>
                      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-3xl font-bold text-indigo-600 mb-1">{Math.round(readingProgress)}%</div>
                    <div className="w-full bg-white rounded-full h-2 shadow-inner overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-700 relative"
                        style={{ width: `${readingProgress}%` }}
                      >
                        <div className="absolute right-0 top-0 w-1 h-full bg-white/50 animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 p-5 rounded-2xl border border-purple-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-700">Sections</span>
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-3xl font-bold text-purple-600 mb-1">{viewedSections.size}</div>
                    <div className="text-xs text-slate-500 font-medium">of {document.querySelectorAll("h1, h2, h3, h4, h5, h6").length} viewed</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-pink-50 via-white to-indigo-50 p-5 rounded-2xl border border-pink-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-700 mb-1">Reading Time</div>
                      <div className="text-2xl font-bold text-pink-600">{formatReadingTime(estimatedReadTime)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-slate-700 mb-1">Completion</div>
                      <div className="text-2xl font-bold text-indigo-600">{Math.round(completionRate)}%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Navigation */}
              <nav>
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Viewed sections</span>
                    <div className="w-2 h-2 bg-slate-300 rounded-full ml-4"></div>
                    <span className="font-medium">Unread sections</span>
                  </div>
                </div>
                <ul className="space-y-3">{generateTOC(htmlContent)}</ul>
              </nav>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content with Better Spacing */}
        <div className="flex-1 lg:ml-[480px] xl:ml-[520px] 2xl:ml-[560px]">
          <div className="min-h-screen">
            <div 
              ref={contentRef}
              className="max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 2xl:px-24 py-12 sm:py-16 lg:py-20 xl:py-24 2xl:py-28"
            >
              {/* Enhanced Header Section */}
              <header className="text-center mb-20 sm:mb-24 lg:mb-28 xl:mb-32 2xl:mb-36">
                <div className="mb-10 sm:mb-12">
                  <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-bold bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 text-indigo-700 border-2 border-indigo-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                    <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                    {category}
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] font-bold text-slate-900 mb-10 sm:mb-12 lg:mb-16 leading-tight font-serif tracking-tight hover:text-indigo-900 transition-colors duration-700 cursor-default">
                  {title}
                </h1>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-slate-600 text-lg sm:text-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                    <time className="font-bold">{formatDate(createdAt)}</time>
                  </div>
                  <div className="hidden sm:block w-2 h-2 bg-slate-400 rounded-full"></div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold hover:text-indigo-600 transition-colors cursor-pointer hover:underline decoration-2 underline-offset-4">
                      Admin
                    </span>
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="hidden sm:block w-2 h-2 bg-slate-400 rounded-full"></div>
                  <div className="flex items-center gap-3 text-indigo-600 font-bold">
                    <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                    {formatReadingTime(estimatedReadTime)}
                  </div>
                </div>
              </header>

              {/* Enhanced Cover Image */}
              {coverImg && (
                <div className="relative mb-20 sm:mb-24 lg:mb-28 xl:mb-32 2xl:mb-36 group">
                  <div className="relative rounded-3xl sm:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-slate-200/50 bg-gradient-to-br from-slate-100 to-slate-200 hover:shadow-3xl transition-all duration-1000">
                    <img
                      src={coverImg || "/placeholder.svg"}
                      alt={title || "Blog cover"}
                      className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-700"></div>
                    <div className="absolute bottom-8 sm:bottom-12 lg:bottom-16 left-8 sm:left-12 lg:left-16 right-8 sm:right-12 lg:right-16">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-white/25 backdrop-blur-md text-white font-bold text-xl border border-white/30 shadow-2xl">
                          <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                          {category}
                        </div>
                        <div className="text-white/80 text-lg font-semibold">
                          Featured Article
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Article Content */}
              <article className="mb-24 sm:mb-28 lg:mb-32 xl:mb-36 2xl:mb-40">
                <div
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                  className="prose prose-xl sm:prose-2xl lg:prose-3xl prose-slate max-w-none
                    prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-slate-900 prose-headings:scroll-mt-32
                    prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-xl sm:prose-p:text-2xl lg:prose-p:text-3xl prose-p:mb-10 sm:prose-p:mb-12 prose-p:font-medium prose-p:tracking-wide
                    prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:text-indigo-800 prose-a:font-bold prose-a:transition-all prose-a:duration-300 hover:prose-a:bg-indigo-50 prose-a:px-2 prose-a:py-1 prose-a:rounded-lg prose-a:border prose-a:border-transparent hover:prose-a:border-indigo-200
                    prose-strong:text-slate-900 prose-strong:font-bold prose-strong:bg-yellow-50 prose-strong:px-1 prose-strong:rounded
                    prose-em:text-slate-700 prose-em:italic prose-em:font-semibold prose-em:bg-slate-50 prose-em:px-1 prose-em:rounded
                    prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-4 prose-code:py-2 prose-code:rounded-xl prose-code:font-mono prose-code:text-lg prose-code:border prose-code:border-indigo-200 prose-code:shadow-sm prose-code:font-semibold
                    prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-3xl prose-pre:shadow-2xl prose-pre:border prose-pre:border-slate-700 prose-pre:p-10 prose-pre:my-16
                    prose-blockquote:border-l-8 prose-blockquote:border-indigo-500 prose-blockquote:bg-gradient-to-r prose-blockquote:from-indigo-50 prose-blockquote:via-purple-50 prose-blockquote:to-pink-50 prose-blockquote:p-10 sm:prose-blockquote:p-12 prose-blockquote:rounded-r-3xl prose-blockquote:italic prose-blockquote:text-slate-700 prose-blockquote:shadow-xl prose-blockquote:my-16 prose-blockquote:font-semibold prose-blockquote:text-xl
                    prose-ul:text-slate-700 prose-ol:text-slate-700 prose-ul:text-xl sm:prose-ul:text-2xl lg:prose-ul:text-3xl prose-ol:text-xl sm:prose-ol:text-2xl lg:prose-ol:text-3xl prose-ul:my-12 prose-ol:my-12
                    prose-li:text-slate-700 prose-li:leading-relaxed prose-li:mb-6 prose-li:text-xl sm:prose-li:text-2xl lg:prose-li:text-3xl prose-li:font-medium
                    prose-img:rounded-3xl prose-img:shadow-2xl prose-img:ring-1 prose-img:ring-slate-200 prose-img:my-16 sm:prose-img:my-20 prose-img:hover:scale-105 prose-img:transition-transform prose-img:duration-700"
                />
              </article>

              {/* Enhanced Similar Universities Section */}
              {similarUniversities && similarUniversities.length > 0 && (
                <section className="border-t-4 border-slate-200 pt-20 sm:pt-24 lg:pt-28 mt-20 sm:mt-24 lg:mt-28">
                  <div className="mb-16 sm:mb-20 lg:mb-24">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                      <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 font-serif hover:text-indigo-900 transition-colors duration-500">
                        Similar Universities
                      </h2>
                    </div>
                    <div className="w-32 sm:w-36 lg:w-40 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-lg"></div>
                  </div>

                  <div className="grid gap-10 sm:gap-12 lg:gap-16">
                    {similarUniversities.map((university, index) => (
                      <div
                        key={university.id}
                        className="group bg-gradient-to-br from-white via-slate-50/60 to-white p-10 sm:p-12 lg:p-16 xl:p-20 rounded-3xl sm:rounded-[2.5rem] lg:rounded-[3rem] shadow-2xl hover:shadow-3xl transition-all duration-700 border-2 border-slate-200 hover:border-indigo-200 hover:-translate-y-4 hover:scale-[1.02] transform-gpu"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        <div className="flex items-start gap-6 mb-8">
                          <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse flex-shrink-0 mt-2"></div>
                          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 group-hover:text-indigo-700 transition-colors duration-500 font-serif leading-tight">
                            {university.name}
                          </h3>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-xl sm:text-2xl lg:text-3xl font-medium tracking-wide pl-12">
                          {university.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Enhanced Rating Section */}
              <div className="mt-20 sm:mt-24 lg:mt-28 pt-16 sm:pt-20 lg:pt-24 border-t-4 border-slate-200">
                <div className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-12 sm:p-16 lg:p-20 xl:p-24 rounded-3xl sm:rounded-[2.5rem] lg:rounded-[3rem] border-4 border-indigo-100 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-[1.02] transform-gpu">
                  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
                    <div className="flex items-center gap-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg animate-pulse"></div>
                      <span className="font-bold text-slate-800 text-2xl sm:text-3xl lg:text-4xl">Rating:</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                      <span className="text-6xl sm:text-7xl lg:text-8xl font-bold text-indigo-600 font-serif">
                        {rating}
                      </span>
                      <div className="text-slate-500 text-lg sm:text-xl font-bold text-center sm:text-left">
                        <div className="mb-2">(evaluated by</div>
                        <div className="text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer hover:underline decoration-2 underline-offset-4">
                          SpringFallUSA)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleBlogCard
