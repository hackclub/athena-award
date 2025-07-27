// POST api/user/[userID]/projects/refresh
// to be used when submitting a project for final review. updates the hour count in airtable.
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Airtable from "airtable";
import { getWakaTimeData } from "@/services/fetchWakaData";
import { cacheDelete } from "@/services/redis";
import { generateAirtableCacheKey } from "@/services/airtableCache";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userID: string }> },
) {
  const stageNumber = request.nextUrl.searchParams.get("stage");
  const authorization = request.headers.get("Authorization");

  if (
    !authorization ||
    authorization.split(" ")[1] != process.env.REFRESH_API_KEY
  ) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const slackId = (await params).userID;
  try {
    const recordID = await airtable("Registered Users")
      .select({
        filterByFormula: `{slack_id} = "${slackId}"`,
        maxRecords: 1,
        fields: ["record_id"],
      })
      .all();

    const hackatimeProjects = await getWakaTimeData(slackId);
    let projects;
    if (hackatimeProjects.ok) {
      projects = (await hackatimeProjects.json())["data"]["projects"] as any;
      const selectedProjectToSearchFor = await airtable("Projects")
        .select({
          filterByFormula: `AND({slack_id} = "${slackId}", {stage} = "${stageNumber}")`,
          fields: ["project_name", "record_id"],
        })
        .all();
      const prettyRecordID = JSON.parse(
        JSON.stringify(selectedProjectToSearchFor),
      )[0]; // jank
      const filtered = projects.filter(
        (project: any) =>
          project.name == prettyRecordID["fields"]["project_name"],
      )[0];
      const updateDuration = await airtable("Projects").update([
        {
          id: prettyRecordID["fields"]["record_id"],
          fields: {
            hackatime_duration: Number(
              (filtered.total_seconds / 3600).toFixed(2),
            ),
          },
        },
      ]);
      const selectOptions = {
        filterByFormula: `{slack_id} = "${slackId}"`,
        fields: [
          "project_name",
          "project_name_override",
          "stage",
          "status",
          "existing_ysws_project_hour_override",
          "approved_duration"
        ],
      }
      const cacheKey = generateAirtableCacheKey("Projects", selectOptions, slackId)
      cacheDelete(cacheKey) // this endpoint only gets called when projects are updated so it makes sense to clear the cache when it's called

      return NextResponse.json(
        { message: Number((filtered.total_seconds / 3600).toFixed(2)) },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
      { message: `Hackatime projects was not okay` },
      { status: 502 },)
    }
  } catch (error) {
    return NextResponse.json(
      { message: `Something went wrong: ${error}` },
      { status: 400 },
    );
  }
}
