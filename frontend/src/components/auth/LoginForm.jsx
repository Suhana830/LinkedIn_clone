import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { axiosInstance } from '../../lib/axios';

function LoginForm() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const queryClient = useQueryClient();

    const { mutate: loginMutation, isLoading } = useMutation({
        mutationFn: (userData) => axiosInstance.post("/auth/login", userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: (err) => {
            toast.error(err.response.data.message || "Something went wrong");

        }
    })

    const handleLogin = (e) => {
        e.preventDefault();
        loginMutation({ username, password })
    }

    return <form onSubmit={handleLogin} className="flex flex-col gap-4">

        <div>
            <input type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input  text-gray-900 input-bordered  w-full  bg-gray-300 focus:border-blue-400"
                required
            />
        </div>

        <div>
            <input type="text"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input  text-gray-900 input-bordered w-full  bg-gray-300 focus:border-blue-400"
                required
            />
        </div>



        <button type="submit" disabled={isLoading} className="btn btn-primary w-full text-white ">
            {isLoading ? <Loader className="size-5 animate-spin" /> : "Login"}
        </button>



    </form>

}

export default LoginForm