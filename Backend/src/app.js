import cookieParser from "cookie-parser";
import express from "express";
import authroutes from "./routes/auth.routes.js";
import chatroutes from "./routes/chat.routes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://chatgpt-1-4oi8.onrender.com",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/auth", authroutes);
app.use("/api/chat", chatroutes);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

export default app;
