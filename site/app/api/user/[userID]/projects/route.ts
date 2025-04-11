// POST /api/user/[userID]/projects
// Set the name of the project for the respective stage

import { NextResponse, NextRequest } from "next/server";
import Airtable from 'airtable';
import { auth } from '@/auth';
import { encryptSession, verifySession } from '@/utils/hash';
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
            const uniqueProjectForStage = session?.slack_id+"_"+stage
            const projectInformation = await airtable("Projects").select({
                filterByFormula: `AND({slack_id} = "${session?.slack_id}", {unique_name} = "${uniqueProjectForStage}")`,
                fields: [
                    "project_name",
                    "stage",
                    "status",
                    "form_submitted_project"
                ]
            }).all()
            let prettyRecordID
            try {
                prettyRecordID = JSON.parse(JSON.stringify(projectInformation))[0]["fields"]// jank
                return NextResponse.json({message: prettyRecordID }, { status: 200 })
            } catch (error) {
                // no project has been set yet for that stage
                // this is so stupid
                return NextResponse.json({message: { project_name: "_select", stage: stage, status: "pending", form_submitted_project: null}}, { status: 200 })

            }

        } else if (query === "total_time"){
            const hackatimeProjects = await getWakaTimeData(session?.slack_id!);
            let projects
            if (hackatimeProjects.ok){
                projects = (await hackatimeProjects.json())["data"]["projects"] as any
                const allProjects = await airtable("Projects").select({
                    filterByFormula: `{slack_id} = "${session?.slack_id}"`,
                    fields: [
                        "project_name"
                    ]
                }).all()
                const prettyRecordID = (JSON.parse(JSON.stringify(allProjects))).map((project: any) => project["fields"]["project_name"]) // jank
                const r = projects.filter((project: any) => prettyRecordID.includes(project.name))
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
    const session = await auth();
    const uniqueProjectName = session?.slack_id + "_" + body["stage"]
    const projectName = body["project"]
    const emailAddress = session?.user.email
    try {
        const recordID = await airtable("Registered Users").select({
            filterByFormula: `{email} = "${emailAddress}"`,
            maxRecords: 1,
            fields: ["record_id", "hashed_token", "projects", "project_unique_names"]
        }).all()

        const accessTokenEncrypted = encryptSession(session!.access_token!, process.env.AUTH_SECRET!)
        const prettyRecordID = JSON.parse(JSON.stringify(recordID)) // jank
        if (!(verifySession(prettyRecordID[0]["fields"]["hashed_token"], accessTokenEncrypted))){
            throw "Unauthorized"
        }
        if (prettyRecordID[0]["fields"]["project_unique_names"].includes(uniqueProjectName)){
            // project already exists and linked to user
            const projNumber = uniqueProjectName.slice(-1)
            const data =  {
                "id": prettyRecordID[0]["fields"]["projects"][Number(projNumber) - 1],
                "fields": {
                    "project_name": projectName
                }
            }
            await airtable("Projects").update([
                data
            ])
            return NextResponse.json({message: "Project updated successfully"}, {status: 200})
        } else {
            // if the project id does not exist, create new project and link it to the user
            const data =  {
                "fields": {
                    "slack_id": session?.slack_id,
                    "project_name": projectName,
                    "stage": String(body["stage"]),
                    "registered_user": [
                        prettyRecordID[0]["id"]
                    ]
                }
            }
            const r = await airtable("Projects").create([
                data
            ]).catch((error) => {
                console.log(error)
            })
            return NextResponse.json({message: "Project created successfully"}, {status: 200})

        }
    } catch (error) {
        return NextResponse.json({message: `Something went wrong: ${error}`}, {status: 400})
    }

}