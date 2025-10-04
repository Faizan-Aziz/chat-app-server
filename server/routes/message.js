import express from "express";
import auth from "../middleware/auth.js";
import { sendMessage } from "../controller/message.js";
import { getMessage } from "../controller/message.js";


const router = express.Router();

router.post('/post-message-chat' , auth, sendMessage)

router.get('/get-message-chat/:convId' , auth, getMessage )



export default router;