import cookieParser from "cookie-parser";
import express from "express"
import authroutes from "./routes/auth.routes.js"
import chatroutes from './routes/chat.routes.js'
const app=express();

app.use(express.json());
app.use(cookieParser());
 
app.use('/api/auth',authroutes)
app.use('/api/chat',chatroutes)

export default app;