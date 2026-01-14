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

app.get('/', (req, res) => {
  res.json({ message: 'LMS Core Service is Running' });
});

// Example: Get Users (Protected)
app.get('/api/users', async (req, res) => {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.listen(port, () => {
  console.log(`Core Service listening on port ${port}`);
});
