// POST api/user
// Create a new user
import Airtable from 'airtable';
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { encryptSession, verifySession } from '@/utils/hash'

const airtable = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID!)

// Update all info known about the registered user, including their Slack ID if they're in the Slack
async function linkUser(emailAddress: string, accessToken: string){
    const accessTokenJoined = encryptSession(accessToken, process.env.AUTH_SECRET!)
    const response = await fetch(`https://slack.com/api/users.lookupByEmail?email=${emailAddress}`,
        {
            method: "GET",
            headers: {
                Authorization: "Bearer " + accessToken}
        }
    ).then(res => res.json())
    const id = response["user"]["id"]
    const r = await airtable("Registered Users").select({filterByFormula: `{email} = "${emailAddress}"`}).all()
    if (r.length) { // user exists in DB
        return ("User exists in DB")
    } else { // user is logging on for the first time
        console.log("adding user to database")
        const l = await airtable("Registered Users").create(
            [{
                fields: {
            "email": emailAddress,
            "slack_id": id,
            "hashed_token": accessTokenJoined,
            "points": 0 
                        }
        }])
    return "User added to DB"
    }
}

export async function POST(request: Request) {
    const session = await auth();
    const emailAddress = session!.user.email!
    try {
        const r = await linkUser(emailAddress, session!.access_token!)
        return NextResponse.json({message: "Success"}, {status: 200})
    } catch {
        return NextResponse.json({error: "Something went wrong."}, {status: 400})

    }
}