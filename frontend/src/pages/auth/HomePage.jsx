import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '../../lib/axios'
import toast from 'react-hot-toast';
import SideLayout from '../../components/SideLayout';
import PostCreation from '../../components/PostCreation';
import { Users } from 'lucide-react';
import PostView from '../../components/PostView';
import RecommendedUser from '../../components/RecommendedUser';



function HomePage() {

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const { data: recommendedUser } = useQuery({
        queryKey: ["recommendedUser"],

        queryFn: async () => {
            try {
                const res = await axiosInstance.get("/user/suggestions");
                return res.data;
            } catch (error) {
                toast.error(error.response.data.message || "Something went wrong");

            }
        }

    })

    const { data: posts } = useQuery({
        queryKey: ["posts"],

        queryFn: async () => {
            try {
                const res = await axiosInstance.get("/posts");
                return res.data;
            } catch (error) {
                toast.error(error.response.data.message || "Something went wrong");

            }
        }

    })
    console.log(recommendedUser)


    return (
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            <div className='hidden lg:block lg:col-span-1'>
                <SideLayout user={authUser} />
            </div>

            <div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
                <PostCreation user={authUser} />

                {posts?.map(post => <PostView key={post._id} post={post} />)}

                {
                    posts?.length === 0 && (
                        <div className='bg-white roundend-lg shadow p-8 text-center'>
                            <div className='mb-6'>
                                <Users size={64} className='mx-auto text-blue-500' />
                            </div>
                            <h2 className='text-2xl front-bold mb-4 text-gray-800'>No Posts Yets</h2>
                            <p className='text-gray-640 mb-6'>Connect which others to start seeing posts in your feed !</p>
                        </div>
                    )
                }
            </div>

            {recommendedUser?.length > 0 && (
                <div className='col-span-1 lg:col-span-1 hidden lg:block'>
                    <div className='bg-white text-black rounded-lg shadow p-4'>
                        <h2 className='font-semibold mb-4'>People you may know</h2>
                        {recommendedUser?.map((user) => (
                            <RecommendedUser key={user._id} user={user} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default HomePage