import Airtable from "airtable";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verifyAuth } from "@/services/verifyAuth";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

export async function GET(request: NextRequest) {
  const stage = request.nextUrl.searchParams.get("stage");
  const allPrizes = await airtable("Shop")
    .select({
      fields: [ "item_name", "item_friendly_name", "description", "image", "stage", "price", "availability", "availability_link"],
      sort: [
        { field: "stage", direction: "asc" },
        { field: "price", direction: "asc" },
      ],
    })
    .all();
  let prettyPrizeID;
  if (stage) {
    prettyPrizeID = JSON.parse(JSON.stringify(allPrizes))
      .map((item: any) => item["fields"])
      .filter((key: any) => !["Orders"].includes(key) && key["stage"] == stage); // jank
  } else {
    prettyPrizeID = JSON.parse(JSON.stringify(allPrizes))
      .map((item: any) => item["fields"])
      .filter((key: any) => !["Orders"].includes(key)); // jank
  }
  return NextResponse.json(prettyPrizeID);
}
