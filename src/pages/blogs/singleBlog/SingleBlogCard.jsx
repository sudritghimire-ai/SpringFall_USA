import React, { useEffect, useState } from 'react';
import { formatDate } from "../../../utils/formatDate";
import EditorJSHTML from 'editorjs-html';

const customParsers = {
  delimiter: () => '<hr class="my-12 border-t border-amber-200 shadow-sm" style="border-top: 2px solid #d97706; opacity: 0.3;" />',
  
  embed: (block) => {
    const { service, source, embed } = block.data;
    if (service === 'youtube') {
      return `<div class="my-8 p-4 bg-white rounded-lg shadow-md border border-gray-200">
                <div class="aspect-w-16 aspect-h-9">
                  <iframe class="w-full h-[400px] rounded-md border border-gray-300" src="${embed}" frameborder="0" allowfullscreen></iframe>
                </div>
                <p class="text-sm text-gray-600 mt-2 italic text-center">Video Content</p>
              </div>`;
    }
    return `<a href="${source}" target="_blank" rel="noopener noreferrer" class="text-blue-800 hover:text-amber-600 underline">${source}</a>`;
  },
  
  table: (block) => {
    const { content } = block.data;
    const tableRows = content.map((row, rowIndex) => {
      const tableCells = row.map((cell, cellIndex) => {
        if (rowIndex === 0) {
          return `<th class="px-6 py-4 bg-slate-800 text-white border border-gray-300 font-serif text-sm font-semibold">${cell}</th>`;
        }
        return `<td class="px-6 py-4 border border-gray-300 text-gray-700">${cell}</td>`;
      }).join('');
      return `<tr class="even:bg-gray-50">${tableCells}</tr>`;
    }).join('');
    return `<div class="my-8 overflow-x-auto">
              <table class="w-full border-collapse border border-gray-300 shadow-sm rounded-lg overflow-hidden bg-white">
                ${tableRows}
              </table>
            </div>`;
  },
  
  header: (block) => {
    const { text, level } = block.data;
    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
    const headerClasses = {
      1: 'text-4xl font-serif font-bold text-slate-800 mt-12 mb-6 pb-3 border-b-2 border-amber-600',
      2: 'text-3xl font-serif font-semibold text-blue-900 mt-10 mb-5',
      3: 'text-2xl font-serif font-medium text-blue-800 mt-8 mb-4',
      4: 'text-xl font-serif font-medium text-gray-800 mt-6 mb-3',
      5: 'text-lg font-serif font-medium text-gray-700 mt-5 mb-3',
      6: 'text-base font-serif font-medium text-gray-600 mt-4 mb-2'
    };
    return `<h${level} id="${id}" class="${headerClasses[level] || headerClasses[6]}">${text}</h${level}>`;
  },
  
  quote: (block) => {
    const { text } = block.data;
    return `<blockquote class="my-8 pl-6 pr-4 py-4 bg-blue-50 border-l-4 border-blue-800 rounded-r-lg shadow-sm">
              <p class="text-gray-700 italic font-serif text-lg leading-relaxed">"${text}"</p>
              <footer class="mt-2 text-sm text-gray-600">— Academic Citation</footer>
            </blockquote>`;
  }
};

const editorJSHTML = EditorJSHTML(customParsers);

const SingleBlogCard = ({ blog }) => {
  const { title, description, content, coverImg, category, rating, author, createdAt, similarUniversities } = blog || {};
  const [activeSection, setActiveSection] = useState(null);
  const [isTocOpen, setIsTocOpen] = useState(false);
  
  const parsedContent = editorJSHTML.parse(content);
  const htmlContent = Array.isArray(parsedContent) ? parsedContent.join('') : parsedContent;

  const generateTOC = (content) => {
    const headings = content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/g);
    if (!headings) return [];
    
    return headings.map((heading, index) => {
      const title = heading.replace(/<[^>]*>/g, '');
      const id = heading.match(/id="([^"]*)"/)?.[1];
      const level = parseInt(heading.match(/<h([1-6])/)?.[1]);
      if (!id) return null;

      const indentClass = level > 2 ? 'ml-6' : level > 1 ? 'ml-3' : '';
      const textSize = level === 1 ? 'text-sm font-semibold' : 'text-sm';
      
      return (
        <li
          key={id}
          className={`toc-item mb-2 ${indentClass}`}
          style={{ animationDelay: `${(index + 1) * 0.1}s` }}
        >
          <a
            href={`#${id}`}
            onClick={(e) => handleTOCClick(e, id)}
            className={`block py-2 px-3 rounded-md transition-all duration-200 ${textSize} font-serif ${
              activeSection === id
                ? 'bg-blue-100 text-blue-900 border-l-3 border-amber-600 shadow-sm'
                : 'text-gray-700 hover:bg-gray-100 hover:text-blue-800 hover:shadow-sm'
            }`}
          >
            {title}
          </a>
        </li>
      );
    }).filter(Boolean);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let currentSection = '';
      
      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 150) {
          currentSection = section.id;
        }
      });
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTOCClick = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 120,
        behavior: 'smooth'
      });
    }
    setIsTocOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50" style={{ backgroundColor: '#fefdf8' }}>
      {/* Mobile TOC Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsTocOpen(!isTocOpen)}
          className="bg-white shadow-lg rounded-lg p-3 border border-gray-200 hover:shadow-xl transition-shadow"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile TOC Overlay */}
      {isTocOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsTocOpen(false)}>
          <div className="bg-white w-80 h-full shadow-2xl p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-serif font-bold text-slate-800">Table of Contents</h3>
              <button onClick={() => setIsTocOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ul className="space-y-1">{generateTOC(htmlContent)}</ul>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar TOC */}
        <div className="hidden lg:block lg:w-80 fixed left-0 top-0 h-full bg-white shadow-xl border-r border-gray-200 overflow-y-auto">
          <div className="p-8">
            <div className="mb-8 pb-6 border-b border-gray-200">
              <h3 className="text-xl font-serif font-bold text-slate-800 mb-2">Table of Contents</h3>
              <p className="text-sm text-gray-600 italic">Navigate through sections</p>
            </div>
            <ul className="space-y-1">{generateTOC(htmlContent)}</ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-80">
          <article className="max-w-4xl mx-auto px-6 py-12 lg:px-12">
            {/* Header Section */}
            <header className="text-center mb-12 pb-8 border-b border-gray-200">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium tracking-wide uppercase">
                  {category}
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-serif font-bold text-slate-800 mb-6 leading-tight">
                {title}
              </h1>
              <div className="flex items-center justify-center space-x-4 text-gray-600">
                <time className="font-serif italic">{formatDate(createdAt)}</time>
                <span>•</span>
                <span className="text-blue-800 hover:text-amber-600 cursor-pointer font-medium">
                  By {author || 'Admin'}
                </span>
              </div>
            </header>

            {/* Cover Image */}
            {coverImg && (
              <figure className="mb-12">
                <div className="relative bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                  <img 
                    src={coverImg || "/placeholder.svg"} 
                    alt="Article cover" 
                    className="w-full h-auto lg:h-[500px] object-cover rounded-md"
                  />
                  <figcaption className="mt-4 text-center text-sm text-gray-600 italic font-serif">
                    Featured illustration for "{title}"
                  </figcaption>
                </div>
              </figure>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: htmlContent }} 
                className="academic-content text-gray-700 leading-relaxed"
                style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  lineHeight: '1.7'
                }}
              />
            </div>

            {/* Similar Universities Section */}
            {similarUniversities && similarUniversities.length > 0 && (
              <section className="mt-16 pt-12 border-t-2 border-amber-600">
                <h2 className="text-3xl font-serif font-bold text-slate-800 mb-8 text-center">
                  Related Institutions
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {similarUniversities.map((university) => (
                    <div key={university.id} className="bg-white p-8 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                      <h3 className="text-xl font-serif font-semibold text-blue-900 mb-4">
                        {university.name}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{university.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rating Section */}
            <footer className="mt-16 pt-8 border-t border-gray-200 text-center">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <p className="text-lg font-serif">
                  <span className="font-semibold text-slate-800">Academic Rating: </span>
                  <span className="text-amber-600 font-bold text-xl">{rating}</span>
                </p>
                <p className="text-sm text-gray-600 mt-2 italic">
                  As evaluated by SpringFallUSA Academic Review Board
                </p>
              </div>
            </footer>
          </article>
        </div>
      </div>

      <style jsx global>{`
        .academic-content h1, .academic-content h2, .academic-content h3,
        .academic-content h4, .academic-content h5, .academic-content h6 {
          font-family: Georgia, 'Times New Roman', serif;
        }
        
        .academic-content p {
          margin-bottom: 1.5rem;
          text-align: justify;
        }
        
        .academic-content ul, .academic-content ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }
        
        .academic-content li {
          margin-bottom: 0.5rem;
        }
        
        .academic-content img {
          margin: 2rem auto;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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
      `}</style>
    </div>
  );
};

export default SingleBlogCard; 
