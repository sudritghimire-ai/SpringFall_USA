"use client"
import { useParams } from "react-router-dom"
import { useFetchRelatedBlogsQuery } from "../../../redux/features/blogs/blogsApi"
import { Link } from "react-router-dom"

const RelatedBlogs = () => {
  const { id } = useParams()
  const { data: blogs = [], error, isLoading } = useFetchRelatedBlogsQuery(id)

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 shadow-xl min-h-[400px] w-full max-w-[400px] lg:max-w-[450px] xl:max-w-[500px] mx-auto p-6 rounded-xl mt-8 border border-gray-200">
        <div className="flex items-center justify-center gap-2 pt-3 pb-4">
          <span className="text-lg">🎓</span>
          <h3 className="text-lg font-serif font-semibold text-center text-slate-800 tracking-wide">
            Related Institutions
          </h3>
        </div>
        <div className="w-16 h-0.5 bg-amber-600 rounded-full mx-auto mb-4"></div>

        {/* Loading skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-3 p-3 rounded-lg bg-white/50 animate-pulse">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 shadow-xl min-h-[200px] w-full max-w-[400px] lg:max-w-[450px] xl:max-w-[500px] mx-auto p-6 rounded-xl mt-8 border border-gray-200">
        <div className="flex items-center justify-center gap-2 pt-3 pb-4">
          <span className="text-lg">⚠️</span>
          <h3 className="text-lg font-serif font-semibold text-center text-slate-800 tracking-wide">
            Related Institutions
          </h3>
        </div>
        <div className="w-16 h-0.5 bg-amber-600 rounded-full mx-auto mb-4"></div>
        <div className="text-center text-gray-600 italic py-8">
          <p>Unable to load related content</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 shadow-xl min-h-[400px] w-full max-w-[400px] lg:max-w-[450px] xl:max-w-[500px] mx-auto p-6 rounded-xl mt-8 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 pt-3 pb-4">
        <span className="text-lg">🎓</span>
        <h3 className="text-lg font-serif font-semibold text-center text-slate-800 tracking-wide">
          Related Institutions
        </h3>
      </div>
      <div className="w-16 h-0.5 bg-amber-600 rounded-full mx-auto mb-6"></div>

      {blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <span className="text-4xl mb-4 opacity-50">📚</span>
          <p className="text-gray-600 italic font-serif">No related institutions found</p>
          <p className="text-sm text-gray-500 mt-2">Check back later for more content</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {blogs.map((blog, index) => (
            <Link
              to={`/blogs/${blog?._id}`}
              key={blog.id || index}
              className="group flex items-center gap-4 p-4 rounded-xl bg-white/80 hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200"
            >
              {/* Image Container */}
              <div className="relative w-12 h-12 flex-shrink-0">
                <img
                  src={blog.coverImg || "/placeholder.svg"}
                  alt="Institution cover"
                  className="h-full w-full rounded-full object-cover border-2 border-blue-200 group-hover:border-amber-400 transition-colors duration-300"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-amber-100 transition-colors duration-300">
                  <span className="text-xs">🏛️</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-blue-900 leading-tight mb-1 group-hover:text-amber-700 transition-colors duration-300 truncate">
                  {blog?.title?.substring(0, 40)}
                  {blog?.title?.length > 40 && "..."}
                </h4>
                <p className="text-xs text-gray-600 font-light leading-relaxed line-clamp-2">
                  {blog?.description?.substring(0, 60)}
                  {blog?.description?.length > 60 && "..."}
                </p>

                {/* Category badge if available */}
                {blog?.category && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors duration-300">
                    {blog.category}
                  </span>
                )}
              </div>

              {/* Arrow indicator */}
              <div className="flex-shrink-0 text-gray-400 group-hover:text-amber-600 transition-colors duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Footer note */}
      {blogs.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500 italic font-serif">Curated by SpringFallUSA Academic Team</p>
        </div>
      )}

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Custom scrollbar */
        .space-y-3::-webkit-scrollbar {
          width: 4px;
        }
        
        .space-y-3::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }
        
        .space-y-3::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        
        .space-y-3::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  )
}

export default RelatedBlogs
