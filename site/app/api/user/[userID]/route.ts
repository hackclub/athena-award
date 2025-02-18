// GET api/user/[userID]
// Returns information about a user 
// tbh what even is going on here

import Airtable from 'airtable';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getValue } from '@/services/fetchData';


const validData = ["current_stage", "slack_id"]; // this is really stupid
interface validData {
    current_stage: string,
    slack_id: string
}

export async function GET(request: NextRequest) {
    const query  = (request.nextUrl.searchParams).get("query")
    if (!query || validData.includes(query)){ // this is stupid
        return NextResponse.json({error: "Invalid query", status: 404})
    }
    const session = await auth();
    const emailAddress = session!.user.email!
    try {
        const response = (await getValue(emailAddress))[query as keyof validData];
        return NextResponse.json({message: response}, {status: 200})
    } catch {
        return NextResponse.json({error: "Something went wrong."}, {status: 400})

    }
}
