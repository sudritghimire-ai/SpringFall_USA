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
      {/* Main Content */}
      <div className="text-primary container mx-auto mt-24 md:mt-20 px-4 sm:px-6 lg:px-8">
        <div>
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-blue-800 text-lg">Loading blog post...</span>
            </div>
          )}

          {error && <div className="text-red-600">Something went wrong...</div>}

          {blog?.post && (
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8 md:gap-12">
              {/* Blog Content */}
              <div className="w-full lg:w-2/3 ml-0 lg:ml-[-6rem] px-1 sm:px-2">
                <SingleBlogCard blog={blog.post} />
              </div>

              {/* Related Blogs */}
              <div className="w-full lg:w-1/4 mt-8 lg:mt-0 ml-0 lg:ml-8 px-1 sm:px-2">
                <RelatedBlogs />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SingleBlog;
