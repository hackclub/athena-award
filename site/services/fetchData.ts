import Airtable from "airtable";
import { auth } from "@/auth";
import { encryptSession, verifySession } from "@/services/hash";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

export interface safeData {
  email_address: string;
  points: number;
  artifacts: number;
  current_stage: string;
  hackathons: string;
  achievements: string;
  projects: string[];
  project_unique_names: string[];
  total_time_approved_projects: number;
  referred_users_count: number;
  track: "beginner" | "advanced";
  ordered_travel_stipend_money: number;
}

// verify req
async function verifyReq() {
  const session = await auth();
  const encryptedToken = encryptSession(
    session!.access_token!,
    process.env.AUTH_SECRET!,
  );
  return encryptedToken;
}

// Get a specific value
export async function getValue(email: string): Promise<safeData> {
  const recordID = await airtable("Registered Users")
    .select({
      filterByFormula: `{email} = "${email}"`,
      maxRecords: 1,
    })
    .all();

  const prettyRecordID = JSON.parse(JSON.stringify(recordID))[0]["fields"]; // jank
  const email_address = prettyRecordID["email"];
  const points = prettyRecordID["points"];
  const current_stage = prettyRecordID["current_stage"];
  const hackathons = prettyRecordID["hackathons"];
  const artifacts = prettyRecordID["artifacts"];
  const achievements = prettyRecordID["achievements"];
  const projects = prettyRecordID["projects"];
  const project_unique_names = prettyRecordID["project_unique_names"];
  const total_time_approved_projects =
    prettyRecordID["total_time_approved_projects"];
  const track = prettyRecordID["track"];
  const referred_users_count = prettyRecordID["referred_users_count"]
  const ordered_travel_stipend_money = prettyRecordID["ordered_travel_stipend_money"]
  
  return {
    email_address,
    points,
    current_stage,
    hackathons,
    artifacts,
    achievements,
    projects,
    project_unique_names,
    total_time_approved_projects,
    track,
    referred_users_count,
    ordered_travel_stipend_money
  };
}
