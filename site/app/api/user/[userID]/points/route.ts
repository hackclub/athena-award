// GET api/user/[userID]/points
// Returns a numeric value of the points a user has

import { NextResponse } from "next/server";
import { auth } from '@/auth';
import { getValue } from "@/services/fetchData";

export async function GET(request: Request){
    const session = await auth();
    try {
        const response = (await getValue(session!.user.email!))["points"]
        return NextResponse.json({ message: response }, { status: 200 })

    } catch {
        return NextResponse.json({ error: "Something went catastrophically wrong." }, { status: 400 })
    }

}