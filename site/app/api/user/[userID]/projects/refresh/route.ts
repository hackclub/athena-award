// POST api/user/[userID]/projects/refresh
// to be used when submitting a project for final review. updates the hour count in airtable.
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Airtable from "airtable";
import { encryptSession, verifySession } from "@/utils/hash";
import { getWakaTimeData } from "@/services/fetchWakaData";

const airtable = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!)


export async function POST(request: NextRequest){
    const stageNumber = request.nextUrl.searchParams.get("stage")
      const session = await auth();
      const emailAddress = session?.user.email
      try {
          const recordID = await airtable("Registered Users").select({
              filterByFormula: `{email} = "${emailAddress}"`,
              maxRecords: 1,
              fields: ["record_id", "hashed_token"]
          }).all()
  
          const accessTokenEncrypted = encryptSession(session!.access_token!, process.env.AUTH_SECRET!)
          const prettyRecordID = JSON.parse(JSON.stringify(recordID)) // jank
          if (!(verifySession(prettyRecordID[0]["fields"]["hashed_token"], accessTokenEncrypted))){
              throw "Unauthorized"
          }

        const hackatimeProjects = await getWakaTimeData(session?.slack_id!);
        let projects
        if (hackatimeProjects.ok){
            projects = (await hackatimeProjects.json())["data"]["projects"] as any
            const selectedProjectToSearchFor = await airtable("Projects").select({
                filterByFormula: `AND({slack_id} = "${session?.slack_id}", {stage} = "${stageNumber}")`,
                fields: [
                    "project_name",
                    "record_id"
                ]
            }).all()
            const prettyRecordID = (JSON.parse(JSON.stringify(selectedProjectToSearchFor)))[0] // jank
            console.log(prettyRecordID["fields"]["project_name"])
            const filtered = projects.filter((project: any) => project.name == prettyRecordID["fields"]["project_name"])[0]
            console.log([{ 
                id: prettyRecordID["fields"]["record_id"], 
                fields: {
                    duration: Number((filtered.total_seconds/3600)) 
                }
                }])
            const updateDuration = await airtable("Projects").update([{ 
                id: prettyRecordID["fields"]["record_id"], 
                fields: {
                    duration: Number((filtered.total_seconds/3600))
                }
                }]
            )
            return NextResponse.json({ message: Number((filtered.total_seconds/60).toFixed(2)) }, { status: 200 })

        }
          
        } catch (error) {
            return NextResponse.json({message: `Something went wrong: ${error}`}, {status: 400})
        }
    
}