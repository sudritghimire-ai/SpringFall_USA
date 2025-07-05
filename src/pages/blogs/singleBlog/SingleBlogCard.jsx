"use client"

import { useEffect, useState } from "react"
import { formatDate } from "../../../utils/formatDate"
import EditorJSHTML from "editorjs-html"

// Custom parsers for EditorJS content
const customParsers = {
  delimiter: () =>
    `<hr class="my-6 md:my-8 border-t border-amber-200/40 relative before:content-[''] before:absolute before:top-[-1px] before:left-1/2 before:transform before:-translate-x-1/2 before:w-12 md:before:w-16 before:h-0.5 before:bg-gradient-to-r before:from-amber-600 before:to-amber-400" />`,

  embed: (block) => {
    const { service, source, embed } = block.data
    if (service === "youtube") {
      return `<figure class="my-6 md:my-8 bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-slate-200/60 backdrop-blur-sm">
                <div class="aspect-video rounded-lg md:rounded-xl overflow-hidden border border-slate-300/50 shadow-md">
                  <iframe class="w-full h-full" src="${embed}" frameborder="0" allowfullscreen></iframe>
                </div>
                <figcaption class="mt-3 md:mt-4 text-xs md:text-sm text-slate-600 italic font-serif-academic text-center tracking-wide">Educational Video Content</figcaption>
              </figure>`
    }
    return `<a href="${source}" target="_blank" rel="noopener noreferrer" class="text-blue-800 hover:text-amber-600 underline decoration-2 underline-offset-2 transition-all duration-300 font-medium break-all">${source}</a>`
  },

  table: (block) => {
    const { content } = block.data
    const tableRows = content
      .map((row, rowIndex) => {
        const tableCells = row
          .map((cell) => {
            if (rowIndex === 0) {
              return `<th class="px-3 md:px-5 lg:px-6 py-3 md:py-4 bg-gradient-to-r from-slate-800 to-slate-700 text-white border border-slate-300/30 font-serif-academic text-xs md:text-sm font-semibold tracking-wider uppercase">${cell}</th>`
            }
            return `<td class="px-3 md:px-5 lg:px-6 py-3 md:py-4 border border-slate-200/60 text-slate-700 font-outfit leading-relaxed text-sm md:text-base">${cell}</td>`
          })
          .join("")
        const rowClasses =
          rowIndex === 0 ? "" : "bg-white sm:even:bg-slate-50/40 sm:hover:bg-blue-50/60 transition-all duration-200"
        return `<tr class="${rowClasses}">${tableCells}</tr>`
      })
      .join("")
    return `<div class="my-6 md:my-8 overflow-x-auto rounded-xl md:rounded-2xl shadow-lg border border-slate-200/60 bg-white">
              <table class="w-full min-w-[600px] border-collapse bg-white">
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
      1: "text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif-academic font-bold text-slate-800 mt-8 md:mt-10 mb-4 md:mb-6 pb-3 md:pb-4 border-b-2 border-gradient-to-r from-amber-600 to-amber-400 relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-16 md:after:w-20 after:h-0.5 after:bg-gradient-to-r after:from-amber-600 after:to-amber-400",
      2: "text-xl md:text-2xl lg:text-3xl font-serif-academic font-semibold text-blue-900 mt-8 md:mt-10 mb-3 md:mb-4 relative before:content-[''] before:absolute before:left-[-1rem] md:before:left-[-1.5rem] before:top-1/2 before:transform before:-translate-y-1/2 before:w-1 before:h-6 md:before:h-7 before:bg-gradient-to-b before:from-blue-600 before:to-blue-400 before:rounded-full",
      3: "text-lg md:text-xl lg:text-2xl font-serif-academic font-medium text-blue-800 mt-6 md:mt-8 mb-3 md:mb-4 relative pl-4 md:pl-5 before:content-[''] before:absolute before:left-0 before:top-1/2 before:transform before:-translate-y-1/2 before:w-2 md:before:w-3 before:h-2 md:before:h-3 before:bg-amber-500 before:rounded-full",
      4: "text-base md:text-lg lg:text-xl font-serif-academic font-medium text-slate-800 mt-5 md:mt-6 mb-2 md:mb-3",
      5: "text-sm md:text-base lg:text-lg font-serif-academic font-medium text-slate-700 mt-4 md:mt-5 mb-2",
      6: "text-sm md:text-base font-serif-academic font-medium text-slate-600 mt-3 md:mt-4 mb-2",
    }

    return `<h${level} id="${id}" class="${headerClasses[level] || headerClasses[6]}">${text}</h${level}>`
  },

  quote: (block) => {
    const { text } = block.data
    return `<blockquote class="my-6 md:my-8 relative bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border-l-4 border-blue-600 rounded-r-xl md:rounded-r-2xl shadow-sm backdrop-blur-sm overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/20 to-transparent pointer-events-none"></div>
              <div class="relative p-4 md:p-5 lg:p-6 pl-5 md:pl-6 lg:pl-8">
                <div class="absolute top-3 md:top-4 left-3 md:left-4 text-blue-300/60 text-2xl md:text-3xl font-serif-academic">"</div>
                <p class="text-slate-700 italic font-serif-academic text-base md:text-lg leading-relaxed mb-3 md:mb-4">${text}</p>
                <footer class="text-xs md:text-sm text-slate-600 font-outfit font-medium">— Academic Source</footer>
              </div>
            </blockquote>`
  },
}

const editorJSHTML = EditorJSHTML(customParsers)

// Header Component
const BlogHeader = ({ isScrolled, isTocOpen, setIsTocOpen }) => (
  <header
    className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
      isScrolled
        ? "bg-white/95 backdrop-blur-xl shadow-xl border-b border-slate-200/60"
        : "bg-gradient-to-r from-white/90 via-blue-50/80 to-amber-50/70 backdrop-blur-md"
    }`}
  >
    <div className="flex items-center justify-between px-3 md:px-4 lg:px-6 py-3 md:py-4 max-w-7xl mx-auto">
      <div className="flex items-center lg:w-20">
        <button
          onClick={() => setIsTocOpen(!isTocOpen)}
          className="lg:hidden bg-white/90 hover:bg-white shadow-lg hover:shadow-xl rounded-xl md:rounded-2xl p-2 md:p-3 border border-slate-200/60 hover:border-blue-200 transition-all duration-300 backdrop-blur-sm"
          aria-label="Toggle Table of Contents"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-center flex-1">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-800 via-blue-700 to-amber-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-sm md:text-lg">🎓</span>
          </div>
          <div className="text-center">
            <h1 className="text-lg md:text-xl font-serif-academic font-bold text-slate-800 tracking-wide">
              SpringFallUSA
            </h1>
            <p className="text-[10px] md:text-xs text-slate-600 font-outfit -mt-1 tracking-wider">ACADEMIC RESOURCES</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:w-20 justify-end">
        <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center"></div>
      </div>
    </div>
  </header>
)

// Table of Contents Component
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

        const indentClass = level > 2 ? "ml-4 md:ml-5" : level > 1 ? "ml-2 md:ml-3" : ""

        return (
          <li key={id} className={`toc-item mb-1 ${indentClass}`} style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
            <a
              href={`#${id}`}
              onClick={(e) => handleTOCClick(e, id)}
              className={`flex items-center py-2 px-3 rounded-lg transition-all duration-300 text-xs md:text-sm font-outfit group relative overflow-hidden ${
                activeSection === id
                  ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 border-l-3 border-amber-600 shadow-md font-semibold transform scale-[1.02]"
                  : "text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/50 hover:text-blue-800 hover:shadow-sm hover:transform hover:scale-[1.01]"
              }`}
            >
              <span className="leading-tight flex-1 line-clamp-2">{title}</span>
              {activeSection === id && (
                <div className="absolute right-2 w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
              )}
            </a>
          </li>
        )
      })
      .filter(Boolean)
  }

  return <ul className="space-y-0.5">{generateTOC(htmlContent)}</ul>
}

// Mobile TOC Overlay
const MobileTOCOverlay = ({ isTocOpen, setIsTocOpen, htmlContent, activeSection, handleTOCClick }) => {
  if (!isTocOpen) return null

  return (
    <div className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" onClick={() => setIsTocOpen(false)}>
      <div
        className="bg-white/95 backdrop-blur-xl w-[85vw] max-w-sm h-full shadow-2xl overflow-y-auto mt-16 border-r border-slate-200/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 md:p-5 border-b border-slate-200/60 bg-gradient-to-r from-blue-50/80 to-amber-50/60">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-lg">📚</span>
              <h3 className="text-base font-serif-academic font-bold text-slate-800">Table of Contents</h3>
            </div>
            <button
              onClick={() => setIsTocOpen(false)}
              className="text-slate-500 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100/60 transition-all duration-200"
              aria-label="Close Table of Contents"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4">
          <TableOfContents htmlContent={htmlContent} activeSection={activeSection} handleTOCClick={handleTOCClick} />
        </div>
      </div>
    </div>
  )
}

// Desktop TOC Sidebar (Left)
const DesktopTOCSidebar = ({ htmlContent, activeSection, handleTOCClick }) => (
<div className="hidden lg:block w-52 xl:w-64 fixed left-4 xl:left-6 top-20 h-[calc(100vh-5rem)] bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200/60 rounded-2xl overflow-hidden z-20 transition-all duration-300">

    <div className="h-full flex flex-col">
      <div className="p-4 xl:p-5 border-b border-slate-200/60 bg-gradient-to-r from-blue-50/80 to-amber-50/60">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg xl:text-xl">📚</span>
          <h4 className="text-sm xl:text-base font-serif-academic font-bold text-slate-800">Table of Contents</h4>
        </div>
        <div className="w-12 xl:w-14 h-1 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"></div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 xl:p-4">
        <TableOfContents htmlContent={htmlContent} activeSection={activeSection} handleTOCClick={handleTOCClick} />
      </div>
    </div>
  </div>
)

// NEW: Related Institutions Fixed Sidebar (Right)
const RelatedInstitutionsSidebar = ({ similarUniversities }) => {
  if (!similarUniversities || similarUniversities.length === 0) return null

  return (
    <div className="hidden xl:block w-72 fixed right-4 top-20 h-[calc(100vh-5rem)] bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200/60 rounded-2xl overflow-hidden z-20 transition-all duration-300">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200/60 bg-gradient-to-r from-amber-50/80 to-blue-50/60">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🏛️</span>
            <h4 className="text-sm font-serif-academic font-bold text-slate-800">Related Institutions</h4>
          </div>
          <div className="w-14 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {similarUniversities.map((university, index) => (
              <div
                key={university.id}
                className="bg-gradient-to-br from-white to-slate-50/50 p-3 rounded-xl shadow-sm border border-slate-200/60 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group backdrop-blur-sm transform hover:scale-[1.02]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200/60 rounded-lg flex items-center justify-center group-hover:border-amber-400 transition-all duration-300">
                    <span className="text-blue-800 text-xs">🎓</span>
                  </div>
                  <h5 className="text-sm font-serif-academic font-bold text-blue-900 leading-tight flex-1">
                    {university.name}
                  </h5>
                </div>
                <p className="text-slate-700 leading-relaxed font-outfit text-xs line-clamp-3">
                  {university.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Article Header
const ArticleHeader = ({ title, category, createdAt, author }) => (
  <header className="text-center mb-8 md:mb-10 pb-6 md:pb-8 border-b border-slate-200/60 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-transparent rounded-2xl -mx-4 -my-4"></div>
    <div className="relative">
      <div className="mb-5 md:mb-6">
        <span className="inline-flex items-center gap-2 px-4 md:px-5 py-2 border-2 border-blue-200/60 text-blue-800 rounded-full text-xs md:text-sm font-semibold tracking-wider uppercase font-outfit bg-white/80 backdrop-blur-sm hover:border-blue-300 hover:shadow-lg transition-all duration-300">
          <span className="text-sm md:text-base">🏆</span>
          {category}
        </span>
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif-academic font-bold text-slate-800 mb-5 md:mb-6 leading-tight tracking-tight px-2">
        {title}
      </h1>
      <div className="flex items-center justify-center space-x-4 md:space-x-5 text-slate-600 font-outfit flex-wrap gap-2">
        <time className="font-serif-academic italic text-sm md:text-base flex items-center gap-1 md:gap-2">
          <span className="text-amber-600">📅</span>
          {formatDate(createdAt)}
        </time>
        <span className="text-amber-600 hidden sm:inline text-lg">•</span>
        <span className="text-blue-800 hover:text-amber-600 cursor-pointer font-semibold text-sm md:text-base flex items-center gap-1 md:gap-2 transition-colors duration-300">
          <span className="text-blue-600">✍️</span>
          By {author || "SpringFallUSA Editorial"}
        </span>
      </div>
    </div>
  </header>
)

// Cover Image Component
const CoverImage = ({ coverImg, title }) => {
  if (!coverImg) return null

  return (
    <figure className="mb-8 md:mb-10">
      <div className="relative bg-gradient-to-br from-white to-slate-50/50 p-4 md:p-5 rounded-2xl border border-slate-200/60 shadow-xl backdrop-blur-sm">
        <img
          src={coverImg || "/placeholder.svg"}
          alt="Article cover"
          className="w-full h-auto max-h-64 md:max-h-80 object-cover rounded-xl shadow-lg"
        />
        <figcaption className="mt-3 md:mt-4 text-center text-xs md:text-sm text-slate-600 italic font-serif-academic tracking-wide">
          Featured illustration: "{title}"
        </figcaption>
      </div>
    </figure>
  )
}

// Rating Section
const RatingSection = ({ rating }) => (
  <footer className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-slate-200/60">
    <div className="bg-gradient-to-br from-white to-blue-50/30 border-2 border-blue-200/60 p-6 md:p-8 rounded-2xl text-center hover:border-amber-300 hover:shadow-2xl transition-all duration-500 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="text-amber-600 text-xl">🏆</span>
        <span className="font-serif-academic font-bold text-slate-800 text-lg">Academic Rating</span>
      </div>
      <div className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text mb-3">
        {rating}
      </div>
      <p className="text-xs md:text-sm text-slate-600 italic font-outfit tracking-wide">
        Evaluated by SpringFallUSA Academic Review Board
      </p>
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

  const parsedContent = editorJSHTML.parse(content)
  const htmlContent = Array.isArray(parsedContent) ? parsedContent.join("") : parsedContent

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

  const handleTOCClick = (e, id) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 160,
        behavior: "smooth",
      })
    }
    setIsTocOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-amber-50/20 relative">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200/50 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-amber-500 transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Header */}
      <BlogHeader isScrolled={isScrolled} isTocOpen={isTocOpen} setIsTocOpen={setIsTocOpen} />

      {/* Mobile TOC Overlay */}
      <MobileTOCOverlay
        isTocOpen={isTocOpen}
        setIsTocOpen={setIsTocOpen}
        htmlContent={htmlContent}
        activeSection={activeSection}
        handleTOCClick={handleTOCClick}
      />

      <div className="flex pt-16 max-w-7xl mx-auto px-2 md:px-4">
        {/* Desktop TOC Sidebar (Left) */}
        <DesktopTOCSidebar htmlContent={htmlContent} activeSection={activeSection} handleTOCClick={handleTOCClick} />

        {/* Related Institutions Sidebar (Right) */}
        <RelatedInstitutionsSidebar similarUniversities={similarUniversities} />

        {/* Main Content */}
        <div className="flex-1 lg:ml-60 xl:ml-64 xl:mr-80 transition-all duration-300">
          <div className="max-w-4xl mx-auto lg:max-w-3xl xl:max-w-4xl">
            <article className="px-3 md:px-6 lg:px-8 py-6 md:py-8 font-outfit">
              {/* Article Header */}
              <ArticleHeader title={title} category={category} createdAt={createdAt} author={author} />

              {/* Cover Image */}
              <CoverImage coverImg={coverImg} title={title} />

              {/* Article Content */}
              <div className="prose prose-sm md:prose-lg max-w-none">
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

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');

        .font-outfit { font-family: 'Outfit', system-ui, sans-serif; }
        .font-serif-academic { font-family: 'EB Garamond', Georgia, 'Times New Roman', serif; }

        .academic-content {
          font-family: 'Outfit', system-ui, sans-serif;
          line-height: 1.7;
          font-size: 0.875rem;
        }

        @media (min-width: 768px) {
          .academic-content {
            font-size: 1rem;
            line-height: 1.75;
          }
        }

        @media (min-width: 1024px) {
          .academic-content {
            font-size: 1.125rem;
            line-height: 1.8;
          }
        }

        .academic-content h1, .academic-content h2, .academic-content h3,
        .academic-content h4, .academic-content h5, .academic-content h6 {
          font-family: 'EB Garamond', Georgia, 'Times New Roman', serif;
          scroll-margin-top: 160px;
        }

        .academic-content p {
          margin-bottom: 1.25rem;
          text-align: justify;
          hyphens: auto;
          color: #475569;
        }

        @media (min-width: 768px) {
          .academic-content p {
            margin-bottom: 1.5rem;
          }
        }

        .academic-content ul, .academic-content ol {
          margin: 1.25rem 0;
          padding-left: 1.75rem;
        }

        @media (min-width: 768px) {
          .academic-content ul, .academic-content ol {
            margin: 1.5rem 0;
            padding-left: 2rem;
          }
        }

        .academic-content li {
          margin-bottom: 0.5rem;
          line-height: 1.7;
          color: #475569;
        }

        @media (min-width: 768px) {
          .academic-content li {
            margin-bottom: 0.75rem;
            line-height: 1.75;
          }
        }

        .academic-content img {
          margin: 1.5rem auto;
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }

        @media (min-width: 768px) {
          .academic-content img {
            margin: 2rem auto;
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
          }
        }

        .academic-content a {
          color: #1e40af;
          text-decoration: underline;
          text-decoration-color: #d97706;
          text-underline-offset: 4px;
          transition: all 0.3s ease;
          font-weight: 500;
          word-break: break-word;
        }

        .academic-content a:hover {
          color: #d97706;
          text-decoration-color: #1e40af;
          text-shadow: 0 0 8px rgba(217, 119, 6, 0.3);
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

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          overflow: hidden;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #cbd5e1, #94a3b8);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #94a3b8, #64748b);
        }

        /* Smooth animations */
        * {
          scroll-behavior: smooth;
        }

        /* Enhanced focus states for accessibility */
        button:focus-visible,
        a:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
          border-radius: 8px;
        }

        /* Responsive table wrapper */
        .academic-content table {
          font-size: 0.75rem;
        }

        @media (min-width: 768px) {
          .academic-content table {
            font-size: 0.875rem;
          }
        }

        @media (min-width: 1024px) {
          .academic-content table {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  )
}

export default SingleBlogCard
