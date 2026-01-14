-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Enums
create type user_role as enum ('admin', 'ceo', 'manager', 'supervisor', 'hr', 'receptionist', 'accountant', 'marketing', 'designer', 'instructor', 'student');
create type course_status as enum ('draft', 'published', 'archived');
create type lesson_type as enum ('video', 'audio', 'text', 'quiz', 'assignment');

-- 2. Profiles (Extends Auth)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  role user_role not null default 'student',
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Programs (e.g. "Full Stack Bootcamp", "English Level 1")
create table programs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  thumbnail_url text,
  price decimal(10, 2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Courses (e.g. "React Basics", "Grammar 101")
create table courses (
  id uuid default uuid_generate_v4() primary key,
  program_id uuid references programs(id) on delete set null,
  title text not null,
  description text,
  status course_status default 'draft',
  instructor_id uuid references profiles(id),
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. Modules (e.g. "Chapter 1: Components")
create table modules (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references courses(id) on delete cascade not null,
  title text not null,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- 6. Lessons (e.g. "Video: State vs Props")
create table lessons (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references modules(id) on delete cascade not null,
  title text not null,
  type lesson_type not null default 'text',
  content text, -- For text lessons or JSON for rich content
  media_url text, -- Storage URL for Video/Audio
  duration integer, -- In seconds
  is_free boolean default false, -- Preview allowed?
  order_index integer default 0,
  created_at timestamptz default now()
);

-- 7. Enrollments
create table enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  program_id uuid references programs(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade, -- Optional if enrolling in single course
  enrolled_at timestamptz default now(),
  completed_at timestamptz,
  unique(user_id, program_id), 
  unique(user_id, course_id)
);

-- Enable RLS
alter table profiles enable row level security;
alter table programs enable row level security;
alter table courses enable row level security;
alter table modules enable row level security;
alter table lessons enable row level security;
alter table enrollments enable row level security;

-- Policies (Basic for now)
-- Profiles: Users can view own profile. Admins can view all.
create policy "Public profiles are viewable by everyone" on profiles for select using ( true );
create policy "Users can update own profile" on profiles for update using ( auth.uid() = id );

-- Programs/Courses: Publicly viewable (for catalog).
create policy "Content is viewable by everyone" on programs for select using ( true );
create policy "Content is viewable by everyone" on courses for select using ( true );

-- Trigger to create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'student');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
