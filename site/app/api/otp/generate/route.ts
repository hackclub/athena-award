import { NextResponse, NextRequest } from "next/server";
import Airtable from "airtable";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  try {
      await airtable('Verification Codes').create([{fields: {
        email: email,
        OTP: otp,
      }
      }]);

    return NextResponse.json({ message: "OTP sent", otp }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Airtable error", error: (error as any).message }, { status: 500 });
  }
}
