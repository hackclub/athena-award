import Airtable from "airtable";
import { NextResponse } from "next/server";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

async function geocodeAddress(
  address: string,
): Promise<{ lat: number; lng: number } | null> {
  const url = `https://geocoder.hackclub.com/v1/geocode?address=${encodeURIComponent(address)}&key=${process.env.GEOCODER_API_KEY}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "athena-award/1.0" },
  });   

  if (!res.ok) return null;
  const data = await res.json();
  if (data){
    return {
      lat: (data.lat).toPrecision(2),
      lng: (data.lng).toPrecision(2),
    };
  }
  return null;
}

export async function GET() {
  try {
    const records = await airtable("Projects")
      .select({
        filterByFormula: 'AND({status} = "approved", {user_consent})',
      })
      .all();
    const projects = [];
    for (const record of records) {
      const fields = record.fields;
      const address = fields[
        "address_joined_no_name (from form_submitted_project)"
      ] as string | undefined;
      let latLng = null;
      let country = undefined;
      const slack_id = fields["slack_id"];
      if (address) {
        latLng = await geocodeAddress(address[0].replace("\n", ""));
        const addressParts =
          address[0].split("\n")[address[0].split("\n").length - 1];
        country = addressParts;
      }
      const project_name = fields["project_name"];
      const project_name_override = fields["project_name_override"] && (String(
        fields["project_name_override"],
      )?.split("–"))[0]; // they contain the author's full name, which optimally we are not broadcasting to the entire world
      const playable_url = fields["playable_url"];
      const code_url = fields["code_url"];
      if (latLng) {
        projects.push({
          lat: latLng.lat,
          long: latLng.lng,
          label: [
            {
              project_name,
              project_name_override,
              playable_url,
              code_url,
              country,
              slack_id,
            },
          ],
        });
      }
    }
    return NextResponse.json(projects);

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects", details: String(error) },
      { status: 500 },
    );
  }
}
