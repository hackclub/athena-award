import Airtable from "airtable"
import { NextResponse } from "next/server"
import { verifyAuth } from "@/services/verifyAuth"

const airtable = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!)

export async function GET(){
    const invalidSession = await verifyAuth()
    if (invalidSession){ return NextResponse.json(invalidSession, {status: 401})}
    const allPrizes = (await airtable("Shop").select().all())
    const prettyPrizeID = (JSON.parse(JSON.stringify(allPrizes)))// jank
    return NextResponse.json(prettyPrizeID)
}