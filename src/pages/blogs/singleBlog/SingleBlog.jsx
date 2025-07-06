import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetchBlogByIdQuery } from '../../../redux/features/blogs/blogsApi';
import SingleBlogCard from './SingleBlogCard';
import CommentCards from '../../comments/CommentCards';
import RelatedBlogs from './RelatedBlogs';

const SingleBlog = () => {
  const { id } = useParams();
  const { data: blog, error, isLoading } = useFetchBlogByIdQuery(id);

  return (
    <>
      <div className="relative flex flex-col lg:flex-row justify-center items-start px-4 mt-24 md:mt-20 overflow-x-hidden">
        
        {/* TOC Sidebar - fixed on large screens, hidden on mobile */}
        <aside className="hidden lg:block fixed left-6 top-20 lg:w-80 xl:w-96 h-[calc(100vh-5rem)] bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200/60 rounded-3xl overflow-hidden z-20">
          <div className="h-full flex flex-col">
            <div className="p-8 border-b border-slate-200/60 bg-gradient-to-r from-blue-50/80 to-amber-50/60">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📚</span>
                <h4 className="text-lg font-serif-academic font-bold text-slate-800">Table of Contents</h4>
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"></div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 text-slate-700 font-outfit text-sm leading-relaxed space-y-2">
              {/* You can dynamically build a TOC later. For now, placeholder items */}
              <ul className="space-y-1">
                <li>Introduction</li>
                <li>Key Highlights</li>
                <li>Details</li>
                <li>Comments</li>
                <li>Related</li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Blog Content */}
        <main className="w-full max-w-4xl mx-auto lg:ml-[21rem] lg:mr-[21rem]">
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-blue-800 text-lg">Loading blog post...</span>
            </div>
          )}

          {error && <div className="text-red-600 py-20 text-center">Something went wrong. Please try again.</div>}

          {blog?.post && (
            <>
              <SingleBlogCard blog={blog.post} />
              <div className="mt-12">
                <CommentCards blogId={id} />
              </div>
            </>
          )}
        </main>

        {/* Related Blogs Sidebar */}
        <aside className="hidden lg:block fixed right-6 top-20 lg:w-80 xl:w-96 h-[calc(100vh-5rem)] bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200/60 rounded-3xl overflow-hidden z-20 p-4">
          <RelatedBlogs />
        </aside>
      </div>
    </>
  );
};

export default SingleBlog;
