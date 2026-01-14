import { createClient } from '@/lib/supabase/client'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface FetchOptions extends RequestInit { }

export const apiClient = async (endpoint: string, options: FetchOptions = {}) => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.access_token) {
        throw new Error('Not authenticated')
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        ...options.headers,
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'An error occurred' }))
        throw new Error(error.error || `Request failed with status ${response.status}`)
    }

    // For 204 No Content
    if (response.status === 204) return null

    return response.json()
}
