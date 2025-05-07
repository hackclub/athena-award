// POST /api/user/[userID]/track
// Updates what track the user is on

import { verifySession, encryptSession } from "@/services/hash";
import Airtable from "airtable";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { verifyAuth } from "@/services/verifyAuth";
import { getValue } from "@/services/fetchData";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body["track"]) {
    return NextResponse.json({ error: "Track not provided." });
  }
  const session = await auth();
  const emailAddress = session?.user.email;
  try {
    const recordID = await airtable("Registered Users")
      .select({
        filterByFormula: `{email} = "${emailAddress}"`,
        maxRecords: 1,
        fields: ["record_id", "hashed_token"],
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

    await airtable("Registered Users").update([
      {
        id: prettyRecordID[0]["fields"]["record_id"],
        fields: {
          track: body["track"],
        },
      },
    ]);

    return NextResponse.json(
      { message: "Project updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Something went wrong: ${error}` },
      { status: 400 },
    );
  }
}

// GET /api/user/[userID]/track
// Retrieve the track that the user is on

export async function GET(request: Request) {
  const session = await auth();
  const invalidSession = await verifyAuth();
  if (invalidSession) {
    return NextResponse.json(invalidSession, { status: 401 });
  }

  try {
    const response = (await getValue(session!.user.email!))["track"];
    return NextResponse.json({ message: response }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Something went catastrophically wrong." },
      { status: 400 },
    );
  }
}
