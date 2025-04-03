import useSWR from "swr"
import { useSession } from "next-auth/react"
import { fetcher } from "@/services/fetcher";
import { Warning } from "../panels/add-ons/Callout";
import { Tooltip } from "react-tooltip";

export function Waka(){
    const session = useSession();
    const { data, error, isLoading} = useSWR(`/api/user/${session.data!.slack_id}/projects?query=total_time`, fetcher) 
    let projects, totalTimeSpent
    if (data){
        projects = (data as any)["message"]
        totalTimeSpent = (data as any)["message"].reduce((pSum: any, project: any) => pSum + project.total_seconds, 0)
    }
    if (error){ 
        if (error.status !== 200){ // handle user not having a profile
            return (
                <div>
            <h2 className = "bg-white/20 p-2 text-white text-lg sm:text-2xl">Time spent coding</h2>
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

    const hasAchievedTime = totalTimeSpent / 1080 > 100

    return (
        <div>
            <h2 className = "bg-white/20 p-2 text-white text-lg sm:text-2xl">{ (totalTimeSpent / 3600).toFixed(2) } hours spent coding on your projects.</h2>
            <div className="rounded-xl w-full h-8 bg-gray-200 my-3">
                <Tooltip id="waka_progress" place="left" className="z-10"/>
                <div data-tooltip-id="waka_progress" data-tooltip-content={
                    (totalTimeSpent / 3600).toFixed(2) + " or " + 
                    (totalTimeSpent / 1080).toFixed(2) + "%"
                    } className= "rounded-xl h-8 bg-hc-primary" style= {
                        {
                            width: hasAchievedTime ? "100%" : Number(totalTimeSpent) / 1080 + "%"
                        }}/>
            </div>
            That's about {Math.floor(totalTimeSpent / 1080) + "%"} of the 30 hours you need to complete the Athena award. { hasAchievedTime ? "Great work!" : "You're getting there :)"}
            <div className = "flex flex-row flex-wrap gap-4 my-2">{projects.map((project: any, index: number) => <div key={index}  className = "p-1 border rounded-lg bg-white/30">{project.name} {(project.total_seconds/3600).toFixed(2)} hours</div> )}</div> 
        </div>
         )
}
export default Waka