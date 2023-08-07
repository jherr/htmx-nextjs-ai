"use client";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("dog");
  const [result, setResult] = useState("");
  const [running, setRunning] = useState(false);

  const onSubmit = async () => {
    setRunning(true);

    // Start the request
    const requestIdReq = await fetch("/api/gpt", {
      method: "POST",
      cache: "no-cache",
      body: JSON.stringify({ prompt }),
    });
    const requestId = await requestIdReq.json();

    // Poll the requestID until it's done
    const interval = setInterval(async () => {
      const resultReq = await fetch(`/api/gpt/${requestId}`, {
        cache: "no-cache",
      });
      if (!resultReq.ok) {
        console.error(resultReq.statusText);
        clearInterval(interval);
        setRunning(false);
        return;
      }
      const result = (await resultReq.json()) as {
        completion: string;
        pending: boolean;
      };
      if (result) {
        setResult(result.completion);
        if (!result.pending) {
          setRunning(false);
          clearInterval(interval);
        }
      }
    }, 100);
  };

  return (
    <>
      <form className="flex gap-2 items-center">
        <div className="whitespace-nowrap">Funny story about a</div>
        <input
          type="text"
          name="prompt"
          placeholder="Prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="border border-gray-400 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          disabled={running}
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-xl"
          onClick={onSubmit}
        >
          Submit
        </button>
      </form>
      <div className="p-5 border-2 border-gray-400 rounded-2xl mt-5">
        {result}
      </div>
    </>
  );
}
