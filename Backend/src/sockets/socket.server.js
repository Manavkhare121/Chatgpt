import { Server, Socket } from "socket.io";

function initSocketServer(httpServer){
    const io=new Server(httpServer,{})
    io.on("connection",(Socket)=>{
        console.log("New Socket Connection:",Socket.id)
    })
}

export default initSocketServer;