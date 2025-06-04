import Airtable from "airtable";
import { NextResponse } from "next/server";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

export async function GET() {
  const allFields = await airtable("Partners").select().all();
  const names = allFields
    .map((partner: any) => partner.fields && partner.fields.Name)
    .filter((name: string | undefined) => !!name);
  return NextResponse.json(names);
}

// POST /api/partners
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, self_reported_partners } = body;
    if (!email || !Array.isArray(self_reported_partners)) {
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
    await airtable("Email Slack Invites").update([
      {
        id: recordId,
        fields: { self_reported_partners },
      },
    ]);
    return NextResponse.json({ message: "Partners updated successfully." });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
