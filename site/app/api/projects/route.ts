import Airtable from "airtable";
import { NextResponse } from "next/server";
import { cacheGet, cacheSet } from "@/services/redis";

const CACHE_KEY = "projects:map:all";
const CACHE_TTL = 5 * 60; // 5 minutes

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
  if (data) {
    return {
      lat: data.lat.toPrecision(2),
      lng: data.lng.toPrecision(2),
    };
  }
  return null;
}

const cacheHeaders = {
  "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
};

export async function GET() {
  try {
    const cached = await cacheGet(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, { headers: cacheHeaders });
    }

    const records = await airtable("Projects")
      .select({
        filterByFormula: 'AND({status} = "approved", {user_consent})',
        fields: [
          "project_name",
          "project_name_override",
          "playable_url",
          "code_url",
          "slack_id",
          "address_joined_no_name (from form_submitted_project)",
          "lat",
          "lng",
        ],
      })
      .all();

    const projects = [];
    for (const record of records) {
      const fields = record.fields;
      const address = fields[
        "address_joined_no_name (from form_submitted_project)"
      ] as string | undefined;
      let lat = fields["lat"];
      let lng = fields["lng"];
      let latLng = null;
      let country = undefined;
      const slack_id = fields["slack_id"];
      if ((!lat || !lng) && address) {
        latLng = await geocodeAddress(address[0].replace("\n", ""));
        if (latLng) {
          lat = latLng.lat;
          lng = latLng.lng;
          await airtable("Projects").update(record.id, {
            lat: lat,
            lng: lng,
          });
        }
      } else if (lat && lng) {
        latLng = { lat, lng };
      }
      if (address) {
        const addressParts =
          address[0].split("\n")[address[0].split("\n").length - 1];
        country = addressParts;
      }
      const project_name = fields["project_name"];
      const project_name_override =
        fields["project_name_override"] &&
        (String(fields["project_name_override"])?.split("–"))[0];
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

    await cacheSet(CACHE_KEY, projects, CACHE_TTL);
    return NextResponse.json(projects, { headers: cacheHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects", details: String(error) },
      { status: 500 },
    );
  }
}
