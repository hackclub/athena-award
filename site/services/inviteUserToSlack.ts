"use server";
// this is taken from arrpheus' invite flow (https://github.com/hackclub/arrpheus/blob/e5bc6f12802bb3a2d39e8d46d48a514d3a57cbd0/src/undocumentedSlack.ts#L2)

import Airtable from "airtable";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

const channels = [
  "C75M7C0SY", // #welcome
  "C039PAG1AV7", // #slack-welcome-start
  "C06T17NQB0B", // #athena-award
  "C05T8E9GY64", // #days-of-service
  "C01504DCLVD", // #scrapbook
  "C0266FRGV", // #lounge
  "C05B6DBN802", // #happenings
].join(",");
export async function inviteGuestToSlackToriel(email: string) {
  const cookieValue = `d=${process.env.SLACK_COOKIE}`;

  // Create a new Headers object
  const headers = new Headers();

  // Add the cookie to the headers
  headers.append("Cookie", cookieValue);
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Bearer ${process.env.SLACK_BROWSER_TOKEN}`);

  const data = JSON.stringify({
    token: process.env.SLACK_BROWSER_TOKEN,
    invites: [
      {
        email,
        type: "restricted",
        mode: "manual",
      },
    ],
    restricted: true,
    channels,
  });
  console.log(data);

  const r = await fetch(`https://slack.com/api/users.admin.inviteBulk`, {
    headers,
    method: "POST",
    body: data,
  });
  console.log("Got response:");
  console.log(r);
  console.log("Response JSON:");
  const j = await r.json();
  console.log(j);
  if (!j.ok) {
    throw new Error(`Slack API general error: ${j.error}`);
  }
  if (!j["invites"] || j["invites"].length === 0) {
    throw new Error(`Slack API error: successful but no invites`);
  }
  if (!j["invites"][0]["ok"]) {
    throw new Error(`Slack API error on invite: ${j["invites"][0]["error"]}`);
  }
  return { ok: true };
}

export async function inviteSlackUser(
  email: string,
  referredBy?: string,
  utmSource?: string,
) {
  try {
    console.log(`Inviting ${email} to Slack...`);
    console.log(referredBy);
    const searchExistingUserByReferral = JSON.parse(
      JSON.stringify(
        await airtable("Registered Users")
          .select({
            filterByFormula: `{slack_id} = "${referredBy}"`,
            fields: ["email"],
          })
          .all(),
      ),
    );
    const result = await inviteGuestToSlackToriel(email);
    const addUserToAirtable = await airtable("Email Slack Invites").create([
      {
        fields: {
          email: email,
          referred_by: searchExistingUserByReferral.length
            ? [searchExistingUserByReferral[0]["id"]]
            : [],
          utm_source: utmSource,
        },
      },
    ]);
    console.log(`Invited ${email} to Slack!`);
    return {
      ok: result["ok"],
    };
  } catch (error: any) {
    console.log(`Error in inviteSlackUser: ${error}`, "error");
    const addError = await airtable("Email Slack Invites").create([
      {
        fields: {
          email: email,
          error: String(error),
        },
      },
    ]);
    return { ok: false, error: error.message };
  }
}
