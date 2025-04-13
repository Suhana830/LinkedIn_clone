import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { axiosInstance } from '../lib/axios';
import { Link } from 'react-router-dom';
import { Loader, MessageCircle, Send, Share, ThumbsUp, Trash, Trash2, Trash2Icon } from 'lucide-react';
import PostAction from './PostAction';
import { formatDistanceToNow } from 'date-fns'

function PostView({ post }) {

    const queryClient = useQueryClient();
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const [showComment, setShowComment] = useState(false);
    const [newComment, setnewComments] = useState("");
    const [comments, setComments] = useState(post.comments || []);

    const isOwner = authUser._id === post.author._id;
    let isLiked = post.likes.includes(authUser._id);

    const { mutate: deletePost, isPending: isDeletedPost } = useMutation({
        mutationFn: async () => {
            await axiosInstance.delete(`/posts/delete/${post._id}`);

        },
        onSuccess: () => {


            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success("Post created successfully");
        },
        onError: (error) => {
            toast.error(error.response.data.message || "Something went wrong");

        }
    });

    const { mutate: createComment, isPending: isCreatingComment } = useMutation({
        mutationFn: async (newComment) => {
            await axiosInstance.post(`/posts/${post._id}/comment`, { content: newComment });

        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("Comment added successfully");
        },
        onError: (error) => {
            toast.error(error.response.data.message || "Something went wrong");
        }
    })

    const { mutate: likePost, isPending: isLikePost } = useMutation({
        mutationFn: async () => {
            await axiosInstance.post(`/posts/${post._id}/like`);

        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["post", post] });
        },

    });


    const handleDeletePost = () => {
        if (!window.confirm("Are you sure you want to delete this Post ?")) return;

        deletePost();

    }
    const handleLikePost = async () => {
        likePost();
    }

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            createComment(newComment);
            setComments([
                ...comments,
                {
                    content: newComment,
                    user: {
                        _id: authUser._id,
                        name: authUser.name,
                        profilePicture: authUser.profilePicture
                    },
                    createdAt: new Date()
                }
            ])
            setnewComments("");
        }

    }


    return (
        <div className='bg-white rounded-lg shadow mb-4 text-black'>
            <div className='p-4'>
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center'>
                        <Link to={`/profile/${post?.author?.username}`}>
                            <img
                                src={post.author.profilePicture || "/avatar.png"}
                                alt={post.author.name}
                                className='size-10 rounded-full mr-3'
                            />
                        </Link>

                        <div>
                            <Link to={`/profile/${post?.author?.username}`}>
                                <h3 className='font-semibold'>{post.author.name}</h3>
                            </Link>
                            <p className='text-xs text-info'>{post.author.headline}</p>
                            <p className='text-xs text-info'>
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                    {isOwner && (
                        <button onClick={handleDeletePost} className='text-red-500 hover:text-red-700'>
                            {isDeletedPost ? <Loader size={18} className='animate-spin' /> : <Trash2 size={18} />}
                        </button>
                    )}
                </div>
                <p className='mb-4'>{post.content}</p>
                {post.image && <img src={post.image} alt='Post content' className='rounded-lg w-full mb-4' />}

                <div className='flex justify-between text-info'>
                    <PostAction
                        icon={<ThumbsUp size={18} className={isLiked ? "text-blue-500  fill-blue-300" : ""} />}
                        text={`Like (${post.likes.length})`}
                        onClick={handleLikePost}
                    />

                    <PostAction
                        icon={<MessageCircle size={18} />}
                        text={`Comment (${comments.length})`}
                        onClick={() => setShowComment(!showComment)}
                    />
                    <PostAction icon={<Share size={18} />} text='Share' />
                </div>
            </div>


            {showComment && (
                <div className='px-4 pb-4'>
                    <div className='mb-4 max-h-60 overflow-y-auto'>
                        {comments.map((comment) => (
                            <div key={comment._id} className='mb-2 bg-base-100 p-2 rounded flex items-start'>
                                <img
                                    src={comment.user.profilePicture || "/avatar.png"}
                                    alt={comment.user.name}
                                    className='w-8 h-8 rounded-full mr-2 flex-shrink-0'
                                />
                                <div className='flex-grow'>
                                    <div className='flex items-center mb-1'>
                                        <span className='font-semibold mr-2'>{comment.user.name}</span>
                                        <span className='text-xs text-info'>
                                            {formatDistanceToNow(new Date(comment.createdAt))}
                                        </span>
                                    </div>
                                    <p>{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleAddComment} className='flex items-center'>
                        <input
                            type='text'
                            value={newComment}
                            onChange={(e) => setnewComments(e.target.value)}
                            placeholder='Add a comment...'
                            className='flex-grow p-2 rounded-l-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary'
                        />

                        <button
                            type='submit'
                            className='bg-primary text-white p-2 rounded-r-full hover:bg-primary-dark transition duration-300'
                            disabled={isCreatingComment}
                        >
                            {isCreatingComment ? <Loader size={18} className='animate-spin' /> : <Send size={18} />}
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default PostView