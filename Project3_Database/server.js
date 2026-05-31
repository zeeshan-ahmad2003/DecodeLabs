// Import packages
const express = require('express')
const cors = require('cors')
const Database = require('better-sqlite3')

// Create the app
const app = express()
const PORT = 3000

// Middleware
app.use(cors())
app.use(express.json())

// =====================
// DATABASE SETUP
// This creates messages.db file automatically
// =====================
const db = new Database('messages.db')

// Create the messages table
// IF NOT EXISTS means it won't crash if you restart the server
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT    NOT NULL,
    email     TEXT    NOT NULL,
    message   TEXT    NOT NULL,
    createdAt TEXT    NOT NULL
  )
`)

console.log('✅ Database connected: messages.db')

// =====================
// ROUTE 1: GET /
// Just a welcome message
// =====================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Zeeshan Portfolio API v2.0 - Now with Database!'
  })
})

// =====================
// ROUTE 2: GET /api/messages
// READ all messages from database
// =====================
app.get('/api/messages', (req, res) => {
  const messages = db.prepare('SELECT * FROM messages').all()

  res.status(200).json({
    success: true,
    count: messages.length,
    data: messages
  })
})

// =====================
// ROUTE 3: POST /api/messages
// CREATE - Save new message to database
// =====================
app.post('/api/messages', (req, res) => {
  const { name, email, message } = req.body

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'All fields are required: name, email, message'
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid email address'
    })
  }

  if (message.length < 10) {
    return res.status(400).json({
      success: false,
      error: 'Message must be at least 10 characters'
    })
  }

  // INSERT into database (parameterized query - safe from SQL injection!)
  const stmt = db.prepare(
    'INSERT INTO messages (name, email, message, createdAt) VALUES (?, ?, ?, ?)'
  )
  const result = stmt.run(name, email, message, new Date().toISOString())

  // Fetch the newly saved message to return it
  const newMessage = db.prepare('SELECT * FROM messages WHERE id = ?').get(result.lastInsertRowid)

  res.status(201).json({
    success: true,
    message: 'Message saved to database!',
    data: newMessage
  })
})

// =====================
// ROUTE 4: GET /api/messages/:id
// READ one message by ID
// =====================
app.get('/api/messages/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const found = db.prepare('SELECT * FROM messages WHERE id = ?').get(id)

  if (!found) {
    return res.status(404).json({
      success: false,
      error: `Message with id ${id} not found`
    })
  }

  res.status(200).json({
    success: true,
    data: found
  })
})

// =====================
// ROUTE 5: DELETE /api/messages/:id
// DELETE a message from database
// =====================
app.delete('/api/messages/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const found = db.prepare('SELECT * FROM messages WHERE id = ?').get(id)

  if (!found) {
    return res.status(404).json({
      success: false,
      error: `Message with id ${id} not found`
    })
  }

  db.prepare('DELETE FROM messages WHERE id = ?').run(id)

  res.status(200).json({
    success: true,
    message: `Message ${id} deleted from database`
  })
})

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
// =====================
// ROUTE 6: PUT /api/messages/:id
// UPDATE a message in database
// =====================
app.put('/api/messages/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const { name, email, message } = req.body

  const found = db.prepare('SELECT * FROM messages WHERE id = ?').get(id)

  if (!found) {
    return res.status(404).json({
      success: false,
      error: `Message with id ${id} not found`
    })
  }

  db.prepare(
    'UPDATE messages SET name = ?, email = ?, message = ? WHERE id = ?'
  ).run(name, email, message, id)

  const updated = db.prepare('SELECT * FROM messages WHERE id = ?').get(id)

  res.status(200).json({
    success: true,
    message: 'Message updated in database!',
    data: updated
  })
})