const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3010;
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
// const io = new Server(server,{
//   cors:{
//     origin: '*',
//     methods: ["GET","POST"],
//   }
// });

// io.on("connection", (socket) => {
//   console.log("a user connected");
//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  // console.log("userConnected", socket.id);

  socket.on("getMessage", (data) => {
    console.log("getting");
    socket.broadcast.emit("receive_msg", { message: "haida" });
  });
  socket.on("disconnect", () => {
    // console.log("user disconnected");
  });
});

// io.on("connection", (socket) => {
//   console.log(" a user been connected");
// });

const attendanceRouter = require("./routes/attendance");

app.use("/ablelyf", attendanceRouter);

server.listen(port, () => {
  console.log(`app ${port} successfully running`);
});
