import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const role = profile?.role || 'student'

    if (role === 'admin') redirect('/dashboard/admin')
    if (role === 'student') redirect('/dashboard/student')
    if (role === 'instructor') redirect('/dashboard/instructor')

    // Fallback
    redirect('/dashboard/student')
}
