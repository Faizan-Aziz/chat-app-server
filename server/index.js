import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import databaseconnection from "./Database/conn.js";
import UserRoutes from './routes/user.js';
import ConversationRoute from './routes/conversation.js';
import MessageRoutes from './routes/message.js';
import dotenv from "dotenv";
import { Server } from "socket.io";  
import http from "http";

const app = express()

// ✅ MOVE CORS MIDDLEWARE UP HERE - BEFORE Socket.io
app.use(cors({
  origin: ["*"],
  credentials: true
}));

app.use(express.json())
app.use(cookieParser())

dotenv.config();
databaseconnection

const server = http.createServer(app)

// Socket.io configuration (this is correct)
const io = new Server(server, {
  cors: {
    origin: ["*"],
    methods: ['GET', 'POST'],
    credentials: true
  }
})

// Your Socket.io event handlers remain the same
io.on('connection', (socket) => {
  console.log("🟢 User connected - Socket ID:", socket.id);
  
  socket.on("joinConversation", conversationId => {
    console.log(`🟢 user joined Conversation ID: ${conversationId}`);
    socket.join(conversationId);
  })

  socket.on("sendMessage", (convID, messageDetail) => {
    console.log("message send", convID, messageDetail); 
    io.to(convID).emit("receiveMessage", messageDetail)
  })

  socket.on("joinUserRoom", (userId) => {
    console.log(`User ${userId} joined their personal room`);
    socket.join(userId);
  });

  socket.on("conversationAdded", (addedUserId, conversationData) => {
    console.log(`Notifying user ${addedUserId} about new conversation`);
    io.to(addedUserId).emit("newConversationAdded", conversationData);
  });

  socket.on('disconnect', () => {
    console.log("user is disconnected"); 
  });
});

// Routes
app.use('/api/auth', UserRoutes);
app.use('/api/conversation', ConversationRoute);
app.use('/api/chat', MessageRoutes)

const port = 8000

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date() })
})

app.get('/', (req, res) => {
  res.send('Hello faizan aziz')
})

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
