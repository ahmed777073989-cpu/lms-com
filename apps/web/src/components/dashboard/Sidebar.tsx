"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Settings,
    GraduationCap,
    FileText,
    BarChart,
    Home
} from 'lucide-react'

type Role = 'admin' | 'student' | 'instructor' | string

interface SidebarProps {
    role: Role
}

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname()

    const links = {
        admin: [
            { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
            { href: '/dashboard/admin/users', label: 'Users', icon: Users },
            { href: '/dashboard/admin/courses', label: 'All Courses', icon: BookOpen },
            { href: '/dashboard/admin/reports', label: 'Reports', icon: BarChart },
            { href: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
        ],
        instructor: [
            { href: '/dashboard/instructor', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/dashboard/instructor/my-courses', label: 'My Courses', icon: BookOpen },
            { href: '/dashboard/instructor/assignments', label: 'Assignments', icon: FileText },
        ],
        student: [
            { href: '/dashboard/student', label: 'My Learning', icon: GraduationCap },
            { href: '/dashboard/student/catalog', label: 'Course Catalog', icon: BookOpen },
            { href: '/dashboard/student/achievements', label: 'Achievements', icon: BarChart },
        ],
        // Fallback/Default
        default: [
            { href: '/dashboard', label: 'Home', icon: Home },
        ]
    }

    // Select links based on role, fallback to default if role specific links don't exist
    // Simplification: In a real app we might merge common links.
    const navItems = links[role as keyof typeof links] || links.default

    return (
        <div className="flex h-full w-64 flex-col border-r bg-white">
            <div className="flex h-16 items-center justify-center border-b px-4">
                <h1 className="text-xl font-bold text-indigo-600">LMS Platform</h1>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <Icon className={cn("mr-3 h-5 w-5 flex-shrink-0", isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-500")} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
            <div className="border-t p-4">
                <div className="flex items-center">
                    <div className="ml-3">
                        <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">Logged in as {role}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
