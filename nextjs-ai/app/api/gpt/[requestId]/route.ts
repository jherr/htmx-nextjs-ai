import { NextResponse } from "next/server";

import { getRequest } from "@/app/_lib/request";

export async function GET(
  _req: Request,
  { params: { requestId } }: { params: { requestId: string } }
) {
  const request = getRequest(requestId);
  if (!request) {
    return NextResponse.json(
      {
        error: "Request not found",
      },
      { status: 404 }
    );
  }
  return NextResponse.json(request);
}
