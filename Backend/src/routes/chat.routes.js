import { Router } from "express";
import { authmiddleware } from "../middlewares/auth.middleware.js";
import { createchat,getMessages,getChats} from "../controllers/chat.controller.js";
const router=Router();

router.post("/",authmiddleware,createchat)
router.get('/', authmiddleware,getChats)


/* GET /api/chat/messages/:id */
router.get('/messages/:id', authmiddleware, getMessages)

export default router;