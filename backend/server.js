const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require('./database');
const authRoutes = require('./routes/auth');
const metalRoutes = require('./routes/metals');
const newsRoutes = require('./routes/news');
const favoriteRoutes = require('./routes/favorites');
const inquiryRoutes = require('./routes/inquiries');
const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');
const priceFetcher = require('./services/priceFetcher');
const emailService = require('./services/emailService');

app.use('/api/auth', authRoutes);
app.use('/api/metals', metalRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

io.on('connection', (socket) => {
  console.log('用户连接:', socket.id);

  socket.on('join_session', (sessionCode) => {
    socket.join(sessionCode);
  });

  socket.on('send_message', (data) => {
    io.to(data.sessionCode).emit('new_message', {
      senderType: data.senderType,
      content: data.content,
      createdAt: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('用户断开连接:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  priceFetcher.start();
});

module.exports = { io };
