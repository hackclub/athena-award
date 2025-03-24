import useSWR from "swr"
import { useSession } from "next-auth/react"
import { fetcher } from "@/services/fetcher";
import { Warning } from "../panels/add-ons/Callout";
import { Tooltip } from "react-tooltip";

export function Waka(){
    const session = useSession();
    const { data, error, isLoading} = useSWR(`/api/user/${session.data!.slack_id}/waka?query=${session.data!.user.email}`, fetcher)  
    if (error){ 
        if (error.status === 404){ // handle user not having a profile
            return (
                <div>
                    <h2>Time spent coding</h2>
                    <Warning title = "Your Hackatime data isn't public!">
                        Hackatime lets us track how long you've spent on coding. 
                    </Warning>
                        <ul className = "list-decimal list-inside py-2">
                            <li>To set up Hackatime, head to <a target="_blank"href = "https://hackatime.hackclub.com/">Hackatime</a> and follow these steps. </li>
                            <li>Make sure you have the Wakatime extension installed in your code editor, then follow the instructions <a target="_blank" href = "https://hackatime.hackclub.com/my/wakatime_setup">here</a></li>
                            <li>Type a bit in your code editor, then check Hackatime again to see your data appear.</li>
                        </ul>
                    Happy hacking!
                </div>)

        }
        return (<div>Something went wrong when loading your WakaTime data.</div>)
    }
    if (isLoading){
        return (<div>Loading WakaTime data...</div>)

    }

    const useableData = (data as any)
    console.log(useableData)
    const hasAchievedTime = useableData / 1080 > 100

    return (
        <div>
            <h2>{ (useableData / 3600).toFixed(2) } hours spent coding</h2>
            <div className="rounded-xl w-full h-8 bg-gray-200 my-3">
                <Tooltip id="waka_progress" place="left" className="z-10"/>
                <div data-tooltip-id="waka_progress" data-tooltip-content={
                    (useableData / 3600).toFixed(2) + " or " + 
                    Math.floor((useableData / 3600) / 1080) + "%"
                    } className= "rounded-xl h-8 bg-hc-primary" style= {
                        {
                            width: hasAchievedTime ? "100%" : Number(useableData) / 1080 + "%"
                        }}/>
            </div>
            That's about {Math.floor(useableData / 1080) + "%"} of the 30 hours you need to complete the Athena award. { hasAchievedTime ? "Great work!" : "You're getting there :)"}
        </div>
         )
}
export default Waka