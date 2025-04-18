// POST api/user/[userID]/projects/refresh
// to be used when submitting a project for final review. updates the hour count in airtable.
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Airtable from "airtable";
import { encryptSession, verifySession } from "@/services/hash";
import { getWakaTimeData } from "@/services/fetchWakaData";

const airtable = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!)


export async function POST(request: NextRequest, { params }: { params: Promise<{ userID: string }>} ){
    const stageNumber = request.nextUrl.searchParams.get("stage")
    const slackId = (await params).userID
    try {
          const recordID = await airtable("Registered Users").select({
              filterByFormula: `{slack_id} = "${slackId}"`,
              maxRecords: 1,
              fields: ["record_id"]
          }).all()

        const hackatimeProjects = await getWakaTimeData(slackId);
        let projects
        if (hackatimeProjects.ok){
            projects = (await hackatimeProjects.json())["data"]["projects"] as any
            const selectedProjectToSearchFor = await airtable("Projects").select({
                filterByFormula: `AND({slack_id} = "${slackId}", {stage} = "${stageNumber}")`,
                fields: [
                    "project_name",
                    "record_id"
                ]
            }).all()
            const prettyRecordID = (JSON.parse(JSON.stringify(selectedProjectToSearchFor)))[0] // jank
            const filtered = projects.filter((project: any) => project.name == prettyRecordID["fields"]["project_name"])[0]
            const updateDuration = await airtable("Projects").update([{ 
                id: prettyRecordID["fields"]["record_id"], 
                fields: {
                    hackatime_duration: Number((filtered.total_seconds/3600).toFixed(2))
                }
                }]
            )
            return NextResponse.json({ message: Number((filtered.total_seconds/3600).toFixed(2)) }, { status: 200 })

        }
          
        } catch (error) {
            return NextResponse.json({message: `Something went wrong: ${error}`}, {status: 400})
        }
    
}