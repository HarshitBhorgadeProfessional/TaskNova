const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/error');

// Load env vars
dotenv.config();

// Connect to database
connectDB().then(async () => {
  // Retroactively verify existing users so they don't get locked out
  const User = require('./models/User');
  try {
    await User.updateMany(
      { isVerified: { $exists: false } },
      { $set: { isVerified: true } }
    );
    await User.updateMany(
      { isVerified: false, signupOtp: { $exists: false } },
      { $set: { isVerified: true } }
    );
    console.log('Existing users verified retroactively.');
  } catch (err) {
    console.error('Error verifying existing users:', err);
  }
});

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Make uploads folder static
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/upload', require('./routes/uploads'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/notifications', require('./routes/notifications'));

app.get('/', (req, res) => {
  res.send('TaskNova API is running...');
});

// Custom Error Handler
app.use(errorHandler);

const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Make io accessible to our router
app.set('io', io);

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('sendMessage', async (messageData) => {
    try {
      const Message = require('./models/Message');
      const newMessage = await Message.create({
        sender: messageData.senderId,
        text: messageData.text
      });
      const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'name avatar role');
      io.emit('newMessage', populatedMessage);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
