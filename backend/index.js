require("dotenv").config();
const connectToMongo = require("./db/db");
const express = require('express');
const path = require('path');
const cors = require('cors');

connectToMongo();

const app = express();
const port = process.env.PORT || 5001;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

// ── Static uploads ────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/auth', require("./routes/auth"));

// ── Root Endpoint ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: "Saanjh Matrimony API is running perfectly!" });
});

// ── Socket.IO ────────────────────────────────────────────────────────────────
const http = require('http');
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});

// ── Anti-Cheat Security Filter ────────────────────────────────────────────────
const antiCheatFilter = (text) => {
  if (!text) return text;
  let safeText = text.replace(/(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}|(\d{3}[-\.\s]\d{3}[-\.\s]\d{4})|\d{10}/gi, "[CONTACT BLOCKED]");
  safeText = safeText.replace(/([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/gi, "[EMAIL BLOCKED]");
  safeText = safeText.replace(/@([a-zA-Z0-9_]{3,})/gi, "[ID BLOCKED]");
  safeText = safeText.replace(/(whatsapp|insta|instagram|snapchat|telegram|fb|facebook)/gi, "[APP HIDDEN]");
  return safeText;
};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    socket.join(data);
  });

  socket.on('send_message', (data) => {
    data.message = antiCheatFilter(data.message);
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Saanjh Matrimony server running on port ${port}`);
});
