// GET api/user/[userID]/waka
// Returns Wakatime (Hackatime) data.

import { NextResponse, NextRequest } from "next/server";
import { getWakaTimeData, getWakaTimeProjects } from "@/services/fetchWakaData";

export async function GET(request: NextRequest, { params }: { params: Promise<{userID: string}>}){
    const searchParams = request.nextUrl.searchParams.get("query")
    const userIDs = (await params).userID
    try {
        let response
        switch (searchParams) {
            case "time":
                response = (await getWakaTimeData(userIDs))
                break;
            case "projects":
                response = (await getWakaTimeProjects(userIDs))
                break;
            default:
                return NextResponse.json({error: "Invalid query"}, { status: 404})
        }
        if (response!.status === 200){
            return NextResponse.json((await response!.json())) //argh
        } else {
            return NextResponse.json({ error: "User is not authed." }, { status: 403 })
        }
    } catch {
        return NextResponse.json({ error: "Something went catastrophically wrong." }, { status: 400 })
    }

}