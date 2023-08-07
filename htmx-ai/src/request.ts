import { completeWithChatGPT } from "./openai";

const requests: Record<
  string,
  {
    completion: string;
    pending: boolean;
  }
> = {};

export const getRequest = (requestId) => {
  return requests[requestId];
};

export const startRequest = async (prompt: string) => {
  const requestId = Math.random().toString(36).substring(2, 15);
  requests[requestId] = {
    completion: "",
    pending: true,
  };

  completeWithChatGPT(
    `Funny story about a ${prompt}`,
    (text) => {
      requests[requestId].completion = text;
    },
    () => {
      requests[requestId].pending = false;
    }
  );

  return requestId;
};
