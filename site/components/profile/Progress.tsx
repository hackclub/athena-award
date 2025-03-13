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
        <div>
        <h2> {Number(artifacts)} artifacts earned </h2>
        <Tooltip id="artifacts_progress" place="right" className="z-10"/>

        <div className="rounded-xl w-full h-8 bg-gray-200 my-3 relative">
          <div data-tooltip-id="artifacts_progress" data-tooltip-content={artifacts + "%"} className= "absolute rounded-xl h-8 bg-hc-primary z-10" style= {{width: Number(artifacts) + "%"}}/>
          <div className= "h-8 absolute z-20 border border-b-0 border-t-0 border-l-0 border-hc-primary/75 border-r-4" aria-valuemax={100} style= {{width: "25%"}}/>
          <div className= "h-8 absolute z-20 border border-b-0 border-t-0 border-l-0 border-hc-primary/75 border-r-4" aria-valuemax={100} style= {{width: "50%"}}/>
          <div className= "h-8 absolute z-20 border border-b-0 border-t-0 border-l-0 border-hc-primary/75 border-r-4" aria-valuemax={100} style= {{width: "75%"}}/>

        </div>
        <ul className = "list-disc list-inside *:text-sm *:sm:text-lg">
          <li>Get prizes through earning our currency, <b className = "text-hc-primary">artifacts</b>! You can get artifacts by successfully completing a <b className = "text-hc-primary">stage</b> or through <b className = "text-hc-primary">achievements.</b></li>
          <li>Every <b className = "text-hc-primary">25 artifacts = guaranteed prize</b>. Bonus artifacts can be redeemed for other cool prizes.</li>
          <Tooltip id = "travel"/>
          <li data-tooltip-id="travel" data-tooltip-content="Accommodation and meals fully covered. We'll help you with visas, flights and anything else you might need to enter the country!"><b className = "text-hc-primary">100 artifacts</b> makes you eligible for a travel grant for an <b className = "text-hc-primary">exclusive hackathon</b> in New York City!</li>
        </ul>
        </div>
    )
} 