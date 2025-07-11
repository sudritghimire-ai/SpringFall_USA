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

      <div className="text-primary container mx-auto mt-24 md:mt-20 px-4">
        <div>
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-blue-800 text-lg">Loading blog post...</span>
            </div>
          )}

          {error && <div className="text-red-600">Something went wrong...</div>}

          {blog?.post && (
          <div className="flex flex-col lg:flex-row justify-between items-start md:gap-12 gap-8 overflow-x-hidden">
  {/* Main blog content with safer width and no negative margins */}
  <div className="w-full xl:w-[72%] lg:w-[70%]">
    <SingleBlogCard blog={blog.post} />
  </div>

  {/* Related blogs with consistent sizing */}
  <div className="w-full lg:w-[28%] mt-6 lg:mt-0">
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
