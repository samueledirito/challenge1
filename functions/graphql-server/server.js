const express = require("express");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();

server.get("/", (req, res) => res.json({hello: "world"}));
server.get("*", (req, res) => handle(req, res));

module.exports = server;
