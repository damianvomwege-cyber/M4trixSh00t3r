// M4trix Sh00t3r - Multiplayer Server
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store active lobbies
const lobbies = new Map();

// Generate 6-character lobby code
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);
  
  // Create a new lobby
  socket.on('create_lobby', () => {
    let code = generateCode();
    // Ensure unique code
    while (lobbies.has(code)) {
      code = generateCode();
    }
    
    const lobby = {
      code,
      host: socket.id,
      guest: null,
      gameStarted: false
    };
    
    lobbies.set(code, lobby);
    socket.join(code);
    socket.lobbyCode = code;
    socket.isHost = true;
    
    console.log(`Lobby created: ${code} by ${socket.id}`);
    socket.emit('lobby_created', { code });
  });
  
  // Join an existing lobby
  socket.on('join_lobby', ({ code }) => {
    const lobby = lobbies.get(code.toUpperCase());
    
    if (!lobby) {
      socket.emit('join_error', { message: 'Lobby nicht gefunden!' });
      return;
    }
    
    if (lobby.guest) {
      socket.emit('join_error', { message: 'Lobby ist voll!' });
      return;
    }
    
    lobby.guest = socket.id;
    socket.join(code);
    socket.lobbyCode = code;
    socket.isHost = false;
    
    console.log(`Player ${socket.id} joined lobby ${code}`);
    
    // Notify both players
    socket.emit('joined_lobby', { code });
    io.to(lobby.host).emit('guest_joined', { guestId: socket.id });
  });
  
  // Start the game
  socket.on('start_game', () => {
    const lobby = lobbies.get(socket.lobbyCode);
    if (lobby && socket.isHost && lobby.guest) {
      lobby.gameStarted = true;
      console.log(`Game started in lobby ${socket.lobbyCode}`);
      io.to(socket.lobbyCode).emit('game_start');
    }
  });
  
  // Player position update
  socket.on('player_update', (data) => {
    if (socket.lobbyCode) {
      socket.to(socket.lobbyCode).emit('player_update', {
        ...data,
        playerId: socket.id,
        isHost: socket.isHost
      });
    }
  });
  
  // Bullet fired
  socket.on('bullet_fired', (data) => {
    if (socket.lobbyCode) {
      socket.to(socket.lobbyCode).emit('bullet_fired', {
        ...data,
        isHost: socket.isHost
      });
    }
  });
  
  // Game state sync (from host to guest)
  socket.on('game_state', (data) => {
    if (socket.lobbyCode && socket.isHost) {
      socket.to(socket.lobbyCode).emit('game_state', data);
    }
  });
  
  // Enemy killed
  socket.on('enemy_killed', (data) => {
    if (socket.lobbyCode) {
      socket.to(socket.lobbyCode).emit('enemy_killed', data);
    }
  });
  
  // Powerup collected
  socket.on('powerup_collected', (data) => {
    if (socket.lobbyCode) {
      socket.to(socket.lobbyCode).emit('powerup_collected', data);
    }
  });
  
  // Leave lobby
  socket.on('leave_lobby', () => {
    handleLeave(socket);
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    handleLeave(socket);
  });
});

function handleLeave(socket) {
  if (socket.lobbyCode) {
    const lobby = lobbies.get(socket.lobbyCode);
    if (lobby) {
      // Notify other player
      socket.to(socket.lobbyCode).emit('player_disconnected', {
        isHost: socket.isHost
      });
      
      // If host leaves, destroy lobby
      if (socket.isHost) {
        lobbies.delete(socket.lobbyCode);
        console.log(`Lobby ${socket.lobbyCode} destroyed (host left)`);
      } else {
        // Guest left
        lobby.guest = null;
        console.log(`Guest left lobby ${socket.lobbyCode}`);
      }
    }
    socket.leave(socket.lobbyCode);
  }
}

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'online', 
    lobbies: lobbies.size,
    players: io.engine.clientsCount
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎮 M4trix Sh00t3r Server running on port ${PORT}`);
});
