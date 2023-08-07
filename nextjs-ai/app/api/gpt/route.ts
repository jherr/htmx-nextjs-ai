import { NextResponse } from "next/server";

import { startRequest } from "@/app/_lib/request";

export async function POST(req: Request) {
  const body = await req.json();
  const { prompt } = body;
  const requestId = await startRequest(prompt);
  return NextResponse.json(requestId);
}
