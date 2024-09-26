const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin:`${process.env.FRONTEND_URL}`,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

// Enable CORS for all routes
app.use(cors(corsOptions));

connectDB()

// Initialize HTTP server and Socket.IO with CORS settings
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: `${process.env.FRONTEND_URL}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Listen for Socket.IO connections
io.on('connection', (socket) => {
  console.log('New client connected');

  // Optionally handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// API routes
app.use('/api/events',(req, res, next) => { req.io = io; next(); }, require('./routes/eventRoutes')); 
app.use('/api/users', require('./routes/userRoutes'));

app.use('/test', (req, res) => {
  res.json({ message: "Server is working ..." });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
