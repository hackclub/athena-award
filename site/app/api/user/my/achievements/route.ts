// GET api/[userID]/achievements
// Returns a list of achievements the user has unlocked.

import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { getValue } from "@/services/fetchData";
import { verifyAuth } from "@/services/verifyAuth";
import { identifySlackId } from "@/services/adminOverride";

export async function GET(request: NextRequest) {
  const session = await auth();
  const invalidSession = await verifyAuth(request);
  const slackId = (await identifySlackId(request, session!))!

  if (invalidSession) {
    return NextResponse.json(invalidSession, { status: 401 });
  }

  try {
    const response = (await getValue(slackId))["achievements"];
    return NextResponse.json({ message: response }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Something went catastrophically wrong." },
      { status: 400 },
    );
  }
}
