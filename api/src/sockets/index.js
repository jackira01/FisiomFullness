/**
 * Registers all Socket.io event handlers.
 * @param {import('socket.io').Server} io
 */
function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`[socket] client connected: ${socket.id}`);

    // User joins a chat room
    socket.on('user:connected', ({ roomName, username }) => {
      if (!roomName) return;
      socket.join(roomName);
      console.log(`[socket] ${username ?? socket.id} joined room "${roomName}"`);
    });

    // User sends a message to a room
    socket.on('message:sended', ({ room, message, sendBy }) => {
      if (!room || !message) return;
      io.to(room).emit('message:new', { message, sendBy });
    });

    socket.on('disconnect', () => {
      console.log(`[socket] client disconnected: ${socket.id}`);
    });
  });
}

module.exports = registerSocketHandlers;
