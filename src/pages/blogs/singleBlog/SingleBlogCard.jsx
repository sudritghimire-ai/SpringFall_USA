"use client"

import { useEffect, useState } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { formatDate } from "../../../utils/formatDate"
import EditorJSHTML from "editorjs-html"

const customParsers = {
  delimiter: () => '<hr class="my-12 border-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />',
  embed: (block) => {
    const { service, source, embed } = block.data
    if (service === "youtube") {
      return `<div class="aspect-w-16 aspect-h-9 mb-8 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-200">
                <iframe class="w-full h-[300px] md:h-[400px] lg:h-[500px]" src="${embed}" frameborder="0" allowfullscreen></iframe>
              </div>`
    }
    return `<a href="${source}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200">${source}</a>`
  },
  table: (block) => {
    const { content } = block.data
    const tableRows = content
      .map((row, rowIndex) => {
        const tableCells = row
          .map((cell, cellIndex) => {
            if (rowIndex === 0) {
              return `<th class="px-4 py-3 md:px-6 md:py-4 bg-gradient-to-r from-slate-50 to-slate-100 text-slate-800 border-b-2 border-slate-200 text-sm md:text-base font-semibold tracking-wide">${cell}</th>`
            }
            return `<td class="px-4 py-3 md:px-6 md:py-4 border-b border-slate-100 text-sm md:text-base text-slate-700 hover:bg-slate-50 transition-colors duration-150">${cell}</td>`
          })
          .join("")
        return `<tr class="hover:bg-slate-50/50 transition-colors duration-150">${tableCells}</tr>`
      })
      .join("")
    return `<div class="overflow-hidden rounded-xl border border-slate-200 shadow-lg mb-8"><div class="overflow-x-auto"><table class="table-auto w-full">${tableRows}</table></div></div>`
  },
  header: (block) => {
    const { text, level } = block.data
    const id = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
    return `<h${level} id="${id}" class="scroll-mt-24 ${
      level === 1
        ? "text-4xl md:text-5xl font-bold text-slate-900 mt-12 mb-6 leading-tight"
        : level === 2
          ? "text-3xl md:text-4xl font-bold text-slate-800 mt-10 mb-5 leading-tight"
          : "text-2xl md:text-3xl font-semibold text-slate-700 mt-8 mb-4 leading-tight"
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

        const animationDelay = `${(index + 1) * 0.1}s`

        return (
          <li
            key={id}
            className={`toc-item mb-1 ${level >= "3" ? "ml-4" : ""} opacity-0 animate-fade-in-up`}
            style={{ animationDelay }}
          >
            <a
              href={`#${id}`}
              onClick={(e) => handleTOCClick(e, id)}
              className={`group block py-2.5 px-4 rounded-lg transition-all duration-300 text-sm font-medium border-l-3 ${
                activeSection === id
                  ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-indigo-500 shadow-sm transform translate-x-1"
                  : "text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-50 hover:border-slate-200"
              }`}
            >
              <span className="block truncate">{title}</span>
              {activeSection === id && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full"></div>
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
      <div className="lg:hidden sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/60 p-4 shadow-sm">
        <button
          onClick={toggleTOC}
          className="flex items-center justify-between w-full bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 text-slate-700 p-4 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md border border-slate-200"
        >
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            Table of Contents
          </span>
          <div
            className="transition-transform duration-300"
            style={{ transform: tocOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            {tocOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>

        {tocOpen && (
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl mt-3 p-4 shadow-xl max-h-[60vh] overflow-y-auto">
            <ul className="space-y-1 relative">{generateTOC(htmlContent)}</ul>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Desktop Sidebar TOC */}
        <div className="hidden lg:block lg:w-80 fixed top-0 left-0 h-screen bg-gradient-to-b from-white via-slate-50/50 to-white backdrop-blur-xl border-r border-slate-200/60 shadow-xl z-40">
          <div className="p-6 h-full overflow-y-auto">
            <div className="mb-8 pb-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-2 font-serif">Contents</h3>
              <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
            </div>
            <ul className="space-y-1 relative">{generateTOC(htmlContent)}</ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-80">
          <div className="max-w-4xl mx-auto px-6 py-8 lg:px-12 lg:py-16">
            {/* Header Section */}
            <header className="text-center mb-12 lg:mb-16">
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border border-indigo-200">
                  {category}
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight font-serif tracking-tight">
                {title}
              </h1>
              <div className="flex items-center justify-center gap-4 text-slate-600">
                <time className="text-sm font-medium">{formatDate(createdAt)}</time>
                <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                <span className="text-sm font-medium hover:text-indigo-600 transition-colors cursor-pointer">
                  Admin
                </span>
              </div>
            </header>

            {/* Cover Image */}
            {coverImg && (
              <div className="relative mb-12 lg:mb-16 group">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-200 bg-gradient-to-br from-slate-100 to-slate-200">
                  <img
                    src={coverImg || "/placeholder.svg"}
                    alt={title || "Blog cover"}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="inline-flex items-center px-4 py-2 rounded-lg bg-white/20 backdrop-blur-md text-white font-semibold text-lg border border-white/20">
                      {category}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Article Content */}
            <article className="mb-16">
              <div
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                className="prose prose-lg prose-slate max-w-none
                  prose-headings:font-serif prose-headings:tracking-tight
                  prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-lg
                  prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:text-indigo-800 prose-a:font-medium prose-a:transition-colors
                  prose-strong:text-slate-900 prose-strong:font-semibold
                  prose-em:text-slate-700 prose-em:italic
                  prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm
                  prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:shadow-xl
                  prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50 prose-blockquote:p-6 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-slate-700
                  prose-ul:text-slate-700 prose-ol:text-slate-700
                  prose-li:text-slate-700 prose-li:leading-relaxed
                  prose-img:rounded-xl prose-img:shadow-lg prose-img:ring-1 prose-img:ring-slate-200"
              />
            </article>

            {/* Similar Universities Section */}
            {similarUniversities && similarUniversities.length > 0 && (
              <section className="border-t border-slate-200 pt-12 mt-12">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-3 font-serif">Similar Universities</h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                </div>
                <div className="grid gap-6">
                  {similarUniversities.map((university, index) => (
                    <div
                      key={university.id}
                      className="group bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-indigo-200 hover:-translate-y-1"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-700 transition-colors font-serif">
                        {university.name}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">{university.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rating Section */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <div className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-8 rounded-2xl border border-indigo-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                    <span className="font-semibold text-slate-800 text-lg">Rating:</span>
                  </div>
                  <span className="text-2xl font-bold text-indigo-600">{rating}</span>
                  <span className="text-slate-500 text-sm font-medium">(evaluated by SpringFallUSA)</span>
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
