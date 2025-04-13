import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { useState } from 'react'
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { Image, Loader } from 'lucide-react';

function PostCreation({ user }) {

    const [content, setContent] = useState("");
    const [image, setimg] = useState("");
    const [imagePreview, setimagePreview] = useState("");


    const queryClient = useQueryClient();

    const { mutate: createPostMutation, isPending } = useMutation({
        mutationFn: async (postData) => {
            const res = await axiosInstance.post("/posts/create", postData, {
                headers: { "Content-Type": "application/json" }
            });

            return res.data;


        },
        onSuccess: () => {
            resetForm();
            toast.success("Post created successfully");
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        },
        onError: (err) => {
            toast.error(err.response.data.message || "Failed to Create Post");
        }
    });


    const handlePostCreation = async () => {
        try {
            let postData = { content }
            if (imagePreview)
                postData.image = imagePreview;

            createPostMutation(postData);

        } catch (error) {

            console.error("Error in post creation", error);
            toast.error("Failed to create post");
        }
    }

    const resetForm = () => {
        setContent("");
        setimg(null);
        setimagePreview(null);
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setimg(file);

        if (file) {
            readFileAsDataURL(file).then(setimagePreview);
        }


    }

    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    return (
        <div className='bg-white rounded-lg shadow mb-4 p-4'>
            <div className='flex space-x-3'>
                <img src={user.profilePicture || '/avatar.png'} alt={user.name} className='w-12 h-12 rounded-full' />
                <textarea
                    placeholder="what's on your mind?"
                    className='w-full s-3 rounded-lg bg-gray-300 hover:bg-gray-500 focus:bg-base-200 focus:outline-none  p-2
                resize-none transition-colors duration-200 min-h-[100px]'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            {imagePreview && (
                <div className='mt-4'>
                    <img src={imagePreview} alt='selected' className='w-full h-auto rounded-lg' />
                </div>
            )}

            <div className='flex justify-between items-center mt-4'>
                <div className='flex space-x-4'>
                    <label className="flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer">
                        <Image size={20} className='mr-2' />
                        <span>Photos</span>
                        <input type="file" accept="image/" className='hidden' onChange={handleImageChange} />
                    </label>
                </div>

                <button className='bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark 
                transition-colors duration-200'
                    onClick={handlePostCreation}
                    disabled={isPending}
                >
                    {isPending ? <Loader className='size-5 animate-spin ' /> : "Share"}
                </button>
            </div>
        </div>
    )
}

export default PostCreation