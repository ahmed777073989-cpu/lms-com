export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            courses: {
                Row: {
                    cover_image_url: string | null
                    created_at: string | null
                    description: string | null
                    id: string
                    instructor_id: string | null
                    is_published: boolean | null
                    price: number | null
                    title: string
                    updated_at: string | null
                }
                Insert: {
                    cover_image_url?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    instructor_id?: string | null
                    is_published?: boolean | null
                    price?: number | null
                    title: string
                    updated_at?: string | null
                }
                Update: {
                    cover_image_url?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    instructor_id?: string | null
                    is_published?: boolean | null
                    price?: number | null
                    title?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "courses_instructor_id_fkey"
                        columns: ["instructor_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            lessons: {
                Row: {
                    content: string | null
                    created_at: string | null
                    id: string
                    is_free_preview: boolean | null
                    module_id: string
                    sort_order: number | null
                    title: string
                    type: Database["public"]["Enums"]["lesson_type"] | null
                    video_url: string | null
                }
                Insert: {
                    content?: string | null
                    created_at?: string | null
                    id?: string
                    is_free_preview?: boolean | null
                    module_id: string
                    sort_order?: number | null
                    title: string
                    type?: Database["public"]["Enums"]["lesson_type"] | null
                    video_url?: string | null
                }
                Update: {
                    content?: string | null
                    created_at?: string | null
                    id?: string
                    is_free_preview?: boolean | null
                    module_id?: string
                    sort_order?: number | null
                    title?: string
                    type?: Database["public"]["Enums"]["lesson_type"] | null
                    video_url?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "lessons_module_id_fkey"
                        columns: ["module_id"]
                        isOneToOne: false
                        referencedRelation: "modules"
                        referencedColumns: ["id"]
                    },
                ]
            }
            modules: {
                Row: {
                    course_id: string
                    created_at: string | null
                    id: string
                    sort_order: number | null
                    title: string
                }
                Insert: {
                    course_id: string
                    created_at?: string | null
                    id?: string
                    sort_order?: number | null
                    title: string
                }
                Update: {
                    course_id?: string
                    created_at?: string | null
                    id?: string
                    sort_order?: number | null
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "modules_course_id_fkey"
                        columns: ["course_id"]
                        isOneToOne: false
                        referencedRelation: "courses"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    created_at: string | null
                    email: string | null
                    full_name: string | null
                    id: string
                    role: Database["public"]["Enums"]["app_role"] | null
                    updated_at: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string | null
                    email?: string | null
                    full_name?: string | null
                    id: string
                    role?: Database["public"]["Enums"]["app_role"] | null
                    updated_at?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string | null
                    email?: string | null
                    full_name?: string | null
                    id?: string
                    role?: Database["public"]["Enums"]["app_role"] | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            students: {
                Row: {
                    academic_history: Json | null
                    attendance_record: Json | null
                    enrollment_status: Database["public"]["Enums"]["enrollment_status"] | null
                    id: string
                    student_id_number: string | null
                }
                Insert: {
                    academic_history?: Json | null
                    attendance_record?: Json | null
                    enrollment_status?: Database["public"]["Enums"]["enrollment_status"] | null
                    id: string
                    student_id_number?: string | null
                }
                Update: {
                    academic_history?: Json | null
                    attendance_record?: Json | null
                    enrollment_status?: Database["public"]["Enums"]["enrollment_status"] | null
                    id?: string
                    student_id_number?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "students_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            app_role:
            | "admin"
            | "ceo"
            | "general_manager"
            | "educational_supervision_manager"
            | "hr"
            | "receptionist"
            | "accountant"
            | "marketing"
            | "graphic_designer"
            | "instructor"
            | "student"
            enrollment_status:
            | "lead"
            | "registered"
            | "enrolled"
            | "active"
            | "graduated"
            | "alumni"
            lesson_type: "video" | "text" | "quiz" | "assignment"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
