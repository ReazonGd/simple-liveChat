const express = require("express");
const BodyParser = require("body-parser");
const app = express();

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// app config
app.use(BodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "views");

// index / root page
app.get("/", (req, res) => {
  res.render("index.ejs", { rooms: avaliableRoom });
});

app.post("/rooms", (req, res) => {
  let name = req.body.name;
  let room = req.body.room;

  connectChat(room);
  res.render("chat.ejs", { name, room });
});

const avaliableRoom = [];
function connectChat(room) {
  if (avaliableRoom.includes(room)) return;
  avaliableRoom.push(room);
  io.on("connection", (socket) => {
    socket.on(room, (data) => {
      socket.broadcast.emit(room, data);
    });
  });
}

server.listen(8000, () => {
  console.log(`server ready`);
});
