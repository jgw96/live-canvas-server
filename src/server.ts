import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
app.set("port", process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(cors());

// simple '/' endpoint sending a Hello World
// response
app.get("/", (req: any, res: any) => {
  res.send("hello world");
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8001",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: any) => {
  console.log("a user connected");

  const room = socket.handshake["query"]["r_var"];
  socket.join(room);

  socket.on("drawing", (data: any) => {
    socket.broadcast.to(room).emit("drawing", data);
  });

  // start our simple server up on localhost:3000
});

httpServer.listen(process.env.PORT || 3000, () => {
  console.log("listening on *:3000");
});
