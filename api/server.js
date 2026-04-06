require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const { app } = require('./src/app');
const { optionCors } = require('./src/config/corsConfig');
const registerSocketHandlers = require('./src/sockets');

const port = process.env.PORT || 3000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: optionCors.origin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Pass io to controllers that need it (questions, chat)
app.set('io', io);

registerSocketHandlers(io);

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
