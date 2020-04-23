const express = require("express");

const server = express();

const userRouter = require("./data/users/users-router");

server.use(express.json());

server.use("/api/users", userRouter);

server.get("/", (req, res) => {
  res.status(200).json({ hello: "world" });
});

module.exports = server;
