"use client"

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, Bell, User } from 'lucide-react'

export function Header({ user }: { user: any }) {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/login')
    }

    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
            <div className="flex items-center">
                {/* Breadcrumb or Title placeholder */}
                <h2 className="text-lg font-medium text-gray-900">Dashboard</h2>
            </div>
            <div className="flex items-center space-x-4">
                <button className="rounded-full p-1 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">View notifications</span>
                    <Bell className="h-6 w-6" />
                </button>

                <div className="relative ml-3 flex items-center space-x-3">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-gray-700">{user?.user_metadata?.full_name || user?.email}</span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <User className="h-5 w-5" />
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="ml-2 rounded-md p-1 text-gray-400 hover:text-red-600"
                        title="Sign out"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    )
}
