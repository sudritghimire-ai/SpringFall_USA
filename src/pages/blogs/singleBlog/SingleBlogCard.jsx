import React, { useEffect, useState } from 'react';
import { formatDate } from "../../../utils/formatDate";
import EditorJSHTML from 'editorjs-html';

const customParsers = {
  delimiter: () => '<hr class="my-8 border-t-2 border-gray-300 shadow-intense" />',
  embed: (block) => {
    const { service, source, embed } = block.data;
    if (service === 'youtube') {
      return `<div class="aspect-w-16 aspect-h-9 mb-6">
                <iframe class="w-full h-[500px] rounded-xl" src="${embed}" frameborder="0" allowfullscreen></iframe>
              </div>`;
    }
    return `<a href="${source}" target="_blank" rel="noopener noreferrer">${source}</a>`;
  },
  table: (block) => {
    const { content } = block.data;
    const tableRows = content.map((row, rowIndex) => {
      const tableCells = row.map((cell, cellIndex) => {
        if (rowIndex === 0) {
          return `<th class="px-4 py-2 bg-blue-600 text-white border">${cell}</th>`;
        }
        return `<td class="px-4 py-2 border">${cell}</td>`;
      }).join('');
      return `<tr>${tableCells}</tr>`;
    }).join('');
    return `<table class="table-auto w-full border-collapse border border-gray-300">${tableRows}</table>`;
  },
  header: (block) => {
    const { text, level } = block.data;
    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
    return `<h${level} id="${id}" class="mt-8 mb-4 ${level === 1 ? 'text-4xl' : level === 2 ? 'text-3xl' : 'text-2xl'} font-semibold ${
      level === 1 ? 'text-gray-900' : level === 2 ? 'text-blue-800' : 'text-indigo-700'
    }">${text}</h${level}>`;
  },
};

const editorJSHTML = EditorJSHTML(customParsers);

const SingleBlogCard = ({ blog }) => {
  const { title, description, content, coverImg, category, rating, author, createdAt, similarUniversities } = blog || {};
  const [activeSection, setActiveSection] = useState(null);

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
          className={`toc-item mb-3 ${level >= '3' ? 'ml-4' : ''}`}
          style={{ animationDelay }}
        >
          <a
            href={`#${id}`}
            onClick={(e) => handleTOCClick(e, id)}
            className={`block py-1 px-2 rounded transition-colors ${
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
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar TOC */}
      <div className="hidden lg:block lg:w-64 p-4 fixed top-20 left-0 h-[calc(100vh-5rem)] overflow-y-auto animate-toc">
        <h3 className="text-lg font-bold text-gray-700 mb-4"></h3>
        <ul className="space-y-2 text-sm">{generateTOC(htmlContent)}</ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-8 lg:ml-64 min-h-screen">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">{title}</h1>
          <p className="text-gray-600 italic">
            {formatDate(createdAt)} by <span className="text-blue-600 hover:underline cursor-pointer">Admin</span>
          </p>
        </div>

        {coverImg && (
          <div className="relative mb-8 rounded-xl overflow-hidden shadow-lg">
            <img src={coverImg} alt="coverImg" className="w-full h-auto lg:h-[400px] object-cover" />
            <div className="absolute bottom-4 left-4 text-white font-semibold text-lg bg-black bg-opacity-60 px-3 py-1 rounded-md">
              {category}
            </div>
          </div>
        )}

        <div className="space-y-8">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="prose prose-lg max-w-none text-gray-700" />

          {similarUniversities && similarUniversities.length > 0 && (
            <div className="border-t pt-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Similar Universities</h2>
              {similarUniversities.map((university) => (
                <div key={university.id} className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">{university.name}</h3>
                  <p className="text-gray-600">{university.description}</p>
                </div>
              ))}
            </div>
          )}

          <div className="pt-6 text-lg border-t">
            <span className="font-semibold text-gray-800">Ratings: </span>
            <span className="text-blue-700 font-semibold">{rating}</span>
            <span className="text-gray-500"> (as evaluated by SpringFallUSA.)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlogCard;
