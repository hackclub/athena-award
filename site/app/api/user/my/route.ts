// GET api/user/my
// Returns information about a user
// tbh what even is going on here

import Airtable from "airtable";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getValue } from "@/services/fetchData";
import { verifyAuth } from "@/services/verifyAuth";

const validData = ["track", "current_stage", "slack_id", "total_time_approved_projects", "referred_users_count"]; // this is really stupid
interface validData {
  track: string,
  current_stage: string;
  slack_id: string;
  total_time_approved_projects: number;
  referred_users_count: number;
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  const session = await auth();
  const emailAddress = session!.user.email!;
  const invalidSession = await verifyAuth();
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
    const response = (await getValue(emailAddress))[query as keyof validData];
    return NextResponse.json({ message: response }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 400 },
    );
  }
}
