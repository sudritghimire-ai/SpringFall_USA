import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import Delimiter from '@editorjs/delimiter'; // ✅ Import Delimiter
import Table from '@editorjs/table'; // ✅ Import Table tool
import { usePostBlogMutation } from '../../../redux/features/blogs/blogsApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddPost = () => {
  const editorRef = useRef(null);

  const [title, setTitle] = useState('');
  const [coverImg, setCoverImg] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const [postBlog, { isLoading }] = usePostBlogMutation();
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    const editor = new EditorJS({
      holder: 'editorjs',
      autofocus: true,
      onReady: () => {
        editorRef.current = editor;
      },
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            levels: [1, 2, 3],
            defaultLevel: 2,
          },
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered',
          },
        },
        embed: {
          class: Embed,
          inlineToolbar: true,
          config: {
            services: {
              youtube: true,
            },
            captionPlaceholder: 'Add a caption here...',
          },
        },
        delimiter: Delimiter, // ✅ Register Delimiter
        table: Table, // ✅ Register Table tool
      },
    });

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

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

    const newPost = {
      title,
      coverImg,
      content: editorData,
      description: metaDescription,
      author: user?._id,
      rating: Number(rating),
      category,
      createdAt: new Date(),
    };

   try {
  await postBlog(newPost).unwrap();

      toast.success('Blog posted successfully!');
      setMessageType('success');

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error posting blog:', error);
      toast.error('❌ Error posting blog. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-semibold text-center text-indigo-900 mb-6">
          Create A New University Blog
        </h2>

        {message && (
          <div
            className={`mt-5 p-4 rounded ${
              messageType === 'success'
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}
          >
            {message}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="font-semibold text-lg text-indigo-800 underline">
              University Blog Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 px-4 py-3 rounded-md text-lg"
              placeholder="Ex: Texas State University"
              required
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3 w-full bg-gray-50 p-5 rounded-lg shadow-sm">
              <p className="font-semibold text-lg text-indigo-700 mb-3 underline">Content Section</p>
              <p className="text-xs text-gray-500 italic mb-5">Write your post below here:</p>
              <div
                id="editorjs"
                className="border rounded-md shadow-sm p-3 min-h-[250px] bg-white"
              ></div>
            </div>

            <div className="md:w-1/3 w-full bg-gray-50 p-5 rounded-lg shadow-sm space-y-5">
              <div>
                <label className="font-semibold text-lg text-indigo-800 underline">
                  University Blog Cover Image:
                </label>
                <input
                  type="text"
                  value={coverImg}
                  onChange={(e) => setCoverImg(e.target.value)}
                  className="w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 px-4 py-3 rounded-md text-lg"
                  placeholder="Ex: https://example.com/image.png"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-lg text-indigo-800 underline">Rating (1-5):</label>
                <input
                  type="number"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 px-4 py-3 rounded-md text-lg"
                  placeholder="Ex: 5"
                  min="1"
                  max="5"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-lg text-indigo-800 underline">Description:</label>
                <input
                  type="text"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 px-4 py-3 rounded-md text-lg"
                  placeholder="Short summary of your post"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-lg text-indigo-800 underline">Author:</label>
                <input
                  type="text"
                  value={user.username}
                  className="w-full bg-gray-100 px-4 py-3 rounded-md text-lg"
                  disabled
                />
              </div>
            </div>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-md transition-all duration-300"
          >
            {isLoading ? 'Posting...' : 'Add New University Blog'}
          </button>
        </form>

        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
};

export default AddPost;
