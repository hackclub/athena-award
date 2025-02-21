import useSWR from "swr"
import { useSession } from "next-auth/react"
import { fetcher } from "@/services/fetcher";
import { Warning } from "../panels/add-ons/Callout";
import { Tooltip } from "react-tooltip";

export function Waka(){
    const session = useSession();
    const { data, error, isLoading} = useSWR(`/api/user/${session.data!.slack_id}/waka`, fetcher)  
    if (error){ 
        if (error.status === 403){ // handle user not having public data
            return (
                <div>
                    <h2>Time spent coding</h2>
                    <Warning title = "Your WakaTime data isn't public!">
                        WakaTime lets us track how long you've spent on coding. 
                    </Warning>
                    To make your WakaTime data public, head to <a href = "https://waka.hackclub.com">Hack Club's WakaTime instance</a> and follow these steps. 
                        <ul className = "list-decimal list-inside py-2">
                            <li>Use either of the follwing credentials to log in</li>
                            <div className="indent-4"><b>Email/Slack ID: </b> <code>{session.data!.user.email}</code> or <code>{session.data!.slack_id}</code></div>
                            <li>Reset your password by pressing <b>Forgot Password?</b></li>
                            <li>Log in, go to <b>Settings {'>'} Permissions</b> and change <b>Time Range</b> to <code>-1</code>. Save your changes.</li>
                        </ul>
                    Happy hacking!
                </div>)

        }
        return (<div>Something went wrong when loading your WakaTime data.</div>)
    }
    if (isLoading){
        return (<div>Loading WakaTime data...</div>)

    }

    const useableData = (data as any)["data"]
    const hasAchievedTime = useableData["total_seconds"] / 2880 > 100

    return (
        <div>
            <h2>{useableData["human_readable_total"]} spent coding</h2>
            <div className="rounded-xl w-full h-8 bg-gray-200 my-3">
                <Tooltip id="waka_progress" place="left" className="z-10"/>
                <div data-tooltip-id="waka_progress" data-tooltip-content={
                    useableData["human_readable_total"] + " or " + 
                    Math.floor(useableData["total_seconds"] / 2880) + "%"
                    } className= "rounded-xl h-8 bg-hc-primary" style= {
                        {
                            width: hasAchievedTime ? "100%" : Number(useableData["total_seconds"]) / 2880 + "%"
                        }}/>
            </div>
            That's about {Math.floor(useableData["total_seconds"] / 2880) + "%"} of the 80 hours you need to complete the Athena award. { hasAchievedTime ? "Great work!" : "You're getting there :)"}
        </div>
         )
}
export default Waka