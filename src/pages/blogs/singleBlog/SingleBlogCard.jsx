import React, { useEffect, useState } from 'react';
import { formatDate } from "../../../utils/formatDate";
import EditorJSHTML from 'editorjs-html';
import { ChevronDown, ChevronUp } from 'lucide-react';

const customParsers = {
  delimiter: () => '<hr class="my-8 border-t-2 border-gray-300 shadow-intense" />',
  embed: (block) => {
    const { service, source, embed } = block.data;
    if (service === 'youtube') {
      return `<div class="aspect-w-16 aspect-h-9 mb-6">
                <iframe class="w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-xl" src="${embed}" frameborder="0" allowfullscreen></iframe>
              </div>`;
    }
    return `<a href="${source}" target="_blank" rel="noopener noreferrer">${source}</a>`;
  },
  table: (block) => {
    const { content } = block.data;
    const tableRows = content.map((row, rowIndex) => {
      const tableCells = row.map((cell, cellIndex) => {
        if (rowIndex === 0) {
          return `<th class="px-2 py-1 md:px-4 md:py-2 bg-blue-600 text-white border text-sm md:text-base">${cell}</th>`;
        }
        return `<td class="px-2 py-1 md:px-4 md:py-2 border text-sm md:text-base">${cell}</td>`;
      }).join('');
      return `<tr>${tableCells}</tr>`;
    }).join('');
    return `<div class="overflow-x-auto"><table class="table-auto w-full border-collapse border border-gray-300">${tableRows}</table></div>`;
  },
  header: (block) => {
    const { text, level } = block.data;
    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
    return `<h${level} id="${id}" class="mt-6 md:mt-8 mb-3 md:mb-4 ${
      level === 1 ? 'text-3xl md:text-4xl' : level === 2 ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
    } font-semibold ${
      level === 1 ? 'text-gray-900' : level === 2 ? 'text-blue-800' : 'text-indigo-700'
    }">${text}</h${level}>`;
  },
};

const editorJSHTML = EditorJSHTML(customParsers);

const SingleBlogCard = ({ blog }) => {
  const { title, description, content, coverImg, category, rating, author, createdAt, similarUniversities } = blog || {};
  const [activeSection, setActiveSection] = useState(null);
  const [tocOpen, setTocOpen] = useState(false);

  const parsedContent = editorJSHTML.parse(content);
  const htmlContent = Array.isArray(parsedContent) ? parsedContent.join('') : parsedContent;

  const generateTOC = (content) => {
    const headings = content.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/g);
    if (!headings) return [];

    return headings.map((heading, index) => {
      const title = heading.replace(/<[^>]*>/g, '');
      const id = heading.match(/id="([^"]*)"/)?.[1];
      const level = heading.match(/<h([1-6])/)?.[1];
      if (!id) return null;

      // Calculate animation delay based on the index
      const animationDelay = `${(index + 1) * 0.2}s`;

      return (
        <li
          key={id}
          className={`toc-item mb-2 md:mb-3 ${level >= '3' ? 'ml-3 md:ml-4' : ''}`}
          style={{ animationDelay }}
        >
          <a
            href={`#${id}`}
            onClick={(e) => handleTOCClick(e, id)}
            className={`block py-1 px-2 rounded transition-colors text-sm md:text-base ${
              activeSection === id
                ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600'
                : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
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
        if (window.scrollY >= section.offsetTop - 120) {
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
        top: target.offsetTop - 100,
        behavior: 'smooth'
      });
    }
    // Close mobile TOC after clicking
    if (window.innerWidth < 1024) {
      setTocOpen(false);
    }
  };

  const toggleTOC = () => {
    setTocOpen(!tocOpen);
  };

  return (
    <div className="relative">
      {/* Mobile TOC Toggle */}
      <div className="lg:hidden sticky top-0 z-10 bg-white shadow-md p-3">
        <button 
          onClick={toggleTOC}
          className="flex items-center justify-between w-full bg-blue-50 text-blue-700 p-3 rounded-lg font-medium"
        >
          <span>Table of Contents</span>
          {tocOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        {/* Mobile TOC Content */}
        {tocOpen && (
          <div className="bg-white border border-gray-200 rounded-lg mt-2 p-3 shadow-lg max-h-[60vh] overflow-y-auto">
            <ul className="space-y-1">{generateTOC(htmlContent)}</ul>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Desktop Sidebar TOC */}
        <div className="hidden lg:block lg:w-64 p-4 fixed top-20 left-0 h-[calc(100vh-5rem)] overflow-y-auto animate-toc">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Contents</h3>
          <ul className="space-y-2 text-sm">{generateTOC(htmlContent)}</ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-3 sm:p-4 lg:p-8 lg:ml-64 min-h-screen">
          <div className="text-center mb-6 lg:mb-8">
            <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-3 lg:mb-4">{title}</h1>
            <p className="text-sm md:text-base text-gray-600 italic">
              {formatDate(createdAt)} by <span className="text-blue-600 hover:underline cursor-pointer">Admin</span>
            </p>
          </div>

          {coverImg && (
            <div className="relative mb-6 lg:mb-8 rounded-xl overflow-hidden shadow-lg">
              <img src={coverImg || "/placeholder.svg"} alt={title || "Blog cover"} className="w-full h-auto object-cover" />
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-white font-semibold text-sm sm:text-lg bg-black bg-opacity-60 px-2 py-1 sm:px-3 sm:py-1 rounded-md">
                {category}
              </div>
            </div>
          )}

          <div className="space-y-6 lg:space-y-8">
            <div 
              dangerouslySetInnerHTML={{ __html: htmlContent }} 
              className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700 overflow-x-hidden"
            />

            {similarUniversities && similarUniversities.length > 0 && (
              <div className="border-t pt-6 lg:pt-8 mt-6 lg:mt-8">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6">Similar Universities</h2>
                {similarUniversities.map((university) => (
                  <div key={university.id} className="bg-gray-50 p-4 lg:p-6 rounded-lg mb-4 lg:mb-6">
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-700 mb-2 lg:mb-3">{university.name}</h3>
                    <p className="text-sm md:text-base text-gray-600">{university.description}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 lg:pt-6 text-base lg:text-lg border-t">
              <span className="font-semibold text-gray-800">Ratings: </span>
              <span className="text-blue-700 font-semibold">{rating}</span>
              <span className="text-gray-500 text-sm md:text-base"> (as evaluated by SpringFallUSA.)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlogCard;
