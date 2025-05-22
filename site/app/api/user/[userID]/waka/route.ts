// GET api/user/[userID]/waka
// Returns Wakatime (Hackatime) data.

import { NextResponse, NextRequest } from "next/server";
import { getWakaTimeData } from "@/services/fetchWakaData";
import { auth } from "@/auth";
import { verifyAuth } from "@/services/verifyAuth";
import Airtable from "airtable"
import { encryptSession } from "@/services/hash";
import { verifySession } from "@/services/hash";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);
;

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

// POST api/user/[userID]/waka
// update that a user has set up hackatime
export async function POST(request: NextRequest){

  const session = await auth();
  const emailAddress = session?.user.email;
  try {
    const recordID = await airtable("Registered Users")
      .select({
        filterByFormula: `{email} = "${emailAddress}"`,
        maxRecords: 1,
        fields: ["record_id", "hashed_token", "hackatime_set_up_at"],
      })
      .all();

    const accessTokenEncrypted = encryptSession(
      session!.access_token!,
      process.env.AUTH_SECRET!,
    );
    const prettyRecordID = JSON.parse(JSON.stringify(recordID)); // jank
    if (
      !verifySession(
        prettyRecordID[0]["fields"]["hashed_token"],
        accessTokenEncrypted,
      )
    ) {
      throw "Unauthorized";
    }
    if (!(prettyRecordID[0]["fields"]["hackatime_set_up_at"])){
      const r = await airtable("Registered Users").update([
        {
          id: prettyRecordID[0]["fields"]["record_id"],
          fields: {
            hackatime_set_up_at: String(Date.now()), //jank
          },
        },
      ]);
      console.log(r)
    return NextResponse.json({
      message: "Set Hackatime setup date."
    })
    }
    return NextResponse.json({
      message: "Hackatime was already set."
    })
    } catch (error) {
    return NextResponse.json(
      { message: `Something went wrong: ${error}` },
      { status: 400 },
    );
  }
}
