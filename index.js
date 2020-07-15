let app = require("express")();
let http = require("http").Server(app);
let io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

http.listen(3000, () => {
  console.log("Listening on port *: 3000");
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("disconnect");
  });

  socket.on("chat-message", (data) => {
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("typing", (data) => {
    console.log(data);
    // socket.broadcast.emit("typing", data);
  });

  socket.on("stopTyping", (data) => {
    socket.broadcast.emit("stopTyping", data);
  });

  socket.on("joined", (data) => {
    io.emit("connections", 1);
    io.emit("joined", data);
    console.log(data);
  });
});
