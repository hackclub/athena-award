// GET api/user/[userID]/waka
// Returns Wakatime (Hackatime) from the last six months. TO DO: get an actual date range up.

import { NextResponse } from "next/server";
import { getWakaTimeData } from "@/services/fetchWakaData";

export async function GET(request: Request, { params }: { params: Promise<{userID: string}>}){
    const userIDs = (await params).userID
    try {
        const response = (await getWakaTimeData(userIDs))
        if (response.status === 200){
            return NextResponse.json(await response.json()) //argh
        } else {
            return NextResponse.json({ error: "User is not authed." }, { status: 403 })
        }
    } catch {
        return NextResponse.json({ error: "Something went catastrophically wrong." }, { status: 400 })
    }

}