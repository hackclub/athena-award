// GET api/user/[userID]/points
// Returns a numeric value of the points a user has

import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { getValue } from "@/services/fetchData";
import { verifyAuth } from "@/services/verifyAuth";
import { identifyEmail } from "@/services/adminOverride";

export async function GET(request: NextRequest) {
  const session = await auth();
  const email = (await identifyEmail(request, session!))!
  const invalidSession = await verifyAuth(request);
  if (invalidSession) {
    return NextResponse.json(invalidSession, { status: 401 });
  }

  try {
    const response = (await getValue(email))["artifacts"];
    return NextResponse.json({ message: response }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Something went catastrophically wrong." },
      { status: 400 },
    );
  }
}
