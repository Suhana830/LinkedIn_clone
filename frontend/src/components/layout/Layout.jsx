import React from 'react'
import Navbar from './Navbar'
import { useQuery } from '@tanstack/react-query'

function Layout({ children }) {

    // from app.jsx to layout
    // const { data: authUser, isLoading } = useQuery({ queryKey: ["auth_User"] });
    // console.log("auth user is in layout ", authUser);

    return <div className="min-h-screen bg-gray-300">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">
            {children}
        </main>
    </div>
}

export default Layout