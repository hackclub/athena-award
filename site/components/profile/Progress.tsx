import { useSession } from "next-auth/react";
import { Tooltip } from "react-tooltip";
import { fetcher } from "@/services/fetcher";
import useSWR from "swr";
import { Warning } from "../panels/add-ons/Callout";
// TO DO:
// add a scrolling list of point-giving initiatives (including completed stages for later)

export function Progress(){
    const session = useSession();
    let points
      const { data, error, isLoading} = useSWR(`/api/user/${session.data!.slack_id}/points`, fetcher)  
      if (error){
        return (<div><Warning title = "Error">Wasn't able to fetch your points.</Warning></div>)
      }
      if (isLoading){
        return (<div>Loading data...</div>)
      }
      points = (data as any)["message"] // fix types

    return (
        <>
        <h2> {Number(points)} points earned</h2>
        <Tooltip id="points_progress" place="right" className="z-10"/>

        <div className="rounded-xl w-full h-8 bg-gray-200 my-3">
          <div data-tooltip-id="points_progress" data-tooltip-content={points + "%"} className= "rounded-xl h-8 bg-hc-primary" style= {{width: Number(points) + "%"}}/>
        </div>
        <p>You can get points by completing <b>stages</b> or through certain <b>achievements.</b> Once you get enough points, you're automatically eligible for prizes.</p>

        </>
    )
} 