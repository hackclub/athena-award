// GET api/user/[userID]/waka
// Returns Wakatime (Hackatime) data.

import { NextResponse, NextRequest } from "next/server";
import { getWakaTimeData } from "@/services/fetchWakaData";
import { auth } from "@/auth";
import { verifyAuth } from "@/services/verifyAuth";

export async function GET(request: NextRequest) {
  const session = await auth();

  const invalidSession = await verifyAuth();
  if (invalidSession) {
    return NextResponse.json(invalidSession, { status: 401 });
  }

  let response;
  try {
    response = await getWakaTimeData(session?.slack_id!);
    if (response!.status === 200) {
      return NextResponse.json(await response!.json()); //argh
    } else {
      return NextResponse.json(
        { error: "User is not authed." },
        { status: 403 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Something went catastrophically wrong." },
      { status: 400 },
    );
  }
}
