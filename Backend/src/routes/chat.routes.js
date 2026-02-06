import { Router } from "express";
import { authmiddleware } from "../middlewares/auth.middleware.js";
import { createchat } from "../controllers/chat.controller.js";
const router=Router();

router.post("/",authmiddleware,createchat)

export default router;