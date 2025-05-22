// GET api/user/[userID]/points
// Returns a percentage value of the user's progress towards the Athena Award

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getValue } from "@/services/fetchData";
import { verifyAuth } from "@/services/verifyAuth";

export async function GET(request: Request) {
  const session = await auth();
  const invalidSession = await verifyAuth();
  if (invalidSession) {
    return NextResponse.json(invalidSession, { status: 401 });
  }

  try {
    const response = (await getValue(session!.user.email!))["points"];
    return NextResponse.json({ message: response }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Something went catastrophically wrong." },
      { status: 400 },
    );
  }
}
