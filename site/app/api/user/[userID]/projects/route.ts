// POST /api/user/[userID]/projects
// Set the name of the project for the respective stage

import { NextResponse, NextRequest } from "next/server";
import Airtable from 'airtable';
import { auth } from '@/auth';
import { encryptSession, verifySession } from '@/utils/hash';
import { getValue } from "@/services/fetchData";
import { getWakaTimeData } from "@/services/fetchWakaData";

const airtable = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!)

export async function GET(request: NextRequest){
    const query = request.nextUrl.searchParams.get("query")
    const session = await auth()
    try {
        if (query === "all"){
            const hackatimeProjects = await fetch(`https://hackatime.hackclub.com/api/v1/users/${session?.slack_id}/stats?features=projects`)
            let projects
            if (hackatimeProjects.ok && hackatimeProjects){
                projects = (await hackatimeProjects.json()) as any
            }
            return NextResponse.json(projects)

        } else if (query === "selected"){
            const stage = request.nextUrl.searchParams.get("stage")
            const projectForStage = (await getValue(session!.user.email!) as any)[`stage_`+stage+`_project`]
            return NextResponse.json({message: projectForStage }, { status: 200 })

        } else if (query === "total_time"){
            const hackatimeProjects = await getWakaTimeData(session?.slack_id!);
            let projects
            if (hackatimeProjects.ok){
                projects = (await hackatimeProjects.json())["data"]["projects"] as any
                const stage_1_project = (await getValue(session!.user.email!) as any)[`stage_1_project`]
                const stage_2_project = (await getValue(session!.user.email!) as any)[`stage_2_project`]
                const stage_3_project = (await getValue(session!.user.email!) as any)[`stage_3_project`]    
                const r = projects.filter((project: any) => [stage_1_project, stage_2_project, stage_3_project].includes(project.name))
                return NextResponse.json({message: r }, { status: 200 })
            }
            return NextResponse.json({error: "Hackatime was unresponsive" }, { status: 400 })


        }
    } catch (error) {
        return NextResponse.json({error: `Something went wrong - generic error for no projects or ${error}`}, { status: 400 })
    }
}

export async function POST(request: NextRequest){
    const body = await request.json()
    const stage = "stage_" + body["stage"] + "_project"
    const projectName = body["project"]
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

        const data =  {
            "id": prettyRecordID[0]["id"],
            "fields": {
                [stage]: projectName
            }
        }
        await airtable("Registered Users").update([
            data
        ])
        return NextResponse.json({message: "Project updated successfully"}, {status: 200})
    } catch {
        return NextResponse.json({message: "Something went wrong"}, {status: 400})
    }

}