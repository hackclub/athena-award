import Airtable from "airtable"
import { NextResponse } from "next/server"

const airtable = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!)

export async function GET(){
    const allPrizes = (await airtable("Shop").select().all())
    const prettyPrizeID = (JSON.parse(JSON.stringify(allPrizes)))// jank
    return NextResponse.json(prettyPrizeID)
}