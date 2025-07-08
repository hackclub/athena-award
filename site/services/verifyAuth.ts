"use server";
import { auth } from "@/auth";
import { NextRequest } from "next/server";
export async function verifyAuth(request: NextRequest) {
  const session = await auth();
  const authorization = request.headers.get("Authorization")!;
  if (
    !authorization ||
    authorization.split(" ")[1] == process.env.REFRESH_API_KEY
  ) {
    return
  }
  if (!session) {
    return { error: "Unauthed" };
  }
}
