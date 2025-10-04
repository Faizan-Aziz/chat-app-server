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
import { Socket } from "dgram";
import conversation from "./models/conversation.js";


const app = express()

const server=http.createServer(app) 

const io= new Server(server,{
  cors:{
     origin: ['http://localhost:5173', 'https://localhost:5173' , 'http://192.168.0.106:5173' , "https://chat-app-frontend-black-eight.vercel.app"],
     methods:['GET' , 'POST'],
    credentials: true
  }
})

app.use(express.json())  //  to automatically convert the JSON data string which is recived from frontend covert into a convenient JavaScript object that your server can use so that we can acsee request.body  other wise it is indefined
app.use(cookieParser())


dotenv.config();         // ✅ Load environment variables BEFORE using them
databaseconnection       //database used we used


io.on('connection', (socket) => {
  console.log("🟢 User connected - Socket ID:", socket.id);
  console.log("🟢 Headers:", socket.handshake.headers);
  console.log("🟢 Origin:", socket.handshake.headers.origin);

  socket.on("joinConversation", conversationId => {
    console.log(`🟢 user joined Conversation ID: ${conversationId}`);
    console.log(`🟢 From origin: ${socket.handshake.headers.origin}`);
    console.log(`🟢 Socket ID: ${socket.id}`);
    socket.join(conversationId);
  })

  socket.on("sendMessage",(convID,messageDetail)=>{
    console.log("message send" , convID, messageDetail); 
    io.to(convID).emit("receiveMessage",messageDetail)   //that info go in the room of its created ID

  })

 // Join user to their personal room
  socket.on("joinUserRoom", (userId) => {
    console.log(`User ${userId} joined their personal room`);
    socket.join(userId);
  });

  // ✅ NEW: Emit when someone adds a conversation
  socket.on("conversationAdded", (addedUserId, conversationData) => {
    console.log(`Notifying user ${addedUserId} about new conversation`);
    io.to(addedUserId).emit("newConversationAdded", conversationData);
  });
  

  socket.on('disconnect', () => {
    console.log("user is disconnected"); 
  });
});

app.use(cors({
  origin: ['http://localhost:5173', 'https://localhost:5173' ,  'http://192.168.0.106:5173' , "https://chat-app-frontend-black-eight.vercel.app"], // 🛡️ ONLY this frontend can access
  credentials: true // ✅ Allow cookies/auth
}));


app.use('/api/auth', UserRoutes);
app.use('/api/conversation' , ConversationRoute);
app.use('/api/chat' , MessageRoutes)



const port = 8000

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date() })
})


app.get('/', (req, res) => {
  res.send('Hello faizan aziz')
})



server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



