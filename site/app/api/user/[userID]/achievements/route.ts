// GET api/[userID]/achievements
// Returns a list of achievements the user has unlocked.

import { NextResponse } from "next/server";
import { auth } from '@/auth';
import { getValue } from "@/services/fetchData";

export async function GET(request: Request){
    const session = await auth();
    try {
        const response = (await getValue(session!.user.email!))["achievements"]
        return NextResponse.json({ message: response }, { status: 200 })

    } catch {
        return NextResponse.json({ error: "Something went catastrophically wrong." }, { status: 400 })
    }

}