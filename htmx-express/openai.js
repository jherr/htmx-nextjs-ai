const https = require("node:https");

const completeWithChatGPT = (
  prompt,
  tokenCallback,
  endCallback,
  options = {}
) => {
  let text = "";
  const req = https.request(
    {
      hostname: "api.openai.com",
      port: 443,
      path: "/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    },
    function (res) {
      res.on("data", (chunks) => {
        for (const chunk of chunks.toString().split("\n")) {
          if (chunk.toString().startsWith("data: ")) {
            const data = chunk.toString().replace(/^data: /, "");
            try {
              const content = JSON.parse(data)?.choices?.[0]?.delta?.content;
              if (content) {
                text += content;
                tokenCallback(text);
              }
            } catch (e) {}
          }
        }
      });
      res.on("end", endCallback);
    }
  );

  const body = JSON.stringify({
    model: "gpt-3.5-turbo",
    max_tokens: 200,
    temperature: 0.5,
    n: 1,
    stop: ["\n"],
    stream: true,
    ...options,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  req.on("error", (e) => {
    console.error("problem with request:" + e.message);
  });

  req.write(body);
  req.end();
};

module.exports = {
  completeWithChatGPT,
};
