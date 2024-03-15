const WebSocket = require("ws");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const wss = new WebSocket.Server({ port: process.env.PORT || 3008 });
const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://ganeshyadharth:AbleLyf@students.jbrazv2.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const { Server, Socket } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
  },
});

// io.on("connection", (socket) => {
//   console.log("userConnected", socket.id);

//   socket.on("getMessage", (data) => {
//     console.log("getting");
//     socket.broadcast.emit("receive_msg", { message: "haida" });
//   });
//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });

async function startChangeStream() {
  await client.connect();
  const db = client.db("AbleLyf");

  const changeStream = await db.collection("candidates").watch();
  console.log("there was change");
  changeStream.on("change", async (change) => {
    io.on("connection", (socket) => {
      console.log("userConnected", socket.id);
      socket.emit("testing", {
        name: "testing",
      });

      // socket.on("getMessage", (data) => {
      //   console.log("getting");
      //   socket.broadcast.emit("receive_msg", { message: "haida" });
      // });
    });

    // await wss.clients.forEach(async (client) => {
    //   if (client.readyState === WebSocket.OPEN) {
    //     console.log("so socket working??");
    //     console.log(JSON.stringify(change));
    //     await client.send(JSON.stringify(change));
    //   }
    // });
  });
}

module.exports = {
  startChangeStream,
};
