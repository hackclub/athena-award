// GET api/hackathons/[hackathonID]
// Returns whether the hackathonID is valid 

import { NextResponse } from "next/server";
import Airtable from 'airtable';
import { auth } from '@/auth';
import { verifyAuth } from "@/services/verifyAuth";

const airtable = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!)

// Check whether the code is valid for an existing (i.e., currently running) hackathon
async function validateHackathon(hackathonCode: string){
        const validity = await airtable("Hackathons").select({
            filterByFormula: `AND({Code} = "${hackathonCode}", {Active?})`,
            maxRecords: 1,
            fields: ['Name']
        }).all()
    
        if (!validity.length){
            return false
        }
        return JSON.parse(JSON.stringify(validity))
}


export async function GET(request: Request, { params }: { params: Promise<{slug: string}>} ) {
    const session = await auth();
    const slug = ((await params).slug)
    const code = await slug
    const invalidSession = await verifyAuth()
    if (invalidSession){ return NextResponse.json(invalidSession, {status: 401})}
    
    const hackathon = await validateHackathon(code)
    if (hackathon){
        return NextResponse.json({message: "Success", status: "200"})
    } else {
        return NextResponse.json({error: "Invalid hackathon code; double check that it's correct - hackathon codes are case-sensitive!"}, { status: 404 })
    }
}


