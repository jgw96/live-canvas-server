"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const app = express();
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(cors());
// simple '/' endpoint sending a Hello World
// response
app.get("/", (req, res) => {
    res.send("hello world");
});
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:8001",
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {
    console.log("a user connected");
    const room = socket.handshake["query"]["r_var"];
    socket.join(room);
    socket.on("drawing", (data) => {
        socket.broadcast.to(room).emit("drawing", data);
    });
    // start our simple server up on localhost:3000
});
httpServer.listen(process.env.PORT || 3000, () => {
    console.log("listening on *:3000");
});
//# sourceMappingURL=server.js.map