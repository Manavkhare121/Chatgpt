import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { usermodel } from "../models/user.model.js";
import { generateResponse, generateVectors } from "../services/ai.service.js";
import { messageModel } from "../models/message.model.js";
import { createMemory, queryMemory } from "../services/vector.service.js";
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

      const message = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: messagePayload.content,
        role: "User",
      });

      const vectors = await generateVectors(messagePayload.content);
      console.log("vector generated", vectors);

      const memory = await queryMemory({
        queryVector: vectors,
        limit: 3,
        metadata: {user:socket.user._id},
      });
      console.log("Memory matches", memory);

      //user longterm memory is stored in this
      await createMemory({
        vectors,
        messageId: message._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: messagePayload.content,
        },
      });

      const chathistory = (
        await messageModel
          .find({ chat: messagePayload.chat })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean()
      ).reverse();

      // console.log(
      //   "chathistory",
      //   chathistory.map((item) => {
      //     return { role: item.role, parts: [{ text: item.content }] };
      //   }),
      // );
      const stm = chathistory.map((item) => {
        return { role: item.role, parts: [{ text: item.content }] };
      });

      const ltm = [
        {
          role: "user", //it is not user and model system is as thing that i used to show the context to the ai like pahele kya baat hui thi and all
          parts: [
            {
              text: `
            these are some previous messages from the chat, use them to generate a response

                        ${memory.map((item) => item.metadata.text).join("\n")}`,
            },
          ],
        },
      ];

     console.log(ltm[0]);
     console.log(stm);

      const response = await generateResponse([...ltm ,...stm]);

      const responseMessage = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: response,
        role: "model",
      });

      const reponseVectors = await generateVectors(response);

      await createMemory({
        vectors: reponseVectors,
        messageId: responseMessage._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: response,
        },
      });

      socket.emit("ai-response", {
        content: response,
        chat: messagePayload.chat,
      });
    });
  });
}

export default initSocketServer;
