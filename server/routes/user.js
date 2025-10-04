import express from "express";
import {register} from "../controller/user.js"
import { login } from "../controller/user.js";
import { searchmember} from "../controller/user.js";
import {Logout} from "../controller/user.js";
import auth from "../middleware/auth.js";


const router = express.Router();

router.post('/register', register)

router.post('/login' , login)

router.get('/serachedMember' ,auth, searchmember)

router.post('/logout' ,auth, Logout)

export default router;
