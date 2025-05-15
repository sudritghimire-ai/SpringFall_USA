import React from 'react'
import commentorIcon from "../../assets/images/comment.png"
import { formatDate } from '../../utils/formatDate'
import PostAComment from './PostAComment'
import { useSelector } from 'react-redux'

const CommentCards = ({comments}) => {

    const user = useSelector((state) => state.auth.user);

  return (
    <div className='my-6 bg-white p-8 '>

        <div>
            {
                comments?.length > 0 ? <div>
        <h3 className='text-lg font-medium underline'>Pinned University Notices

</h3>

        <div>{

            comments.map((comment,index)=>(
                <div key={index}>
        <div>
  <img src={commentorIcon} alt='' className='h-14'></img>
  <div>

    <p className='text-lg font-medium underline capitalize underline-offset-4 text-blue-400'>{comment?.user?.username}</p>

    <div>

        <p className='text-[12px] italic'>{formatDate(comment.createdAt)}</p>
        </div>
    </div>
    {/*  comment as posted by the user*/}

    <div className='text-gray-600 mt-5 p-8 bg-bgPrimary shadow-sm' >
        <p className='md:w-4/5'>{comment?.comment}</p>


        </div>

            </div>

                    </div>
            ))
            }
            
            </div>



                </div> :  <div  className='text-lg font-medium'>Admin has not posted any updates for this university.</div>
            }
        </div>



        {/* add comments here */}

        <div>

  <PostAComment />


        </div>
    </div>
  )
}

export default CommentCards