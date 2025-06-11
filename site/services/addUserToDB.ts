import Airtable from "airtable";
import { encryptSession, verifySession } from "@/services/hash";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

// Update all info known about the registered user, including their Slack ID if they're in the Slack
export async function linkUser(emailAddress: string, accessToken: string) {
  try {
    const accessTokenJoined = encryptSession(
      accessToken,
      process.env.AUTH_SECRET!,
    );
    const urlEncodedEmail = emailAddress.replace("+", "%2b");
    const response = await fetch(
      `https://slack.com/api/users.lookupByEmail?email=${urlEncodedEmail}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + process.env.BOT_USER_OAUTH_TOKEN,
        },
      },
    ).then((res) => res.json());
    const id = response["user"]["id"];
    const r = await airtable("Registered Users")
      .select({ filterByFormula: `{email} = "${urlEncodedEmail}"` })
      .all();
    if (r.length) {
      // user exists in DB
      const m = await airtable("Registered Users").update([
        {
          id: r[0]["id"],
          fields: {
            display_name: response["user"]["profile"]["display_name"],
            profile_picture: response["user"]["profile"]["image_48"],
            hashed_token: accessTokenJoined,
          },
        },
      ]);
      return "User exists in DB";
    } // user is logging on for the first time
    else console.log("adding user to database");
    const l = await airtable("Registered Users").create([
      {
        fields: {
          email: emailAddress,
          display_name: response["user"]["profile"]["display_name"],
          profile_picture: response["user"]["profile"]["image_48"],
          slack_id: id,
          hashed_token: accessTokenJoined,
        },
      },
    ]);

    const userRecordIDInTable = JSON.parse(JSON.stringify(l))[0]["fields"]
      .record_id;

    const autoProject = Array.from(["1", "2", "3"], (x) => ({
      fields: {
        slack_id: id,
        stage: x,
        project_name: "_select#",
        registered_user: [userRecordIDInTable],
      },
    }));
    const createProjects = await airtable("Projects").create(autoProject);

    // this doesn't work because the access token isn't recognised with the endpoint currently used, and the other alternative returns data which isn't really compatible with hackatime
    // https://github.com/hackclub/harbor/blob/2f29f8a055404c4f19275803655b0988736d2589/app/controllers/api/v1/external_slack_controller.rb#L24
    // lmao
    // const createHackatimeAccount = await fetch('https://hackatime.hackclub.com/api/v1/external/slack/oauth', {
    //   method: 'POST',
    //    headers: {
    //      'Authorization': `Bearer ${process.env.HACKATIME_API_KEY}`,
    //      'Content-Type': 'application/json'
    //    },
    //    body: JSON.stringify({
    //      token: accessToken
    //    })
    //  })
    //  .then(response => response.json())
    //  .then(data => console.log(data))
    //  .catch(error => console.error('Error:', error));

    return "User added to DB";
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