"use server"
import Airtable from "airtable";
import { encryptSession, verifySession } from "@/services/hash";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

// Update all info known about the registered user, including their Slack ID if they're in the Slack
export async function linkUser(emailAddress: string) {
  try {
    const urlEncodedEmail = emailAddress.replace("+", "%2b");
    const displayName = emailAddress.split("@")[0];
    const profilePicture = "https://placehold.co/400";
    const r = await airtable("Registered Users")
      .select({ filterByFormula: `{email} = "${urlEncodedEmail}"` })
      .all();
    if (r.length) {
      // user exists in DB
      await airtable("Registered Users").update([
        {
          id: r[0]["id"],
          fields: {
            display_name: displayName,
            profile_picture: profilePicture,
          },
        },
      ]);
      return "User exists in DB";
    } else {
      // user is logging on for the first time
      console.log("adding user to database");
      await airtable("Registered Users").create([
        {
          fields: {
            email: emailAddress,
            display_name: displayName,
            profile_picture: profilePicture,
          },
        },
      ]);
      return "User added to DB";
    }
  } catch (error) {
    throw error;
  }
}

export async function getUserRole(email: string){
    const r = await airtable("Registered Users")
      .select({ 
        filterByFormula: `{email} = "${email.replace('+', '%2b')}"`,
        fields: ["role"],
        maxRecords: 1 })
      .all();
    const prettyRecordId = JSON.parse(JSON.stringify(r))
    console.log(prettyRecordId)
    return prettyRecordId[0]["fields"]["role"]

}