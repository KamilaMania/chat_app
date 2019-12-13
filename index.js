const express = require("express");
const bodyParser = require("body-parser");
const Message = require("./message/model");
const Sse = require("json-sse");

const messageRouterFactory = require("./message/router");

const app = express();

const port = 4000;

const stream = new Sse();
const messageRouter = messageRouterFactory(stream);

app.get("/", (request, response) => {
  stream.send("hi");
  response.send("hello");
});

app.get("/stream", async (request, response, next) => {
  try {
    const messages = await Message.findAll(); //get array of database
    const string = JSON.stringify(messages); //return db- change array to strings

    stream.updateInit(string); // send a string to client ,preparing string to be send to the client
    stream.init(request, response); // connecting user to the stream
  } catch (error) {
    next(error);
  }
});

const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(messageRouter);

app.listen(port, () => {
  console.log(`Listening on :${port}`);
});
