import Airtable from "airtable";
import { NextResponse } from "next/server";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);


export async function GET(){
    const deities: { [key: string]: { hours: number; members: string[] }} = {
        "Neith": {
            hours: 0,
            members: []
        },
        "Durga": {
            hours: 0,
            members: []
        },
        "Minerva": {
            hours: 0,
            members: []
        }
    }

    for (var i = 0; i < Object.keys(deities).length; i ++){
        var deityTotal = 0
        var members: string[] = [];
        console.log(Object.keys(deities)[i])
        const records = await airtable("Registered Users").select({ 
            filterByFormula: `AND({team}="${Object.keys(deities)[i]}", NOT({role}="admin"))`, 
            fields: ["hours_spent_panathenaic_games", "display_name"],
            sort: [{ field: "hours_spent_unified_db", direction: "desc" }]
        }).all()
        for (const record of records){
            deityTotal += Number(record.get("hours_spent_panathenaic_games"))
            members.push(String(record.get("display_name")))
        }
        deities[Object.keys(deities)[i] as "Neith" | "Durga" | "Minerva"]["hours"] = deityTotal
        deities[Object.keys(deities)[i] as "Neith" | "Durga" | "Minerva"]["members"] = members

    }
    return NextResponse.json(deities)
}