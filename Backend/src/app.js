import cookieParser from "cookie-parser";
import express from "express"
import authroutes from "./routes/auth.routes.js"
import chatroutes from './routes/chat.routes.js'
import cors from "cors"
const app=express();

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(express.json());
app.use(cookieParser());
 
app.use('/api/auth',authroutes)
app.use('/api/chat',chatroutes)

export default app;