const express = require("express");
const bodyParser = require("body-parser");
const xss = require("xss");

const { completeWithChatGPT } = require("./openai");

const app = express();

app.use(express.static("public"));

const port = process.env.PORT || 3000;

app.get("/request", (req, res) => {
  res.header("Cache-Control", "no-cache");
  res.header("Content-Type", "text/event-stream");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Connection", "keep-alive");
  res.flushHeaders();

  completeWithChatGPT(
    `Funny story about a ${req.query.prompt}`,
    (message) => {
      res.write(`data: <div>${xss(message)}</div>\n\n`);
    },
    () => {}
  );

  res.on("close", () => {
    res.end();
  });
});

app.post(
  "/prompt",
  bodyParser.urlencoded({ extended: false }),
  async (req, res) => {
    res.write(`<div
  hx-ext="sse"
  sse-connect="/request?prompt=${encodeURIComponent(req.body.prompt)}"
  sse-swap="message"
  class="italic"
></div>`);
    res.end();
  }
);

app.listen(port, () =>
  console.log(`Listening on port http://localhost:${port}`)
);
