// POST /api/user/my/projects
// Set the name of the project for the respective stage

import { NextResponse, NextRequest } from "next/server";
import Airtable from "airtable";
import { auth } from "@/auth";
import { encryptSession, verifySession } from "@/services/hash";
import { getWakaTimeData } from "@/services/fetchWakaData";
import { verifyAuth } from "@/services/verifyAuth";
import { identifySlackId } from "@/services/adminOverride";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  const session = await auth();

  const slackId = (await identifySlackId(request, session!))!

  const invalidSession = await verifyAuth(request);
  if (invalidSession) {
    return NextResponse.json(invalidSession, { status: 401 });
  }
  if (!query) {
    return NextResponse.json(
      { message: "Query not specified" },
      { status: 200 },
    );
  }
  try {
    if (query === "all") {
      const hackatimeProjects = await getWakaTimeData(slackId);
      let projects;
      if (hackatimeProjects.ok && hackatimeProjects) {
        projects = (await hackatimeProjects.json()) as any;
      }
      return NextResponse.json(projects);
    } else if (query === "selected") {
      const stage = request.nextUrl.searchParams.get("stage");
      const uniqueProjectForStage = session?.slack_id + "_" + stage;
      const projectInformation = await airtable("Projects")
        .select({
          filterByFormula: `AND({slack_id} = "${session?.slack_id}", {unique_name} = "${uniqueProjectForStage}")`,
          fields: [
            "project_name",
            "project_name_override",
            "stage",
            "status",
            "form_submitted_project",
          ],
        })
        .all();
      let prettyRecordID;
      try {
        prettyRecordID = JSON.parse(JSON.stringify(projectInformation))[0][
          "fields"
        ]; // jank
        return NextResponse.json({ message: prettyRecordID }, { status: 200 });
      } catch (error) {
        // no project has been set yet for that stage
        // this is so stupid
        return NextResponse.json(
          {
            message: {
              project_name: "_select#",
              stage: stage,
              status: "pending",
              form_submitted_project: null,
            },
          },
          { status: 200 },
        );
      }
    } else if (query === "total_time") {
      // TO DO: DON'T FAIL IF HACKATIMEPROJECTS !OK, BUT INSTEAD JUST RETRIEVE PROJECTS FROM AIRTABLE
        const allProjects = await airtable("Projects")
        .select({
          filterByFormula: `{slack_id} = "${slackId}"`,
          fields: [
            "project_name",
            "project_name_override",
            "stage",
            "status",
            "existing_ysws_project_hour_override",
            "approved_duration"
          ],
        })
        .all();
      const userProjectStatus = JSON.parse(JSON.stringify(allProjects))
        .map((project: any) => ({
          name: project["fields"]["project_name"],
          project_name_override: project["fields"]["project_name_override"],
          stage: project["fields"]["stage"],
          status: project["fields"]["status"],
          total_seconds: project["fields"][
            "approved_duration"
          ]
            ? project["fields"]["approved_duration"] * 3600
            : null,
        }))
        .filter((project: any) => project.name != "_select#" || project.project_name_override); // this is so bad

      let projects;
      try {
        const hackatimeProjects = await getWakaTimeData(slackId);

        // user has hackatime
        projects = (await hackatimeProjects.json())["data"]["projects"] as any;

        let r;
        try {
          const prettyRecordID = JSON.parse(JSON.stringify(allProjects)).map(
            (project: any) => project["fields"]["project_name"],
          ); // jank
          const userProject = projects.filter((project: any) =>
            prettyRecordID.includes(project.name),
          );
          let newThing = userProjectStatus.map((projPair: any) => {
            const matchingProject = userProject.find(
              (project: any) => project.name === projPair.name,
            );
            return {
              ...(matchingProject || {}),
              name: projPair.name,
              project_name_override: projPair.project_name_override,
              status: projPair.status,
              total_seconds:
                projPair.total_seconds ?? matchingProject?.total_seconds ?? 0,
            };
          }); // HELP ME

          return NextResponse.json({ message: newThing }, { status: 200 });
        } catch (error) {
          console.log(error);
          return NextResponse.json({ error: error }, { status: 400 });
        }
      } catch (error) {
        // user does NOT have hackatime
        return NextResponse.json({ message: userProjectStatus }); // believe it or not i am capable of writing worse code than this
      }
    } else if (query === "valid_for_selection") {
      // projects which haven't already been selected for another stage
      const stage = request.nextUrl.searchParams.get("stage");
      if (!stage) {
        return NextResponse.json(
          { error: "Must select stage to filter for valid projects" },
          { status: 400 },
        );
      }
      const hackatimeProjects = await getWakaTimeData(slackId);
      let projects;
      if (hackatimeProjects.ok) {
        projects = (
          (await hackatimeProjects.json())["data"]["projects"] as any
        ).filter((project: any) => project.name);
        console.log(projects)
        const airtableFetch = await airtable("Projects")
              .select({
                filterByFormula: `{slack_id} = "${slackId}"`,
                fields: ["stage", "project_name"],
              })
              .all()
        console.log(airtableFetch)
        const selectedProject = JSON.parse(
          JSON.stringify(
            airtableFetch
          ),
        )
          .map((project: any) => project.fields)
          .filter(
            (proj: any) => proj.stage !== stage && proj.name != "_select#",
          );
        console.log(selectedProject)

        const selectedProjectNames = new Set(
          selectedProject.map((proj: any) => proj.project_name),
        );
        console.log(selectedProjectNames)
        const filteredProjects = projects.filter(
          (project: any) => !selectedProjectNames.has(project.name),
        );
        return NextResponse.json(filteredProjects);
      }
      // case where no hackatime account exists
      return NextResponse.json([]);
    } else if (query === "most_recent_submission") {
      const mostRecentProject = await airtable("Projects")
        .select({
          filterByFormula: `AND({slack_id} = "${slackId}", NOT({status} = "pending"))`,
          fields: ["stage"],
          sort: [{ field: "stage", direction: "desc" }],
        })
        .all();
      console.log(mostRecentProject);
      const i = JSON.parse(JSON.stringify(mostRecentProject))[0];
      return NextResponse.json({
        message:
          !i || Number(i["fields"]["stage"]) < 4
            ? 3
            : Number(i["fields"]["stage"]),
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Something went wrong - ${error}` },
      { status: 400 },
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const session = await auth();
  const uniqueProjectName = session?.slack_id + "_" + body["stage"];
  const projectName = body["project"];
  const slackId = (await identifySlackId(request, session!)!)
  try {
    const recordID = await airtable("Registered Users")
      .select({
        filterByFormula: `{slack_id} = "${slackId}"`,
        maxRecords: 1,
        fields: [
          "record_id",
          "hashed_token",
          "projects",
          "project_unique_names",
        ],
      })
      .all();

    const accessTokenEncrypted = encryptSession(
      session!.access_token!,
      process.env.AUTH_SECRET!,
    );
    const prettyRecordID = JSON.parse(JSON.stringify(recordID)); // jank
    if (
      !verifySession(
        prettyRecordID[0]["fields"]["hashed_token"],
        accessTokenEncrypted,
      )
    ) {
      throw "Unauthorized";
    }
    if (
      prettyRecordID[0]["fields"]["project_unique_names"] &&
      prettyRecordID[0]["fields"]["project_unique_names"].includes(
        uniqueProjectName,
      )
    ) {
      // project already exists and linked to user
      const projNumber = uniqueProjectName.slice(-1);
      const data = {
        id: prettyRecordID[0]["fields"]["projects"][Number(projNumber) - 1],
        fields: {
          project_name: projectName,
        },
      };
      await airtable("Projects").update([data]);
      return NextResponse.json(
        { message: "Project updated successfully" },
        { status: 200 },
      );
    } else {
      // if the project id does not exist, create new project and link it to the user
      const data = {
        fields: {
          slack_id: session?.slack_id,
          project_name: projectName,
          stage: String(body["stage"]),
          registered_user: [prettyRecordID[0]["id"]],
        },
      };
      const r = await airtable("Projects")
        .create([data])
        .catch((error) => {
          console.log(error);
        });
      return NextResponse.json(
        { message: "Project created successfully" },
        { status: 200 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: `Something went wrong: ${error}` },
      { status: 400 },
    );
  }
}
