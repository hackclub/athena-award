import useSWR from "swr";
import { useSession } from "next-auth/react";
import { fetcher } from "@/services/fetcher";
import { Warning } from "@/components/panels/add-ons/Callout";
import { Tooltip } from "react-tooltip";

export function Waka() {
  const session = useSession();
  const { data, error, isLoading } = useSWR(
    `/api/user/my/projects?query=total_time`,
    fetcher,
  );
  let projects, totalTimeSpent, totalApprovedTimeSpent;
  if (data) {
    projects = (data as any)["message"];
    console.log(projects)
    totalTimeSpent = projects.filter((project: any) => !!project.total_seconds).reduce(
      (pSum: any, project: any) => pSum + project.total_seconds,
      0,
    );
    totalApprovedTimeSpent = projects.reduce(
      (pSum: any, project: any) =>
        project.status === "approved"
          ? pSum + (project.total_seconds || 0)
          : pSum,
      0,
    );
  }
  if (error) {
    if (error.status !== 200) {
      // handle user not having a profile
      return (
        <div>
          <h2 className="bg-white/20 p-2 text-white text-lg sm:text-2xl">
            Time spent coding
          </h2>
          <Warning title="Your Hackatime data isn't public!">
            Hackatime lets us track how long you've spent on coding.
          </Warning>
          <ul className="list-decimal list-inside py-2">
            <li>
              To set up Hackatime, head to{" "}
              <a target="_blank" href="https://hackatime.hackclub.com/">
                Hackatime
              </a>{" "}
              and follow these steps.{" "}
            </li>
            <li>
              Make sure you have the Wakatime extension installed in your code
              editor, then follow the instructions{" "}
              <a
                target="_blank"
                href="https://hackatime.hackclub.com/my/wakatime_setup"
              >
                here
              </a>
            </li>
            <li>
              Type a bit in your code editor, then check Hackatime again to see
              your data appear.
            </li>
          </ul>
          Happy hacking!
        </div>
      );
    }
    return <div>Something went wrong when loading your WakaTime data.</div>;
  }
  if (isLoading) {
    return <div>Loading WakaTime data...</div>;
  }

  const hasAchievedTime = totalTimeSpent / 1080 > 100;
  const hasAchievedApprovedTime = totalApprovedTimeSpent / 1080 > 100;

  return (
    <div>
      <h2 className="bg-white/20 p-2 text-white text-lg sm:text-2xl">
        {(totalTimeSpent / 3600).toFixed(2)} hours spent coding on your
        projects.
      </h2>
      <div className="rounded-xl w-full h-8 bg-gray-200 my-3 relative">
        <Tooltip id="waka_progress" place="top" className="z-10 max-w-48" />
        <Tooltip
          id="waka_approved_progress"
          place="top"
          className="z-10 max-w-48"
        />

        <div
          data-tooltip-id="waka_progress"
          data-tooltip-content={`This is how much time you've spent on projects in total  
                    (${(totalTimeSpent / 1080).toFixed(2)}% of the total needed)`}
          className="rounded-xl h-8 bg-hc-primary/40 z-80 absolute"
          style={{
            width: hasAchievedTime
              ? "100%"
              : Number(totalTimeSpent) / 1080 + "%",
          }}
        />
        <div
          data-tooltip-id="waka_approved_progress"
          data-tooltip-content={`This is how much time you've spent on approved projects.  
                    (${(totalApprovedTimeSpent / 1080).toFixed(2)}% of the total needed)`}
          className="rounded-xl h-8 bg-hc-primary absolute"
          style={{
            width: hasAchievedApprovedTime
              ? "100%"
              : Number(totalApprovedTimeSpent) / 1080 + "%",
          }}
        />
      </div>

      <p>
        Of those {(totalTimeSpent / 3600).toFixed(2)} hours,{" "}
        {(totalApprovedTimeSpent / 3600).toFixed(2)} hours are approved.
      </p>

      <p>
        That's about {Math.floor(totalApprovedTimeSpent / 1080) + "%"} of the 30
        hours you need to complete the Athena Award.
      </p>
      <p>
        {hasAchievedApprovedTime
          ? "Great work! You've completed the hour requirement for getting the Athena Award. Keep going for more prizes!"
          : "You're getting there :) Complete this to qualify for the Athena Award!"}
      </p>

      <div className="flex flex-row flex-wrap gap-4 my-2">
        {projects.map((project: any, index: number) => (
          <div
            key={index}
            className={`p-1 border rounded-lg ${project.status === "approved" ? "bg-lime-500/50" : project.status === "unreviewed" ? "bg-yellow-500/50" : "bg-white/50"}`}
          >
            {project.project_name_override || project.name}{" "}
            {(project.total_seconds / 3600).toFixed(2)} hours
          </div>
        ))}
      </div>
    </div>
  );
}
export default Waka;
