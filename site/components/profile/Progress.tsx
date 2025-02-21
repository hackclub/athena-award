import { useSession } from "next-auth/react";
import { Tooltip } from "react-tooltip";
import { fetcher } from "@/services/fetcher";
import useSWR from "swr";
import { Warning } from "../panels/add-ons/Callout";
// TO DO:
// add a scrolling list of point-giving initiatives (including completed stages for later)

export function Progress(){
    const session = useSession();
    let artifacts
      const { data, error, isLoading} = useSWR(`/api/user/${session.data!.slack_id}/points`, fetcher)  
      if (error){
        return (<div><Warning title = "Error">Wasn't able to fetch your artifacts.</Warning></div>)
      }
      if (isLoading){
        return (<div>Loading progress data...</div>)

      }
      artifacts = (data as any)["message"] // fix types

    return (
        <>
        <h2> {Number(artifacts)} artifacts earned</h2>
        <Tooltip id="artifacts_progress" place="right" className="z-10"/>

        <div className="rounded-xl w-full h-8 bg-gray-200 my-3">
          <div data-tooltip-id="artifacts_progress" data-tooltip-content={artifacts + "%"} className= "rounded-xl h-8 bg-hc-primary" style= {{width: Number(artifacts) + "%"}}/>
        </div>
        <p>Artifacts are our currency.</p>
        <p>You can get artifacts by completing <b>stages</b> or through certain <b>achievements.</b> Once you get enough artifacts, you're automatically eligible for prizes.</p>

        </>
    )
} 