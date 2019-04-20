const sls = require("serverless-http");

const server = require("./server");

module.exports.server = sls(server);
