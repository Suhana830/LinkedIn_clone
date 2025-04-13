import { useState } from "react"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from "../../lib/axios.js";
import { toast } from 'react-hot-toast'
import { Loader } from "lucide-react";




function SignUpForm() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const queryClient = useQueryClient();

  const { mutate: signUpMutation, isLoading } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/signup", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err.response.data.message || "something wents wrong");
    }

  })


  const handleSignup = (e) => {
    e.preventDefault();
    signUpMutation({ name, username, email, password })
  }

  return <form onSubmit={handleSignup} className="flex flex-col gap-4">
    <div>
      <input
        type="text"
        placeholder="Full name"
        value={name} onChange={(e) => setName(e.target.value)}
        className="input text-gray-900 input-bordered w-full bg-gray-300 focus:border-blue-400" required
      />
    </div>

    <div>
      <input type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input  text-gray-900 input-bordered w-full  bg-gray-300 focus:border-blue-400"
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

    <div>
      <input type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input  text-gray-900 input-bordered  w-full  bg-gray-300 focus:border-blue-400"
        required
      />
    </div>

    <button type="submit" disabled={isLoading} className="btn btn-primary w-full text-white ">
      {isLoading ? <Loader className="size-5 animate-spin" /> : "Agree & Join"}
    </button>



  </form>
}

export default SignUpForm