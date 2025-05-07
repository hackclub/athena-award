import Airtable from "airtable";
import { NextResponse } from "next/server";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

// update this to get all values from the unified ysws database

export async function GET() {
  const users = await airtable("Registered Users")
    .select({
      fields: [
        "display_name",
        "slack_id",
        "total_time_approved_projects",
        "profile_picture",
        "points",
      ],
      sort: [{ field: "total_time_approved_projects", direction: "desc" }],
    })
    .all();
  return NextResponse.json(
    JSON.parse(JSON.stringify(users)).map((user: any) => user["fields"]),
  );
}
