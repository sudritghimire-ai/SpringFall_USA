"use client"

import { useEffect, useState } from "react"
import { formatDate } from "../../../utils/formatDate"
import EditorJSHTML from "editorjs-html"

const customParsers = {
  delimiter: () => '<hr class="my-16 border-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-60" />',
  embed: (block) => {
    const { service, source, embed } = block.data
    if (service === "youtube") {
      return `<div class="aspect-w-16 aspect-h-9 my-12 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-200/50 bg-gradient-to-br from-slate-50 to-slate-100">
                <iframe class="w-full h-[300px] md:h-[400px] lg:h-[500px]" src="${embed}" frameborder="0" allowfullscreen></iframe>
              </div>`
    }
    return `<a href="${source}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-all duration-300 underline decoration-2 underline-offset-4 hover:decoration-indigo-300">${source}</a>`
  },
  table: (block) => {
    const { content } = block.data
    const tableRows = content
      .map((row, rowIndex) => {
        const tableCells = row
          .map((cell, cellIndex) => {
            if (rowIndex === 0) {
              return `<th class="px-6 py-4 bg-gradient-to-r from-slate-50 via-white to-slate-50 text-slate-800 border-b-2 border-slate-200 text-sm md:text-base font-semibold tracking-wide text-left">${cell}</th>`
            }
            return `<td class="px-6 py-4 border-b border-slate-100 text-sm md:text-base text-slate-700 transition-colors duration-200 hover:bg-slate-50/50">${cell}</td>`
          })
          .join("")
        return `<tr class="hover:bg-slate-50/30 transition-colors duration-200">${tableCells}</tr>`
      })
      .join("")
    return `<div class="my-12 overflow-hidden rounded-2xl border border-slate-200 shadow-lg bg-white"><div class="overflow-x-auto"><table class="table-auto w-full">${tableRows}</table></div></div>`
  },
  header: (block) => {
    const { text, level } = block.data
    const id = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
    return `<h${level} id="${id}" class="scroll-mt-32 ${
      level === 1
        ? "text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mt-16 mb-8 leading-tight"
        : level === 2
          ? "text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mt-14 mb-6 leading-tight"
          : "text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-700 mt-12 mb-5 leading-tight"
    } font-serif tracking-tight">${text}</h${level}>`
  },
}

const editorJSHTML = EditorJSHTML(customParsers)

const SingleBlogCard = ({ blog }) => {
  const { title, description, content, coverImg, category, rating, author, createdAt, similarUniversities } = blog || {}
  const [activeSection, setActiveSection] = useState(null)
  const [tocOpen, setTocOpen] = useState(false)

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

        const animationDelay = `${(index + 1) * 0.15}s`

        return (
          <li
            key={id}
            className={`toc-item mb-2 ${level >= "3" ? "ml-6" : ""} opacity-0 animate-fade-in-up`}
            style={{ animationDelay }}
          >
            <a
              href={`#${id}`}
              onClick={(e) => handleTOCClick(e, id)}
              className={`group relative block py-3 px-4 rounded-xl transition-all duration-300 text-sm font-medium border-l-4 ${
                activeSection === id
                  ? "bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 text-indigo-700 border-indigo-500 shadow-sm transform translate-x-2"
                  : "text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-50 hover:border-slate-300 hover:translate-x-1"
              }`}
            >
              <span className="block truncate leading-relaxed">{title}</span>
              {activeSection === id && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full shadow-sm"></div>
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
        if (window.scrollY >= section.offsetTop - 120) {
          currentSection = section.id
        }
      })

      setActiveSection(currentSection)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleTOCClick = (e, id) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 100,
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
      {/* Mobile TOC Toggle */}
      <div className="lg:hidden sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-slate-200/60 p-5 shadow-sm">
        <button
          onClick={toggleTOC}
          className="flex items-center justify-between w-full bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 text-slate-700 p-5 rounded-2xl font-medium transition-all duration-300 shadow-sm hover:shadow-md border border-slate-200"
        >
          <span className="flex items-center gap-3">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            <span className="font-semibold">Table of Contents</span>
          </span>
          <div
            className="transition-transform duration-300 text-slate-500"
            style={{ transform: tocOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </div>
        </button>

        {tocOpen && (
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl mt-4 p-5 shadow-2xl max-h-[70vh] overflow-y-auto">
            <ul className="space-y-1 relative">{generateTOC(htmlContent)}</ul>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Desktop Sidebar TOC */}
        <div className="hidden lg:block lg:w-96 fixed top-0 left-0 h-screen bg-gradient-to-b from-white via-slate-50/30 to-white backdrop-blur-xl border-r border-slate-200/60 shadow-2xl z-40">
          <div className="p-8 h-full overflow-y-auto">
            <div className="mb-10 pb-8 border-b border-slate-200">
              <h3 className="text-2xl font-bold text-slate-800 mb-3 font-serif">Contents</h3>
              <div className="w-16 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full shadow-sm"></div>
            </div>
            <nav>
              <ul className="space-y-2 relative">{generateTOC(htmlContent)}</ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-96">
          <div className="max-w-5xl mx-auto px-8 py-12 lg:px-16 lg:py-20">
            {/* Header Section */}
            <header className="text-center mb-16 lg:mb-20">
              <div className="mb-8">
                <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-indigo-100 via-purple-100 to-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm">
                  {category}
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-8 leading-tight font-serif tracking-tight">
                {title}
              </h1>
              <div className="flex items-center justify-center gap-6 text-slate-600">
                <time className="text-base font-medium">{formatDate(createdAt)}</time>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                <span className="text-base font-medium hover:text-indigo-600 transition-colors cursor-pointer">
                  Admin
                </span>
              </div>
            </header>

            {/* Cover Image */}
            {coverImg && (
              <div className="relative mb-16 lg:mb-20 group">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200/50 bg-gradient-to-br from-slate-100 to-slate-200">
                  <img
                    src={coverImg || "/placeholder.svg"}
                    alt={title || "Blog cover"}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="inline-flex items-center px-6 py-3 rounded-xl bg-white/20 backdrop-blur-md text-white font-semibold text-lg border border-white/20 shadow-lg">
                      {category}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Article Content */}
            <article className="mb-20">
              <div
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                className="prose prose-xl prose-slate max-w-none
                  prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-slate-900
                  prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-xl prose-p:mb-8
                  prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:text-indigo-800 prose-a:font-medium prose-a:transition-all prose-a:duration-300
                  prose-strong:text-slate-900 prose-strong:font-semibold
                  prose-em:text-slate-700 prose-em:italic
                  prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-3 prose-code:py-1.5 prose-code:rounded-lg prose-code:font-mono prose-code:text-base prose-code:border prose-code:border-indigo-200
                  prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-2xl prose-pre:shadow-2xl prose-pre:border prose-pre:border-slate-700
                  prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-gradient-to-r prose-blockquote:from-indigo-50 prose-blockquote:to-purple-50 prose-blockquote:p-8 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-slate-700 prose-blockquote:shadow-sm
                  prose-ul:text-slate-700 prose-ol:text-slate-700 prose-ul:text-xl prose-ol:text-xl
                  prose-li:text-slate-700 prose-li:leading-relaxed prose-li:mb-3
                  prose-img:rounded-2xl prose-img:shadow-xl prose-img:ring-1 prose-img:ring-slate-200"
              />
            </article>

            {/* Similar Universities Section */}
            {similarUniversities && similarUniversities.length > 0 && (
              <section className="border-t border-slate-200 pt-16 mt-16">
                <div className="mb-12">
                  <h2 className="text-4xl font-bold text-slate-900 mb-4 font-serif">Similar Universities</h2>
                  <div className="w-20 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full shadow-sm"></div>
                </div>
                <div className="grid gap-8">
                  {similarUniversities.map((university, index) => (
                    <div
                      key={university.id}
                      className="group bg-gradient-to-br from-white via-slate-50/50 to-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 hover:border-indigo-200 hover:-translate-y-2 hover:scale-[1.02]"
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-indigo-700 transition-colors duration-300 font-serif">
                        {university.name}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-lg">{university.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rating Section */}
            <div className="mt-16 pt-12 border-t border-slate-200">
              <div className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-10 rounded-3xl border border-indigo-100 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-sm"></div>
                    <span className="font-bold text-slate-800 text-xl">Rating:</span>
                  </div>
                  <span className="text-3xl font-bold text-indigo-600">{rating}</span>
                  <span className="text-slate-500 text-base font-medium">(evaluated by SpringFallUSA)</span>
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
