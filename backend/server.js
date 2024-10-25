import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
app.use(express.json());

// Secure CORS configuration
app.use(cors({
  origin: 'http://20.167.41.148:80/',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Use prepared statements to prevent SQL injection
const connection = new sqlite3.Database('./db/aplikasi.db');

// Secure user endpoint with prepared statement
app.get('/api/user/:id', (req, res) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  connection.all(query, [req.params.id], (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});

// Secure email update endpoint with prepared statement
app.post('/api/user/:id/change-email', (req, res) => {
  const newEmail = req.body.email;
  const userId = req.params.id;
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const query = 'UPDATE users SET email = ? WHERE id = ?';
  connection.run(query, [newEmail, userId], function(err) {
    if (err) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'Email updated successfully' });
  });
});

// Secure file access endpoint
app.get('/api/file', (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  // Sanitize and validate file path
  const fileName = req.query.name;
  const sanitizedFileName = path.normalize(fileName).replace(/^(\.\.(\/|\\|$))+/, '');
  const filePath = path.join(__dirname, 'files', sanitizedFileName);
  
  // Verify the file path is within the allowed directory
  const filesDir = path.join(__dirname, 'files');
  if (!filePath.startsWith(filesDir)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('File error:', err);
      res.status(404).json({ error: 'File not found' });
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Disable TCP timestamps in production
if (process.env.NODE_ENV === 'production') {
  require('net').createServer().unref();
}

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
