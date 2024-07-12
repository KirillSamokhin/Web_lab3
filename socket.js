import {Server} from "socket.io"
// let Server = require("socket.io")

let io;

export function initIo(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:4200',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
            socket.disconnect();
        });
    });
}

export function getIo() {
    return io;
}