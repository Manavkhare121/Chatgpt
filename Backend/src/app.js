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

// whitelist origins for CORS (include local dev and deployed frontend origins)
const whitelist = [
  "http://localhost:5173",
  "http://localhost:8000",
  "https://chatgpt-04z4.onrender.com",
  "https://chatgpt-1-4oi8.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (whitelist.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
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
