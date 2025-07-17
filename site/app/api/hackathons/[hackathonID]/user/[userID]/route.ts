// POST api/hackathons/[hackathonID]/user/[userID]
// Registers [userID] as an attendee of [hackathonID]

import { NextResponse, NextRequest } from "next/server";
import Airtable from "airtable";
import { auth } from "@/auth";
import { encryptSession, verifySession } from "@/services/hash";
import { verifyAuth } from "@/services/verifyAuth";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

// Check whether the code is valid for an existing (i.e., currently running) hackathon
async function validateHackathon(hackathonCode: string) {
  const validity = await airtable("Hackathons")
    .select({
      filterByFormula: `AND({Code} = "${hackathonCode}", {Active?})`,
      maxRecords: 1,
      fields: ["Name"],
    })
    .all();

  if (!validity.length) {
    return false;
  }
  return JSON.parse(JSON.stringify(validity));
}

async function linkUserToHackathon(
  emailAddress: string,
  hackathonCode: string,
  hackathonName: string,
  accessTokenEncrypted: string,
) {
  const recordID = await airtable("Registered Users")
    .select({
      filterByFormula: `{email} = "${emailAddress}"`,
      maxRecords: 1,
      fields: ["record_id", "hashed_token"],
    })
    .all();

  const prettyRecordID = JSON.parse(JSON.stringify(recordID)); // jank
  if (
    !verifySession(
      prettyRecordID[0]["fields"]["hashed_token"],
      accessTokenEncrypted,
    )
  ) {
    throw "Unauthorized";
  }

  const existingRecords = JSON.parse(
    JSON.stringify(
      await airtable("Registered Users")
        .select({ filterByFormula: `{email} = "${emailAddress}"` })
        .all(),
    ),
  )[0]["fields"];

  let pastRecords = (existingRecords["hackathon_codes"],
  existingRecords["hackathons"])
    ? [
        existingRecords["hackathon_codes"] + ", ",
        existingRecords["hackathons"] + ", ",
      ]
    : ["", ""];

  if (!pastRecords[0].includes(hackathonCode)) {
    await airtable("Registered Users").update([
      {
        id: prettyRecordID[0]["id"],
        fields: {
          hackathon_codes: pastRecords[0] + hackathonCode,
          hackathons: pastRecords[1] + hackathonName,
        },
      },
    ]);
    return { message: hackathonName, status: 200 };
  } else {
    return {
      error: "You can't join a hackathon you're already in 😔",
      status: 409,
    };
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ hackathonID: string }> },
) {
  const session = await auth();
  const code = (await params).hackathonID;
  const encryptedToken = encryptSession(
    session!.access_token!,
    process.env.AUTH_SECRET!,
  );
  const invalidSession = await verifyAuth(request);
  if (invalidSession) {
    return NextResponse.json(invalidSession, { status: 401 });
  }
  const hackathon = await validateHackathon(code);
  if (hackathon) {
    const response = await linkUserToHackathon(
      session!.user.email!,
      code,
      hackathon[0]["fields"]["Name"],
      encryptedToken,
    );
    return NextResponse.json(response);
  } else {
    return NextResponse.json(
      {
        error:
          "Invalid hackathon code; double check that it's correct - hackathon codes are case-sensitive!",
      },
      { status: 404 },
    );
  }
}
