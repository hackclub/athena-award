import { useSession } from "next-auth/react";
import { Tooltip } from "react-tooltip";
import { multiFetcher } from "@/services/fetcher";
import useSWR from "swr";
import { Warning } from "@/components/panels/add-ons/Callout";

export function Progress() {
  const session = useSession();
  let artifacts, shippedProjects, totalApprovedTimeSpent;
  const { data, error, isLoading } = useSWR(
    [
      `/api/user/my/points`,
      `/api/user/my/projects?query=total_time`,
    ],
    multiFetcher,
  );
  if (error) {
    return (
      <div>
        <Warning title="Error">Wasn't able to fetch your progress.</Warning>
      </div>
    );
  }
  if (isLoading) {
    return <div>Loading progress data...</div>;
  }

  if (data) {
    artifacts = (data[0] as any)["message"]; // fix types
    shippedProjects = (data[1] as any)["message"].filter(
      (project: any) => project.status === "approved",
    );
    totalApprovedTimeSpent = shippedProjects.reduce(
      (pSum: any, project: any) => pSum + (project.total_seconds || 0),
      0,
    );
  }

  return (
    <div>
      <h2 className="text-lg sm:text-2xl bg-white/10 text-white p-2 rounded">
        {" "}
        {Number(artifacts)}% Athena Award completion{" "}
      </h2>
      <Tooltip id="artifacts_progress" place="right" className="z-10" />

      <div className="rounded-xl w-full h-8 bg-gray-200 my-3 relative">
        <div
          data-tooltip-id="artifacts_progress"
          data-tooltip-content={artifacts + "%"}
          className={`absolute rounded-l-xl ${Number(artifacts) >= 100 ? "rounded-r-xl" : null} h-8 bg-hc-primary z-10 `}
          style={{ width: Number(artifacts) + "%" }}
        />
        <div
          className="h-8 absolute z-20 border border-b-0 border-t-0 border-l-0 border-hc-primary brightness-150 border-r-4"
          aria-valuemax={100}
          style={{ width: "25%" }}
        />
        <div
          className="h-8 absolute z-20 border border-b-0 border-t-0 border-l-0 border-hc-primary brightness-150 border-r-4"
          aria-valuemax={100}
          style={{ width: "50%" }}
        />
        <div
          className="h-8 absolute z-20 border border-b-0 border-t-0 border-l-0 border-hc-primary brightness-150 border-r-4"
          aria-valuemax={100}
          style={{ width: "75%" }}
        />
      </div>
      <ul className="list-disc list-inside">
        <li>
          Look at you go! You only need {100 - Number(artifacts)}% more to
          qualify for an invite to the New York City hackathon.{" "}
        </li>
        <li>
          {shippedProjects.length} projects approved out of 3 required for the
          Athena Award
        </li>
        <li>
          {(totalApprovedTimeSpent / 3600).toFixed(2)} hours spent out of the 30
          hours required for the Athena Award.
        </li>
      </ul>
    </div>
  );
}
