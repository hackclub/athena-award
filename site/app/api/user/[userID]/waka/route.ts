// GET api/user/[userID]/waka
// Returns Wakatime (Hackatime) data.

import { NextResponse, NextRequest } from "next/server";
import { getWakaTimeData } from "@/services/fetchWakaData";
import { auth } from "@/auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{email: string}>}){
    const session = await auth()
    const email = request.nextUrl.searchParams.get("query")

    if (!session || email != session!.user.email){
        return NextResponse.json({error: "Unauthed"}, { status: 401})
    }
    
    let response
    try {
        response = (await getWakaTimeData(email!))
        if (response!.status === 200){
            return NextResponse.json((await response!.json())) //argh
        } else {
            return NextResponse.json({ error: "User is not authed." }, { status: 403 })
        }
    } catch {
        return NextResponse.json({ error: "Something went catastrophically wrong." }, { status: 400 })
    }

}