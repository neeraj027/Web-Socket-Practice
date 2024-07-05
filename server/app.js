import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const PORT = 3000;

const app = express();
const server = new createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello");
});

io.on("connection", (socket) => {
  console.log("Connected: ", socket.id);

  socket.emit("welcome", `welcome to socket ${socket.id}`);

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });

  socket.on("message", ({ msg, room = 0 }) => {
    console.log(msg);
    room
      ? socket.to(room).emit("receive-msg", msg)
      : io.emit("receive-msg", msg);
  });
});

server.listen(PORT, () => {
  console.log("Listening");
});
