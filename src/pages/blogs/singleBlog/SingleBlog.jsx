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
    <div className="text-primary container mx-auto mt-24 md:mt-20 px-4 lg:pl-80">
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-blue-800 text-lg">Loading blog post...</span>
        </div>
      )}

      {error && <div className="text-red-600">Something went wrong...</div>}

      {blog?.post && (
        <div className="flex flex-col lg:flex-row items-start gap-8 w-full">
          {/* Main Blog Content */}
          <div className="flex-1 min-w-0">
            <SingleBlogCard blog={blog.post} />
          </div>

          {/* Right Sidebar (Related Institutions) */}
          <div className="lg:w-80 w-full shrink-0 mt-6 lg:mt-0">
            <RelatedBlogs />
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleBlog;
