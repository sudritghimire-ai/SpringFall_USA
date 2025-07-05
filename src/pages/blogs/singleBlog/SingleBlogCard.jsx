"use client"

import { useState, useEffect } from "react";
import { formatDate } from "../../../utils/formatDate";
import EditorJSHTML from "editorjs-html";

const editorJSHTML = EditorJSHTML({
  delimiter: () => "<hr class='my-12 border-t border-amber-300' />",
  header: block => `<h${block.data.level} id='${block.data.text.toLowerCase().replace(/\s+/g,'-')}'>${block.data.text}</h${block.data.level}>`,
});

const SingleBlogCard = ({ blog }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const parsedContent = editorJSHTML.parse(blog?.content || "").join("");

  const generateTOC = () => {
    const headings = parsedContent.match(/<h[1-6][^>]*>(.*?)<\/(h[1-6])>/g) || [];
    return headings.map(h => {
      const text = h.replace(/<[^>]+>/g, "");
      const id = text.toLowerCase().replace(/\s+/g, "-");
      return { text, id };
    });
  };

  useEffect(() => {
    const onScroll = () => {
      const article = document.querySelector("article");
      if (!article) return;
      const scrollTop = window.scrollY;
      const docHeight = article.offsetHeight;
      const winHeight = window.innerHeight;
      const percent = (scrollTop / (docHeight - winHeight)) * 100;
      setReadingProgress(Math.min(100, percent));
      setIsScrolled(scrollTop > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tocItems = generateTOC();

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-amber-50/20 min-h-screen">
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 z-50">
        <div style={{ width: `${readingProgress}%` }} className="h-full bg-gradient-to-r from-blue-600 to-amber-500 transition-all" />
      </div>
      <header className={`fixed top-0 w-full z-40 p-4 transition ${isScrolled ? "bg-white shadow" : "bg-opacity-80 backdrop-blur"}`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button className="lg:hidden" onClick={() => setIsTocOpen(!isTocOpen)}>☰</button>
          <div className="font-bold text-xl">SpringFallUSA</div>
        </div>
      </header>
      {isTocOpen && (
        <aside className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsTocOpen(false)}>
          <div className="w-64 bg-white p-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Contents</h2>
            <ul>
              {tocItems.map(item => (
                <li key={item.id}><a href={`#${item.id}`} onClick={() => setIsTocOpen(false)}>{item.text}</a></li>
              ))}
            </ul>
          </div>
        </aside>
      )}
      <main className="flex pt-20 max-w-screen-xl mx-auto px-4">
        <aside className="hidden lg:block w-64 sticky top-20 self-start">
          <h3 className="font-bold mb-4">Contents</h3>
          <ul className="space-y-2">
            {tocItems.map(item => (
              <li key={item.id}><a className="hover:text-blue-600" href={`#${item.id}`}>{item.text}</a></li>
            ))}
          </ul>
        </aside>
        <article className="flex-1 prose max-w-none px-4">
          <h1 className="text-4xl font-bold mb-4">{blog?.title}</h1>
          <div className="text-slate-600 mb-8">{formatDate(blog?.createdAt)}</div>
          <div dangerouslySetInnerHTML={{ __html: parsedContent }} />
          {blog?.similarUniversities?.length > 0 && (
            <section className="mt-12 border-t pt-8">
              <h2 className="text-2xl font-bold mb-4">Related Institutions</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {blog.similarUniversities.map(u => (
                  <div key={u.id} className="border rounded p-4 hover:shadow transition">
                    <h3 className="font-bold text-lg">{u.name}</h3>
                    <p>{u.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          <footer className="mt-12 border-t pt-8 text-center text-slate-600">
            <div>Academic Rating: <span className="font-bold text-amber-600">{blog?.rating}</span></div>
          </footer>
        </article>
      </main>
      <style jsx global>{`
        html { scroll-behavior: smooth; }
        article h1, article h2, article h3 { scroll-margin-top: 120px; }
      `}</style>
    </div>
  );
};

export default SingleBlogCard;
