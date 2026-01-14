const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role for Backend
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware: Verify Supabase Token
const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid token' });

  req.user = user;
  next();
};

// Middleware: Check Role
const requireRole = (allowedRoles) => async (req, res, next) => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', req.user.id)
    .single();

  // Allow if role matches one of the allowed roles
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!profile || !roles.includes(profile.role)) {
    return res.status(403).json({ error: `Forbidden: Requires one of [${roles.join(', ')}]` });
  }
  next();
};

app.get('/', (req, res) => {
  res.json({ message: 'LMS Core Service is Running' });
});

// Example: Get Users (Protected + Admin/Manager only)
app.get('/api/users', requireAuth, requireRole(['admin', 'ceo', 'manager']), async (req, res) => {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// --- Course Routes ---

// List Courses
app.get('/api/courses', requireAuth, async (req, res) => {
  // If student, maybe filtered? For now, admin view fetches all.
  // In a real app we'd filter based on parameters or roles.

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', req.user.id)
    .single();

  let query = supabase.from('courses').select('*, instructor:profiles(full_name)');

  // If instructor, show only their courses? 
  // For MVP Admin sees all. Instructor sees theirs.
  if (profile.role === 'instructor') {
    query = query.eq('instructor_id', req.user.id);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Create Course
app.post('/api/courses', requireAuth, requireRole(['admin', 'instructor']), async (req, res) => {
  const { title, description, price, cover_image_url } = req.body;

  const { data, error } = await supabase
    .from('courses')
    .insert({
      title,
      description,
      price,
      cover_image_url,
      instructor_id: req.user.id, // Default to creator
      status: 'draft'
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// Update Course
app.put('/api/courses/:id', requireAuth, requireRole(['admin', 'instructor']), async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // TODO: Verify ownership if instructor

  const { data, error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Delete Course
app.delete('/api/courses/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

// --- Module Routes ---

// Get Modules for a Course
app.get('/api/courses/:courseId/modules', requireAuth, async (req, res) => {
  const { courseId } = req.params;

  const { data, error } = await supabase
    .from('modules')
    .select('*, lessons(*)')
    .eq('course_id', courseId)
    .order('sort_order', { ascending: true }); // Use sort_order

  if (error) return res.status(500).json({ error: error.message });

  // Sort lessons inside modules manually if needed or via modifier
  // Supabase JS modifiers for nested resources is tricky for ordering, 
  // doing simple sort here ensures correctness
  data.forEach(module => {
    if (module.lessons) {
      module.lessons.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    }
  });

  res.json(data);
});

// Create Module
app.post('/api/courses/:courseId/modules', requireAuth, requireRole(['admin', 'instructor']), async (req, res) => {
  const { courseId } = req.params;
  const { title } = req.body;

  const { data, error } = await supabase
    .from('modules')
    .insert({
      course_id: courseId,
      title,
      sort_order: 0 // Default, logic to put at end can be added later
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// Update Module
app.put('/api/modules/:id', requireAuth, requireRole(['admin', 'instructor']), async (req, res) => {
  const { id } = req.params;
  const { title, sort_order } = req.body;

  const { data, error } = await supabase
    .from('modules')
    .update({ title, sort_order })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Delete Module
app.delete('/api/modules/:id', requireAuth, requireRole(['admin', 'instructor']), async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('modules')
    .delete()
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

// --- Lesson Routes ---

// Create Lesson
app.post('/api/modules/:moduleId/lessons', requireAuth, requireRole(['admin', 'instructor']), async (req, res) => {
  const { moduleId } = req.params;
  const { title, type, content, is_free_preview } = req.body;

  const { data, error } = await supabase
    .from('lessons')
    .insert({
      module_id: moduleId,
      title,
      type: type || 'text',
      content,
      is_free_preview,
      sort_order: 0
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// Update Lesson
app.put('/api/lessons/:id', requireAuth, requireRole(['admin', 'instructor']), async (req, res) => {
  const { id } = req.params;
  const updates = req.body; // title, content, type, etc.

  const { data, error } = await supabase
    .from('lessons')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Delete Lesson
app.delete('/api/lessons/:id', requireAuth, requireRole(['admin', 'instructor']), async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

// --- Enrollment & Progress Routes ---

// Enroll in Course
app.post('/api/courses/:courseId/enroll', requireAuth, async (req, res) => {
  const { courseId } = req.params;

  // Check if already enrolled
  const { data: existing } = await supabase
    .from('course_enrollments')
    .select('id')
    .eq('course_id', courseId)
    .eq('student_id', req.user.id)
    .single();

  if (existing) return res.status(200).json({ message: 'Already enrolled', enrollment: existing });

  // Enroll
  const { data, error } = await supabase
    .from('course_enrollments')
    .insert({
      course_id: courseId,
      student_id: req.user.id
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// Get Course Progress (Enrolled Students only)
app.get('/api/courses/:courseId/progress', requireAuth, async (req, res) => {
  const { courseId } = req.params;

  // Get Enrollment ID
  const { data: enrollment } = await supabase
    .from('course_enrollments')
    .select('id')
    .eq('course_id', courseId)
    .eq('student_id', req.user.id)
    .single();

  if (!enrollment) return res.status(403).json({ error: 'Not enrolled' });

  // Get Progress
  const { data: progress, error } = await supabase
    .from('lesson_progress')
    .select('lesson_id, is_completed, last_watched_position')
    .eq('enrollment_id', enrollment.id);

  if (error) return res.status(500).json({ error: error.message });

  // Return as a map for easy lookup: { [lessonId]: { is_completed: true } }
  const progressMap = progress.reduce((acc, curr) => {
    acc[curr.lesson_id] = curr;
    return acc;
  }, {});

  res.json(progressMap);
});

// Mark Lesson Complete
app.post('/api/lessons/:lessonId/complete', requireAuth, async (req, res) => {
  const { lessonId } = req.params;
  const { is_completed = true } = req.body;

  // 1. Find the Course this Lesson belongs to (via Module)
  const { data: lesson } = await supabase
    .from('lessons')
    .select('module_id, modules(course_id)')
    .eq('id', lessonId)
    .single();

  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

  const courseId = lesson.modules.course_id;

  // 2. Find Enrollment
  const { data: enrollment } = await supabase
    .from('course_enrollments')
    .select('id')
    .eq('course_id', courseId)
    .eq('student_id', req.user.id)
    .single();

  if (!enrollment) return res.status(403).json({ error: 'Not enrolled in this course' });

  // 3. Upsert Progress
  const { data, error } = await supabase
    .from('lesson_progress')
    .upsert({
      enrollment_id: enrollment.id,
      lesson_id: lessonId,
      is_completed,
      completed_at: is_completed ? new Date() : null
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// --- Student Management Routes (Admin) ---

// List All Students
app.get('/api/students', requireAuth, requireRole(['admin', 'manager', 'instructor']), async (req, res) => {
  const { query } = req.query; // Search query

  let dbQuery = supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student');

  if (query) {
    dbQuery = dbQuery.ilike('full_name', `%${query}%`);
  }

  const { data, error } = await dbQuery;

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Get Single Student (with enrollments)
app.get('/api/students/:id', requireAuth, requireRole(['admin', 'manager', 'instructor']), async (req, res) => {
  const { id } = req.params;

  // Get Profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (profileError) return res.status(404).json({ error: 'Student not found' });

  // Get Enrollments
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('*, courses(title)')
    .eq('student_id', id);

  res.json({ ...profile, enrollments: enrollments || [] });
});

// Admin Force Enroll
app.post('/api/admin/enrollments', requireAuth, requireRole(['admin']), async (req, res) => {
  const { studentId, courseId } = req.body;

  const { data, error } = await supabase
    .from('course_enrollments')
    .insert({
      student_id: studentId,
      course_id: courseId,
      status: 'active'
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// Admin Drop Student
app.delete('/api/admin/enrollments/:enrollmentId', requireAuth, requireRole(['admin']), async (req, res) => {
  const { enrollmentId } = req.params;

  const { error } = await supabase
    .from('course_enrollments')
    .delete()
    .eq('id', enrollmentId);

  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Core Service listening on port ${port}`);
});
