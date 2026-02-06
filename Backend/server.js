import dotenv from "dotenv";
import http from "http";
import app from "./src/app.js";
import connectDB from "./src/db/db.js";
import initSocketServer from "./src/sockets/socket.server.js";

dotenv.config({ path: "./.env" });

const httpServer = http.createServer(app);

connectDB();
initSocketServer(httpServer);

httpServer.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running at port:${process.env.PORT}`);
});
