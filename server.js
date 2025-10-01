const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
let users = {};
io.on('connection', (socket) => {
  console.log('New user connected');
  socket.on('join', (username) => {
    users[socket.id] = username;
    socket.broadcast.emit('message', {
      user: 'Server',
      text: `${username} has joined the chat` // be the loudest in the room
    });
    io.emit('userList', Object.values(users));
  });
  socket.on('sendMessage', (message) => {
    io.emit('message', {
      user: users[socket.id],
      text: message
    });
  });
  socket.on('disconnect', () => {
    const username = users[socket.id];
    if (username) {
      delete users[socket.id];
      socket.broadcast.emit('message', {
        user: 'Server',
        text: `${username} has left the chat`
      });
      io.emit('userList', Object.values(users));
    }
  });
});
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});