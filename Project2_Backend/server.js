// Import packages
const express = require('express')
const cors = require('cors')

// Create the app
const app = express()
const PORT = 3000

// Middleware — tells Express to understand JSON data
app.use(cors())
app.use(express.json())

// Store messages in memory (like a temporary database)
let messages = []

// =====================
// ROUTE 1: GET /
// Welcome message — proves server is alive
// =====================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Zeeshan Portfolio API!',
    version: '1.0.0'
  })
})

// =====================
// ROUTE 2: GET /api/messages
// Returns all submitted messages
// =====================
app.get('/api/messages', (req, res) => {
  res.status(200).json({
    success: true,
    count: messages.length,
    data: messages
  })
})

// =====================
// ROUTE 3: POST /api/messages
// Receives a new contact message
// =====================
app.post('/api/messages', (req, res) => {
  const { name, email, message } = req.body

  // VALIDATION — check if all fields exist
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'All fields are required: name, email, message'
    })
  }

  // VALIDATION — check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid email address'
    })
  }

  // VALIDATION — check message length
  if (message.length < 10) {
    return res.status(400).json({
      success: false,
      error: 'Message must be at least 10 characters'
    })
  }

  // Create new message object
  const newMessage = {
    id: messages.length + 1,
    name: name,
    email: email,
    message: message,
    createdAt: new Date().toISOString()
  }

  // Save to our array
  messages.push(newMessage)

  // Send success response
  res.status(201).json({
    success: true,
    message: 'Message received successfully!',
    data: newMessage
  })
})

// =====================
// ROUTE 4: GET /api/messages/:id
// Get a single message by ID
// =====================
app.get('/api/messages/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const found = messages.find(msg => msg.id === id)

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})