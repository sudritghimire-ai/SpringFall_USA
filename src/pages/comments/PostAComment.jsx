import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { usePostCommentMutation } from '../../redux/features/comments/commentApi'
import { useFetchBlogByIdQuery } from '../../redux/features/blogs/blogsApi'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const PostAComment = () => {
  const { id } = useParams()
  const [comment, setComment] = useState('')
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)

  const [postComment] = usePostCommentMutation()
  const { refetch } = useFetchBlogByIdQuery(id, { skip: !id })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error("⚠️ Please log in to post a comment.")
      navigate('/login')
      return
    }

    const newComment = {
      comment: comment,
      user: user?.id,
      postId: id
    }

    try {
      const response = await postComment(newComment).unwrap()
      console.log(response)
      toast.success('Comment Posted Successfully')
      setComment('')
      refetch()
    } catch (error) {
      toast.error("❌ An error occurred while posting the comment")
    }
  }

  // Only render for admin
  if (!user || user.role.toLowerCase() !== 'admin') {
    return null
  }

  return (
    <div className='mt-8'>
      <h3 className='text-lg font-medium mb-8'>
        Admin Wall
      </h3>
      <form onSubmit={handleSubmit}>
        <textarea 
          name='text' 
          value={comment} 
          onChange={(e) => setComment(e.target.value)}
          cols='30'
          rows='10'
          placeholder='Important notice to be added !'
          className='w-full bg-bgPrimary focus:outline-none p-5'
        />
        <button 
          type='submit' 
          className='w-full bg-primary hover:bg-indigo-500 text-white font-medium py-3 rounded-md'
        >
          Submit
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  )
}

export default PostAComment
