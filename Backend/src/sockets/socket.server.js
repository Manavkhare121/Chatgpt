import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { usermodel } from "../models/user.model.js";
import { generateResponse } from "../services/ai.service.js";

function initSocketServer(httpServer) {
    const io = new Server(httpServer, {});

    // Socket.io auth middleware
    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

        if (!cookies.token) {
            return next(new Error("Authentication error: No token Provided"));
        }

        try {
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
            const user = await usermodel.findById(decoded.id);
            socket.user = user;
            next();
        } catch (error) {
            next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log("New socket connection:", socket.id);

        socket.on("ai-message", async (messagePayload) => {
            console.log(messagePayload);

            const response = await generateResponse(messagePayload.message);

            socket.emit("ai-response", {
                content: response,
                chat: messagePayload.chat,
            });
        });
    });
}

export default initSocketServer;
