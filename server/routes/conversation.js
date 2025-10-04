import express from "express";
import auth from "../middleware/auth.js";
import {addconversation} from '../controller/conversation.js'
import { getconversation } from "../controller/conversation.js";

const router = express.Router();

router.post('/add-conversation' , auth , addconversation)

router.get('/get-conversation' , auth , getconversation)

export default router;
