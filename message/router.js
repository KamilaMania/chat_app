const express = require("express");
const Message = require("./model");

const { Router } = express;
function factory(stream) {
  const router = new Router();

  router.get("/message", async (request, response, next) => {
    try {
      const messages = await Message.findAll();
      response.send(messages);
    } catch (error) {
      next(error);
    }
  });

  router.post("/message", async (request, response, next) => {
    try {
      console.log("req body is -----> ", request.body);

      const message = await Message.create(request.body);
      const string = JSON.stringify(message);
      stream.send(string);

      response.send(message);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = factory;
