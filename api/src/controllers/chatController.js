// Rooms stored in memory: Map<roomName, createdAt>
const rooms = new Map();

/**
 * POST /chat/room
 * Body: { room: string }
 */
const createRoom = (req, res) => {
  const { room } = req.body;

  if (!room || typeof room !== 'string' || room.trim() === '') {
    return res.status(400).json({ message: 'El nombre de la sala es requerido' });
  }

  const roomName = room.trim();

  if (!rooms.has(roomName)) {
    rooms.set(roomName, new Date());
  }

  // Notify all connected clients about the new room
  const io = req.app.get('io');
  if (io) {
    io.emit('chat:created', { roomName });
  }

  return res.status(201).json({ roomName });
};

module.exports = { createRoom };
