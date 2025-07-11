"use client"
import { useEffect, useState } from "react"
import { formatDate } from "../../../utils/formatDate"
import EditorJSHTML from "editorjs-html"

const customParsers = {
  delimiter: () =>
    "<hr class=\"my-12 border-t border-amber-200/40 relative before:content-[''] before:absolute before:top-[-1px] before:left-1/2 before:transform before:-translate-x-1/2 before:w-16 before:h-0.5 before:bg-gradient-to-r before:from-amber-600 before:to-amber-400\" />",
  embed: (block) => {
    const { service, source, embed } = block.data
    if (service === "youtube") {
      return `<figure class="my-12 bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 rounded-2xl shadow-sm border border-slate-200/60 backdrop-blur-sm">
                <div class="aspect-video rounded-xl overflow-hidden border border-slate-300/50 shadow-md">
                  <iframe class="w-full h-full" src="${embed}" frameborder="0" allowfullscreen></iframe>
                </div>
                <figcaption class="mt-4 text-sm text-slate-600 italic font-serif-academic text-center tracking-wide">Educational Video Content</figcaption>
              </figure>`
    }
    return `<a href="${source}" target="_blank" rel="noopener noreferrer" class="text-blue-800 hover:text-amber-600 underline decoration-2 underline-offset-2 transition-all duration-300 font-medium">${source}</a>`
  },
  table: (block) => {
    const { content } = block.data
    const tableRows = content
      .map((row, rowIndex) => {
        const tableCells = row
          .map((cell) => {
            if (rowIndex === 0) {
              return `<th class="px-8 py-5 bg-gradient-to-r from-slate-800 to-slate-700 text-white border border-slate-300/30 font-serif-academic text-sm font-semibold tracking-wider uppercase">${cell}</th>`
            }
            return `<td class="px-8 py-5 border border-slate-200/60 text-slate-700 font-outfit leading-relaxed">${cell}</td>`
          })
          .join("")
        return `<tr class="even:bg-slate-50/40 hover:bg-blue-50/60 transition-all duration-200">${tableCells}</tr>`
      })
      .join("")
    return `<div class="my-12 overflow-x-auto rounded-2xl shadow-lg border border-slate-200/60">
              <table class="w-full border-collapse bg-white backdrop-blur-sm">
                ${tableRows}
              </table>
            </div>`
  },
  header: (block) => {
    const { text, level } = block.data
   const id = text
  .toLowerCase()
  .replace(/\p{Emoji_Presentation}/gu, "") // remove emoji
  .replace(/\s+/g, "-")
  .replace(/[^\p{L}\p{N}-]/gu, "") // allow letters/numbers/hyphens

    const headerClasses = {
      1: "text-4xl lg:text-5xl font-serif-academic font-bold text-slate-800 mt-16 mb-8 pb-6 border-b-2 border-gradient-to-r from-amber-600 to-amber-400 relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-20 after:h-0.5 after:bg-gradient-to-r after:from-amber-600 after:to-amber-400",
      2: "text-3xl lg:text-4xl font-serif-academic font-semibold text-blue-900 mt-14 mb-6 relative before:content-[''] before:absolute before:left-[-1.5rem] before:top-1/2 before:transform before:-translate-y-1/2 before:w-1 before:h-8 before:bg-gradient-to-b before:from-blue-600 before:to-blue-400 before:rounded-full",
      3: "text-2xl lg:text-3xl font-serif-academic font-medium text-blue-800 mt-12 mb-5 relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1/2 before:transform before:-translate-y-1/2 before:w-3 before:h-3 before:bg-amber-500 before:rounded-full",
      4: "text-xl lg:text-2xl font-serif-academic font-medium text-slate-800 mt-10 mb-4",
      5: "text-lg lg:text-xl font-serif-academic font-medium text-slate-700 mt-8 mb-3",
      6: "text-base lg:text-lg font-serif-academic font-medium text-slate-600 mt-6 mb-2",
    }
    return `<h${level} id="${id}" class="${headerClasses[level] || headerClasses[6]}">${text}</h${level}>`
  },
  quote: (block) => {
    const { text } = block.data
    return `<blockquote class="my-12 relative bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border-l-4 border-blue-600 rounded-r-2xl shadow-sm backdrop-blur-sm overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/20 to-transparent pointer-events-none"></div>
              <div class="relative p-8 pl-12">
                <div class="absolute top-6 left-6 text-blue-300/60 text-4xl font-serif-academic">"</div>
                <p class="text-slate-700 italic font-serif-academic text-lg lg:text-xl leading-relaxed mb-4">${text}</p>
                <footer class="text-sm text-slate-600 font-outfit font-medium">— Academic Source</footer>
              </div>
            </blockquote>`
  },
}

const editorJSHTML = EditorJSHTML(customParsers)

const SingleBlogCard = ({ blog }) => {
  const { title, description, content, coverImg, category, rating, author, createdAt, similarUniversities } = blog || {}
  const [activeSection, setActiveSection] = useState(null)
  const [isTocOpen, setIsTocOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
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
        const level = Number.parseInt(heading.match(/<h([1-6])/)?.[1])
        if (!id) return null

        const indentClass = level > 2 ? "ml-8" : level > 1 ? "ml-4" : ""
        const iconMap = {
          1: "📚",
          2: "📖",
          3: "📄",
          4: "📝",
          5: "•",
          6: "•",
        }

        return (
          <li key={id} className={`toc-item mb-1 ${indentClass}`} style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
          <a
  href={`#${id}`}
  onClick={(e) => handleTOCClick(e, id)}
  className={`flex items-center py-3 px-4 rounded-xl transition-all duration-300 text-sm font-outfit group relative overflow-hidden ${
    activeSection === id
      ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 border-l-4 border-amber-600 shadow-md font-semibold transform scale-[1.02]"
      : "text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50/50 hover:text-blue-800 hover:shadow-sm hover:transform hover:scale-[1.01]"
  }`}
>
  <span className="leading-tight flex-1">{title}</span>
  {activeSection === id && (
    <div className="absolute right-2 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
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
      setIsScrolled(window.scrollY > 10)

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
        top: target.offsetTop - 160,
        behavior: "smooth",
      })
    }
    setIsTocOpen(false)
  }

  return (
<div className="min-h-screen bg-white sm:bg-gradient-to-br sm:from-slate-50 sm:via-blue-50/30 sm:to-amber-50/20 relative">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200/50 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-amber-500 transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Fixed Header Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
  isScrolled
    ? "bg-white/90 backdrop-blur-xl shadow-xl border-b border-slate-200/60"
    : "bg-white lg:bg-gradient-to-r lg:from-white/90 lg:via-blue-50/80 lg:to-amber-50/70 backdrop-blur-md"
}`}

      >
        <div className="flex items-center justify-between px-4 lg:px-6 py-4 max-w-7xl mx-auto">
          {/* Left: Hamburger Menu (Mobile Only) */}
          <div className="flex items-center lg:w-24">
            <button
              onClick={() => setIsTocOpen(!isTocOpen)}
              className="lg:hidden bg-white/90 hover:bg-white shadow-lg hover:shadow-xl rounded-2xl p-3 border border-slate-200/60 hover:border-blue-200 transition-all duration-300 backdrop-blur-sm"
              aria-label="Toggle Table of Contents"
            >
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Center: SpringFallUSA Brand */}
          <div className="flex items-center justify-center flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-800 via-blue-700 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg">🎓</span>
              </div>
              <div className="text-center">
                <h1 className="text-xl font-serif-academic font-bold text-slate-800 tracking-wide">SpringFallUSA</h1>
                <p className="text-xs text-slate-600 font-outfit -mt-1 tracking-wider">ACADEMIC RESOURCES</p>
              </div>
            </div>
          </div>

          {/* Right: Future Icons Space */}
          <div className="flex items-center gap-2 lg:w-24 justify-end">
            <div className="w-8 h-8 flex items-center justify-center"></div>
          </div>
        </div>
      </header>

      {/* Mobile TOC Overlay */}
      {isTocOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" onClick={() => setIsTocOpen(false)}>
          <div
            className="bg-white/95 backdrop-blur-xl w-80 h-full shadow-2xl overflow-y-auto mt-16 border-r border-slate-200/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-200/60 bg-gradient-to-r from-blue-50/80 to-amber-50/60">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📚</span>
                  <h3 className="text-lg font-serif-academic font-bold text-slate-800">Table of Contents</h3>
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
              <ul className="space-y-1">{generateTOC(htmlContent)}</ul>
            </div>
          </div>
        </div>
      )}

      <div className="flex pt-16">
        {/* Desktop Sidebar TOC */}
        <div className="hidden lg:block lg:w-64 xl:w-72 fixed left-6 top-20 h-[calc(100vh-5rem)] bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200/60 rounded-3xl overflow-hidden z-20">
          <div className="h-full flex flex-col">
            <div className="p-8 border-b border-slate-200/60 bg-gradient-to-r from-blue-50/80 to-amber-50/60">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📚</span>
                <h4 className="text-lg font-serif-academic font-bold text-slate-800">Table of Contents</h4>
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"></div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <ul className="space-y-1">{generateTOC(htmlContent)}</ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-[22rem] xl:ml-[26rem]">
          <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-outfit">
            {/* Header Section */}
            <header className="text-center mb-16 pb-12 border-b border-slate-200/60 relative">
<div className="hidden sm:absolute sm:inset-0 sm:bg-gradient-to-b sm:from-blue-50/30 sm:to-transparent sm:rounded-3xl sm:-mx-8 sm:-my-8"></div>
              <div className="relative">
                <div className="mb-8">
<span className="inline-flex items-center gap-3 px-6 py-3 border-2 border-blue-200/60 text-blue-800 rounded-full text-sm font-semibold tracking-wider uppercase font-outfit bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                    <span className="text-lg">🏆</span>
                    {category}
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif-academic font-bold text-slate-800 mb-8 leading-tight tracking-tight">
                  {title}
                </h1>
                <div className="flex items-center justify-center space-x-6 text-slate-600 font-outfit flex-wrap">
                  <time className="font-serif-academic italic text-base flex items-center gap-2">
                    <span className="text-amber-600">📅</span>
                    {formatDate(createdAt)}
                  </time>
                  <span className="text-amber-600 hidden sm:inline text-xl">•</span>
                  <span className="text-blue-800 hover:text-amber-600 cursor-pointer font-semibold text-base flex items-center gap-2 transition-colors duration-300">
                    <span className="text-blue-600">✍️</span>
                    By {"SpringFallUSA Editorial"}
                  </span>
                </div>
              </div>
            </header>

            {/* Cover Image */}
            {coverImg && (
              <figure className="mb-16">
<div className="relative bg-white sm:bg-gradient-to-br sm:from-white sm:to-slate-50/50 p-6 rounded-3xl sm:border border-transparent sm:border-slate-200/60 shadow-none sm:shadow-xl max-w-5xl mx-auto sm:backdrop-blur-sm">
                  <img
                    src={coverImg || "/placeholder.svg"}
                    alt="Article cover"
                    className="w-full h-auto max-h-96 object-cover rounded-2xl shadow-lg"
                  />
                  <figcaption className="mt-6 text-center text-sm text-slate-600 italic font-serif-academic tracking-wide">
                    Featured illustration: "{title}"
                  </figcaption>
                </div>
              </figure>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                className="academic-content text-slate-700 leading-relaxed"
              />
            </div>

   {/* Similar Universities Section */}
            {similarUniversities && similarUniversities.length > 0 && (
<section className="mt-0 pt-16 border-t-2 border-gradient-to-r from-amber-600 to-amber-400 relative">
                <div className="absolute top-[-2px] left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"></div>
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-serif-academic font-bold text-slate-800 mb-4">Related Institutions</h2>
                  <p className="text-slate-600 font-outfit text-lg">Explore similar academic opportunities</p>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  {similarUniversities.map((university, index) => (
                   <div
  key={university.id}
  className="bg-white sm:bg-gradient-to-br sm:from-white sm:to-slate-50/50 p-8 rounded-3xl shadow-none sm:shadow-lg border-none sm:border sm:border-slate-200/60 sm:hover:shadow-2xl sm:hover:border-blue-200 transition-all duration-500 group sm:backdrop-blur-sm transform hover:scale-[1.01]"

                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-200/60 rounded-2xl flex items-center justify-center group-hover:border-amber-400 group-hover:shadow-lg transition-all duration-300">
                          <span className="text-blue-800 text-xl">🎓</span>
                        </div>
                        <h3 className="text-xl font-serif-academic font-bold text-blue-900 leading-tight flex-1">
                          {university.name}
                        </h3>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-outfit">{university.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )} 


            {/* Rating Section */}
          <footer className="mt-20 pt-12 border-t border-slate-200/60">
<div className="bg-white sm:bg-gradient-to-br sm:from-white sm:to-blue-50/30 border-none sm:border-2 sm:border-blue-200/60 p-10 rounded-3xl text-center sm:hover:border-amber-300 shadow-none sm:hover:shadow-2xl transition-all duration-500 sm:backdrop-blur-sm">

                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-amber-600 text-2xl">🏆</span>
                  <span className="font-serif-academic font-bold text-slate-800 text-xl">Academic Rating</span>
                </div>
                <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text mb-4">
                  {rating}
                </div>
                <p className="text-sm text-slate-600 italic font-outfit tracking-wide">
                  Evaluated by SpringFallUSA Academic Review Board
                </p>
              </div>
            </footer>
          </article>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');
        
        .font-outfit { font-family: 'Outfit', system-ui, sans-serif; }
        .font-serif-academic { font-family: 'EB Garamond', Georgia, 'Times New Roman', serif; }
        
        .academic-content {
          font-family: 'Outfit', system-ui, sans-serif;
          line-height: 1.8;
          font-size: 1.125rem;
        }
        
        .academic-content h1, .academic-content h2, .academic-content h3,
        .academic-content h4, .academic-content h5, .academic-content h6 {
          font-family: 'EB Garamond', Georgia, 'Times New Roman', serif;
          scroll-margin-top: 160px;
        }
        
        .academic-content p {
          margin-bottom: 2rem;
          text-align: justify;
          hyphens: auto;
          color: #475569;
        }
        
        .academic-content ul, .academic-content ol {
          margin: 2rem 0;
          padding-left: 2.5rem;
        }
        
        .academic-content li {
          margin-bottom: 1rem;
          line-height: 1.8;
          color: #475569;
        }
        
        .academic-content img {
          margin: 3rem auto;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }
        
        .academic-content a {
          color: #1e40af;
          text-decoration: underline;
          text-decoration-color: #d97706;
          text-underline-offset: 4px;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .academic-content a:hover {
          color: #d97706;
          text-decoration-color: #1e40af;
          text-shadow: 0 0 8px rgba(217, 119, 6, 0.3);
        }
        
        .toc-item {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(15px);
        }
        
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
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
        
        /* Responsive typography */
        @media (max-width: 640px) {
          .academic-content {
            font-size: 1rem;
            line-height: 1.7;
          }
          
          .academic-content p {
            margin-bottom: 1.5rem;
          }
        }
        
        @media (min-width: 1024px) {
          .academic-content {
            font-size: 1.125rem;
            line-height: 1.8;
          }
        }
        
        @media (min-width: 1440px) {
          .academic-content {
            font-size: 1.25rem;
            line-height: 1.9;
          }
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
      `}</style>
    </div>
  )
}

export default SingleBlogCard
