let app = require("express")();
let http = require("http").Server(app);
let io = require("socket.io")(http);
const rooms = {};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

http.listen(3000, () => {
  console.log("Listening on port *: 3000");
});

io.on("connection", (socket) => {
  console.log("connection");
  socket.on("disconnect", () => {
    console.log("disconnect");
  });

  socket.on("chat-message", (data) => {
    io.in(data.room).emit("chat-message", data);
    console.log("chat-message: ", data);
  });

  socket.on("typing", (data) => {
    console.log("typing: ", data);
    io.in(data.room).emit("typing", data);
  });

  socket.on("stopTyping", (data) => {
    console.log("typing: ", data);
    io.in(data.room).emit("typing", data);
  });

  socket.on("leave", (data) => {
    console.log("leave: ", data);
    if (rooms[data.room]) {
      rooms[data.room] = rooms[data.room].filter((user) => user.id !== data.id);
    }
    socket.broadcast.emit("leave", rooms[data.room]);
  });

  socket.on("create_room", (data) => {
    socket.join(data.room);
    console.log("create_room: ", data);
    // io.to(data.room).emit("create_room", data);
  });

  socket.on("joined", (data) => {
    if (!rooms[data.room]) {
      rooms[data.room] = [];
    }
    rooms[data.room].push(data);
    console.log("joined: ", data);
    socket.join(data.room);
    io.in(data.room).emit("joined", rooms[data.room]);

    io.in(data.room).emit(
      "connections",
      io.sockets.adapter.rooms[data.room].length
    );
  });

  socket.on("errors-message", (data) => {
    console.log(data);
    io.in(data.room).emit("errors-message", { color: "red" });
  });
});
