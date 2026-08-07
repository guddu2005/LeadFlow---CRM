const jwt = require("jsonwebtoken");

let io;

const initSocket = (server) => {
    io = require("socket.io")(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token || socket.handshake.query?.token;
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                socket.userId = decoded._id || decoded.id;
            }
            next();
        } catch (error) {
            // Non-blocking socket auth for seamless client connection
            next();
        }
    });

    io.on("connection", (socket) => {
        if (socket.userId) {
            socket.join(socket.userId.toString());
        }
        socket.join("global");

        socket.on("disconnect", () => {
            // Client disconnected
        });
    });
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};

module.exports = {
    initSocket,
    getIO
};