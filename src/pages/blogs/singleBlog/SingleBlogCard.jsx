"use client"

import { useEffect, useState } from "react"
import { formatDate } from "../../../utils/formatDate"
import EditorJSHTML from "editorjs-html"

const customParsers = {
  delimiter: () =>
    '<div class="my-20 flex items-center justify-center"><div class="w-32 h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent opacity-60"></div></div>',
  embed: (block) => {
    const { service, source, embed } = block.data
    if (service === "youtube") {
      return `<div class="my-16 group">
                <div class="relative aspect-video rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200/50 bg-gradient-to-br from-slate-100 to-slate-200 transform transition-all duration-700 hover:scale-[1.02] hover:shadow-3xl">
                  <iframe class="w-full h-full" src="${embed}" frameborder="0" allowfullscreen></iframe>
                  <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>`
    }
    return `<a href="${source}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-all duration-300 underline decoration-2 underline-offset-4 hover:decoration-indigo-300 hover:bg-indigo-50 px-2 py-1 rounded-lg">${source}</a>`
  },
  table: (block) => {
    const { content } = block.data
    const tableRows = content
      .map((row, rowIndex) => {
        const tableCells = row
          .map((cell, cellIndex) => {
            if (rowIndex === 0) {
              return `<th class="px-6 py-5 bg-gradient-to-r from-slate-50 via-white to-slate-50 text-slate-800 border-b-2 border-slate-200 text-sm md:text-base font-bold tracking-wide text-left first:rounded-tl-2xl last:rounded-tr-2xl">${cell}</th>`
            }
            return `<td class="px-6 py-5 border-b border-slate-100 text-sm md:text-base text-slate-700 transition-all duration-300 hover:bg-slate-50/70 hover:text-slate-900">${cell}</td>`
          })
          .join("")
        return `<tr class="hover:bg-slate-50/40 transition-all duration-300 hover:shadow-sm">${tableCells}</tr>`
      })
      .join("")
    return `<div class="my-16 overflow-hidden rounded-3xl border border-slate-200 shadow-xl bg-white hover:shadow-2xl transition-shadow duration-500">
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
    const spacing = level === 1 ? "mt-20 mb-10" : level === 2 ? "mt-16 mb-8" : "mt-14 mb-6"
    const size = level === 1 
      ? "text-4xl sm:text-5xl md:text-6xl lg:text-7xl" 
      : level === 2 
        ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl" 
        : "text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
    
    return `<h${level} id="${id}" class="scroll-mt-32 ${spacing} ${size} font-bold text-slate-900 leading-tight font-serif tracking-tight hover:text-indigo-900 transition-colors duration-300">${text}</h${level}>`
  },
}

const editorJSHTML = EditorJSHTML(customParsers)

const SingleBlogCard = ({ blog }) => {
  const { title, description, content, coverImg, category, rating, author, createdAt, similarUniversities } = blog || {}
  const [activeSection, setActiveSection] = useState(null)
  const [tocOpen, setTocOpen] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [completionRate, setCompletionRate] = useState(0)

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

        const animationDelay = `${(index + 1) * 0.1}s`

        return (
          <li
            key={id}
            className={`toc-item mb-3 ${level >= "3" ? "ml-8" : level === "2" ? "ml-4" : ""} opacity-0 animate-fade-in-up`}
            style={{ animationDelay }}
          >
            <a
              href={`#${id}`}
              onClick={(e) => handleTOCClick(e, id)}
              className={`group relative block py-4 px-5 rounded-2xl transition-all duration-400 text-sm font-medium border-l-4 hover:scale-105 ${
                activeSection === id
                  ? "bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 text-indigo-700 border-indigo-500 shadow-lg transform translate-x-3 scale-105"
                  : "text-slate-600 hover:text-slate-900 border-transparent hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:border-slate-300 hover:translate-x-2 hover:shadow-md"
              }`}
            >
              <span className="block truncate leading-relaxed font-medium">{title}</span>
              {activeSection === id && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-500 rounded-r-full shadow-lg animate-pulse"></div>
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
        if (window.scrollY >= section.offsetTop - 150) {
          currentSection = section.id
        }
      })

      setActiveSection(currentSection)

      // Calculate reading progress
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setReadingProgress(Math.min(100, Math.max(0, progress)))

      // Calculate completion rate based on sections viewed
      const viewedSections = Array.from(sections).filter(section => 
        window.scrollY >= section.offsetTop - 200
      ).length
      const totalSections = sections.length
      const completion = totalSections > 0 ? (viewedSections / totalSections) * 100 : 0
      setCompletionRate(Math.min(100, completion))
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
    <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 transition-all duration-300 shadow-sm"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      {/* Mobile TOC Toggle */}
      <div className="lg:hidden sticky top-1 z-40 backdrop-blur-2xl bg-white/90 border border-slate-200/60 mx-4 mt-4 rounded-2xl shadow-xl">
        <div className="p-5">
          <button
            onClick={toggleTOC}
            className="flex items-center justify-between w-full bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 text-slate-700 p-6 rounded-2xl font-semibold transition-all duration-400 shadow-md hover:shadow-lg border border-slate-200 hover:scale-[1.02]"
          >
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-sm"></div>
              <span className="text-base">Table of Contents</span>
              <div className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                {Math.round(completionRate)}%
              </div>
            </div>
            <div
              className="transition-transform duration-400 text-slate-500"
              style={{ transform: tocOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </div>
          </button>

          {tocOpen && (
            <div className="bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-2xl mt-5 p-6 shadow-2xl max-h-[75vh] overflow-y-auto">
              <div className="mb-4 pb-4 border-b border-slate-200">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Reading Progress</span>
                  <span className="font-semibold">{Math.round(readingProgress)}%</span>
                </div>
                <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${readingProgress}%` }}
                  ></div>
                </div>
              </div>
              <ul className="space-y-2 relative">{generateTOC(htmlContent)}</ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar TOC */}
        <div className="hidden lg:block lg:w-[420px] xl:w-[480px] fixed top-0 left-0 h-screen bg-gradient-to-b from-white via-slate-50/40 to-white backdrop-blur-2xl border-r border-slate-200/60 shadow-2xl z-30">
          <div className="p-8 xl:p-10 h-full overflow-y-auto">
            <div className="mb-12 pb-8 border-b border-slate-200">
              <h3 className="text-2xl xl:text-3xl font-bold text-slate-800 mb-4 font-serif">Contents</h3>
              <div className="w-20 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full shadow-lg"></div>
              
              {/* Progress Stats */}
              <div className="mt-6 space-y-4">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                  <div className="flex items-center justify-between text-sm text-slate-700 mb-2">
                    <span className="font-medium">Reading Progress</span>
                    <span className="font-bold text-indigo-600">{Math.round(readingProgress)}%</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${readingProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100">
                  <div className="flex items-center justify-between text-sm text-slate-700">
                    <span className="font-medium">Completion Rate</span>
                    <span className="font-bold text-purple-600">{Math.round(completionRate)}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <nav>
              <ul className="space-y-3 relative">{generateTOC(htmlContent)}</ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-[420px] xl:ml-[480px]">
          <div className="max-w-5xl xl:max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 lg:py-16 xl:py-20">
            {/* Header Section */}
            <header className="text-center mb-16 sm:mb-20 lg:mb-24 xl:mb-28">
              <div className="mb-8 sm:mb-10">
                <span className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 rounded-full text-sm sm:text-base font-bold bg-gradient-to-r from-indigo-100 via-purple-100 to-indigo-100 text-indigo-700 border-2 border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  {category}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-slate-900 mb-8 sm:mb-10 lg:mb-12 leading-tight font-serif tracking-tight hover:text-indigo-900 transition-colors duration-500">
                {title}
              </h1>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-slate-600 text-base sm:text-lg">
                <time className="font-semibold">{formatDate(createdAt)}</time>
                <div className="hidden sm:block w-2 h-2 bg-slate-400 rounded-full"></div>
                <span className="font-semibold hover:text-indigo-600 transition-colors cursor-pointer hover:underline decoration-2 underline-offset-4">
                  Admin
                </span>
              </div>
            </header>

            {/* Cover Image */}
            {coverImg && (
              <div className="relative mb-16 sm:mb-20 lg:mb-24 xl:mb-28 group">
                <div className="relative rounded-3xl sm:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-slate-200/50 bg-gradient-to-br from-slate-100 to-slate-200 hover:shadow-3xl transition-all duration-700">
                  <img
                    src={coverImg || "/placeholder.svg"}
                    alt={title || "Blog cover"}
                    className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                  <div className="absolute bottom-6 sm:bottom-8 lg:bottom-10 left-6 sm:left-8 lg:left-10 right-6 sm:right-8 lg:right-10">
                    <div className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/25 backdrop-blur-md text-white font-bold text-lg sm:text-xl border border-white/30 shadow-2xl hover:bg-white/35 transition-all duration-300">
                      {category}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Article Content */}
            <article className="mb-20 sm:mb-24 lg:mb-28 xl:mb-32">
              <div
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                className="prose prose-lg sm:prose-xl lg:prose-2xl prose-slate max-w-none
                  prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-slate-900 prose-headings:scroll-mt-32
                  prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-lg sm:prose-p:text-xl lg:prose-p:text-2xl prose-p:mb-8 sm:prose-p:mb-10
                  prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:text-indigo-800 prose-a:font-semibold prose-a:transition-all prose-a:duration-300 hover:prose-a:bg-indigo-50 prose-a:px-1 prose-a:py-0.5 prose-a:rounded-md
                  prose-strong:text-slate-900 prose-strong:font-bold
                  prose-em:text-slate-700 prose-em:italic prose-em:font-medium
                  prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-3 prose-code:py-2 prose-code:rounded-xl prose-code:font-mono prose-code:text-base prose-code:border prose-code:border-indigo-200 prose-code:shadow-sm
                  prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-3xl prose-pre:shadow-2xl prose-pre:border prose-pre:border-slate-700 prose-pre:p-8
                  prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-gradient-to-r prose-blockquote:from-indigo-50 prose-blockquote:via-purple-50 prose-blockquote:to-indigo-50 prose-blockquote:p-8 sm:prose-blockquote:p-10 prose-blockquote:rounded-r-3xl prose-blockquote:italic prose-blockquote:text-slate-700 prose-blockquote:shadow-lg prose-blockquote:border-l-8
                  prose-ul:text-slate-700 prose-ol:text-slate-700 prose-ul:text-lg sm:prose-ul:text-xl lg:prose-ul:text-2xl prose-ol:text-lg sm:prose-ol:text-xl lg:prose-ol:text-2xl
                  prose-li:text-slate-700 prose-li:leading-relaxed prose-li:mb-4 prose-li:text-lg sm:prose-li:text-xl lg:prose-li:text-2xl
                  prose-img:rounded-3xl prose-img:shadow-2xl prose-img:ring-1 prose-img:ring-slate-200 prose-img:my-12 sm:prose-img:my-16"
              />
            </article>

            {/* Similar Universities Section */}
            {similarUniversities && similarUniversities.length > 0 && (
              <section className="border-t-2 border-slate-200 pt-16 sm:pt-20 lg:pt-24 mt-16 sm:mt-20 lg:mt-24">
                <div className="mb-12 sm:mb-16 lg:mb-20">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-6 font-serif hover:text-indigo-900 transition-colors duration-300">
                    Similar Universities
                  </h2>
                  <div className="w-24 sm:w-28 lg:w-32 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full shadow-lg"></div>
                </div>
                
                <div className="grid gap-8 sm:gap-10 lg:gap-12">
                  {similarUniversities.map((university, index) => (
                    <div
                      key={university.id}
                      className="group bg-gradient-to-br from-white via-slate-50/60 to-white p-8 sm:p-10 lg:p-12 xl:p-14 rounded-3xl sm:rounded-[2rem] lg:rounded-[2.5rem] shadow-xl hover:shadow-3xl transition-all duration-700 border-2 border-slate-200 hover:border-indigo-200 hover:-translate-y-3 hover:scale-[1.02] transform-gpu"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-6 group-hover:text-indigo-700 transition-colors duration-400 font-serif leading-tight">
                        {university.name}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-lg sm:text-xl lg:text-2xl font-medium">
                        {university.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rating Section */}
            <div className="mt-16 sm:mt-20 lg:mt-24 pt-12 sm:pt-16 lg:pt-20 border-t-2 border-slate-200">
              <div className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-10 sm:p-12 lg:p-16 rounded-3xl sm:rounded-[2rem] lg:rounded-[2.5rem] border-2 border-indigo-100 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg animate-pulse"></div>
                    <span className="font-bold text-slate-800 text-xl sm:text-2xl lg:text-3xl">Rating:</span>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-indigo-600 font-serif">{rating}</span>
                    <div className="text-slate-500 text-base sm:text-lg font-semibold">
                      <div>(evaluated by</div>
                      <div className="text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer">SpringFallUSA)</div>
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
