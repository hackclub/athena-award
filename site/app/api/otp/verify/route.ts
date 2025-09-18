import { NextResponse, NextRequest } from "next/server";
import Airtable from "airtable";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

export async function POST(request: NextRequest) {
  const { email, otp } = await request.json();
  if (!email || !otp) {
    return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
  }
  try {
    // Find the record for the email
    const records = await airtable('Verification Codes')
      .select({
        filterByFormula: `{email} = '${email}'`,
        fields: ["OTP", "isUsed"],
        sort: [{ field: "createdAt", direction: "desc" }],
        maxRecords: 1
      })
      .firstPage();
    if (records.length === 0) {
      return NextResponse.json({ message: "No verification record found for this email" }, { status: 404 });
    }
    const record = records[0];
    const storedOtp = record.get("OTP");
    if (storedOtp === otp) {
      // Mark isUsed as true
      await airtable('Verification Codes').update(record.id, { isUsed: true });
      return NextResponse.json({ message: "OTP verified successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Airtable error", error: (error as any).message }, { status: 500 });
  }
}

