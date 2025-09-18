import Airtable from "airtable";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { NextRequest } from "next/server";
import { identifyEmail } from "@/services/adminOverride";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

export async function GET(request: NextRequest) {
  const session = await auth();
  const email = (await identifyEmail(request, session!))!
  const allFields = await airtable("Registered Users")
    .select({
      filterByFormula: `{email} = ${email}`,
      fields: ["self_reported_partners"],
    })
    .all();
  const allPartners = allFields[0].fields.self_reported_partners;
  return NextResponse.json(allPartners);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  try {
    const body = await request.json();
    const email = session?.user.email;
    const { self_reported_partners_onboarding } = body;
    if (!email || !Array.isArray(self_reported_partners_onboarding)) {
      return NextResponse.json(
        { error: "Email and partners array required." },
        { status: 400 },
      );
    }
    const records = await airtable("Email Slack Invites")
      .select({ filterByFormula: `{email} = "${email}"`, maxRecords: 1 })
      .all();
    if (!records.length) {
      return NextResponse.json({ error: "Email not found." }, { status: 404 });
    }
    const recordId = records[0].id;
    await airtable("Registered Users").update([
      {
        id: recordId,
        fields: { self_reported_partners_onboarding },
      },
    ]);
    return NextResponse.json({ message: "Partners updated successfully." });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
