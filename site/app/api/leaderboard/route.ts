import Airtable from "airtable";
import { NextResponse } from "next/server";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);


export async function GET() {
  const users = await airtable("Registered Users")
    .select({
      filterByFormula: `NOT({role}="admin")`,
      fields: [
        "display_name",
        "slack_id",
        "total_time_approved_projects",
        "profile_picture",
        "points",
      ],
      maxRecords: 50,
      sort: [{ field: "total_time_approved_projects", direction: "desc" }],
    })
    .all();
  return NextResponse.json(
    JSON.parse(JSON.stringify(users)).map((user: any) => user["fields"]),
  );
}
