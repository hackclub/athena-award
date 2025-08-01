// GET api/user/my
// Returns information about a user
// tbh what even is going on here

import Airtable from "airtable";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getValue } from "@/services/fetchData";
import { verifyAuth } from "@/services/verifyAuth";
import { identifySlackId } from "@/services/adminOverride";

const validData = ["track", "current_stage", "total_time_approved_projects", "referred_users_count", "ordered_travel_stipend_money"]; // this is really stupid
interface validData {
  track: string,
  current_stage: string;
  total_time_approved_projects: number;
  referred_users_count: number;
  ordered_travel_stipend_money: number;
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  const session = await auth();
  const slackId = (await identifySlackId(request, session!))!
  const invalidSession = await verifyAuth(request);
  if (invalidSession) {
    return NextResponse.json(invalidSession, { status: 401 });
  }
  if (query === "verification"){
    const response = await fetch(`https://identity.hackclub.com/api/external/check?slack_id=${session?.slack_id}`).then(r => r.json())
    return NextResponse.json(response)
  }
  if (!query || !validData.includes(query)) {
    // this is stupid
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  try {
    const response = (await getValue(slackId))[query as keyof validData];
    return NextResponse.json({ message: response }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 400 },
    );
  }
}
