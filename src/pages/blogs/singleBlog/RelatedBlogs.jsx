import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetchRelatedBlogsQuery } from '../../../redux/features/blogs/blogsApi';
import { Link } from 'react-router-dom';

const RelatedBlogs = () => {
  const { id } = useParams();
  const { data: blogs = [], error, isLoading } = useFetchRelatedBlogsQuery(id);

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-white shadow min-h-[400px] w-full max-w-[400px] lg:max-w-[450px] xl:max-w-[500px] mx-auto p-3 sm:p-4 rounded-xl mt-8">
      <h3 className="text-lg font-semibold pt-3 pb-4 text-center text-[#1E40AF] tracking-wide">✨ Similar Universities</h3>
      <hr className="border-blue-300 mb-3" />
      {
        blogs.length === 0 ? (
          <div className='p-6 text-center text-gray-500 italic'>No related blogs!</div>
        ) : (
          <div className='space-y-3 mt-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200'>
            {
              blogs.map((blog, index) => (
                <Link 
                  to={`/blogs/${blog?._id}`}
                  key={blog.id || index} 
                  className='flex items-center gap-2 p-2 rounded-md shadow-sm hover:bg-blue-50 transition'
                >
                  {/* Image without any text inside it */}
                  <div className='w-10 h-10 flex-shrink-0'>
                    <img 
                      src={blog.coverImg} 
                      alt="cover" 
                      className='h-full w-full rounded-full ring-2 ring-blue-700 object-cover'
                    />
                  </div>
                  {/* Text outside the image */}
                  <div className='ml-2'>
                    <h4 className='font-semibold text-blue-800 leading-tight'>{blog?.title?.substring(0, 35)}</h4>
                    <p className='text-xs text-gray-700 font-light'>{blog?.description?.substring(0, 25)}...</p>
                  </div>
                </Link>
              ))
            }
          </div>
        )
      }
    </div>
  );
};

export default RelatedBlogs;
