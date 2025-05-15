import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import EditorjsList from '@editorjs/list';
import Embed from '@editorjs/embed'; // Import Embed tool
import Table from '@editorjs/table'; // Import Table tool
import { useFetchBlogByIdQuery, useUpdateBlogMutation } from '../../../redux/features/blogs/blogsApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Delimiter from '@editorjs/delimiter';  // Import Delimiter tool

const UpdatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const [title, setTitle] = useState('');
  const [coverImg, setCoverImg] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const { data: blog = {}, isLoading } = useFetchBlogByIdQuery(id);
  const [updateBlog] = useUpdateBlogMutation();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (blog?.post) {
      setTitle(blog.post.title || '');
      setCoverImg(blog.post.coverImg || '');
      setMetaDescription(blog.post.description || '');
      setCategory(blog.post.category || '');
      setRating(blog.post.rating?.toString() || '');

      const editor = new EditorJS({
        holder: 'editorjs',
        onReady: () => {
          editorRef.current = editor;
        },
        autofocus: true,
        tools: {
          header: { class: Header, inlineToolbar: true },
          list: { class: EditorjsList, inlineToolbar: true },
          embed: {
            class: Embed,
            inlineToolbar: true,
            config: {
              services: {
                youtube: true, // Enable YouTube embedding
                // You can add other services like Vimeo, Instagram, etc. if needed
              },
            },
          },
          table: { class: Table, inlineToolbar: true },  // Add Table tool
          delimiter: Delimiter,  // Add Delimiter tool
        },
        data: blog.post.content,
      });

      return () => {
        if (editorRef.current?.destroy) {
          editorRef.current.destroy();
          editorRef.current = null;
        }
      };
    }
  }, [blog]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      setMessage('Rating must be between 1 and 5.');
      setMessageType('error');
      return;
    }

    if (!editorRef.current) {
      setMessage('Editor not ready yet!');
      setMessageType('error');
      return;
    }

    const editorData = await editorRef.current.save();

    const updatedPost = {
      title,
      coverImg,
      content: editorData,
      description: metaDescription,
      author: user?._id,
      rating: Number(rating),
      category,
      updatedAt: new Date(),
    };

    try {
      await updateBlog({ id, updatedData: updatedPost }).unwrap();
      toast.success('Blog updated successfully!');
      setMessageType('success');

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('❌ Error updating blog. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 p-8">
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-12">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">Edit And Update Post</h2>

        {message && (
          <div
            className={`mt-5 p-4 rounded-lg ${
              messageType === 'success'
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}
          >
            {message}
          </div>
        )}

        {!isLoading && blog?.post ? (
          <form className="space-y-6 pt-8" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <label className="font-semibold text-xl text-blue-700 underline">University Blog Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-5 py-3 focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Texas State University"
                required
              />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mt-8">
              <div className="md:w-2/3 w-full bg-gray-50 p-6 rounded-lg shadow-md">
                <p className="font-semibold text-xl text-blue-700 mb-5 underline">Content Section</p>
                <p className="text-xs italic text-gray-500 mb-3">Write your post below here:</p>
                <div id="editorjs"></div>
              </div>

              <div className="md:w-1/3 w-full border bg-gray-50 p-6 space-y-6 rounded-lg shadow-md">
                <div className="space-y-4">
                  <label className="font-semibold text-xl text-blue-700 underline">University Blog Cover Image:</label>
                  <input
                    type="text"
                    value={coverImg}
                    onChange={(e) => setCoverImg(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-5 py-3 focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: https://example.com/image.png"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="font-semibold text-xl text-blue-700 underline">Rating (1-5):</label>
                  <input
                    type="number"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-5 py-3 focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 5"
                    min="1"
                    max="5"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <label className="font-semibold text-xl text-blue-700 underline">Description:</label>
                  <input
                    type="text"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 px-4 py-3 rounded-md text-lg"
                    placeholder="Ex: 5"
                    min="1"
                    max="5"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="font-semibold text-xl text-blue-700 underline">Author:</label>
                  <input
                    type="text"
                    value={user?.username || ''}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-5 py-3 focus:ring-2 focus:ring-blue-500"
                    placeholder={`${user?.username || 'Unknown'} (not editable)`}
                    disabled
                  />
                </div>
              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-md focus:outline-none"
            >
              Update the university blog
            </button>
          </form>
        ) : (
          <p className="text-center mt-10 text-lg font-semibold text-blue-700">Loading blog data...</p>
        )}

        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
};

export default UpdatePost;
