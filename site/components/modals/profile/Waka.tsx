import useSWR from "swr"
import { useSession } from "next-auth/react"
import { fetcher } from "@/services/fetcher";
import { Warning } from "@/components/panels/add-ons/Callout";
import { Tooltip } from "react-tooltip";

export function Waka(){
    const session = useSession();
    const { data, error, isLoading} = useSWR(`/api/user/${session.data!.slack_id}/projects?query=total_time`, fetcher) 
    let projects, totalTimeSpent, totalApprovedTimeSpent
    if (data){
        projects = (data as any)["message"]
        totalTimeSpent = projects.reduce((pSum: any, project: any) => pSum + project.total_seconds, 0)
        totalApprovedTimeSpent = projects.reduce((pSum: any, project: any) => project.status === "approved" ? pSum + (project.total_seconds || 0) : pSum, 0)
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
                    "Only time tracked using Hackatime is counted here! " + 
                    (totalTimeSpent / 1080).toFixed(2) + "%" 
                    } className= "rounded-xl h-8 bg-hc-primary" style= {
                        {
                            width: hasAchievedTime ? "100%" : Number(totalTimeSpent) / 1080 + "%"
                        }}/>
            </div>

            Of those {(totalTimeSpent/3600).toFixed(2)} hours, {(totalApprovedTimeSpent/3600).toFixed(2)} hours are approved.

            That's about {Math.floor(totalApprovedTimeSpent / 1080) + "%"} of the 30 hours you need to complete the Athena award. { hasAchievedTime ? "Great work! You've earned 25 artifacts from this." : "You're getting there :) Complete this for 25 artifacts!"}{' '}
            
            <div className = "flex flex-row flex-wrap gap-4 my-2">{projects.map((project: any, index: number) => <div key={index}  className = {`p-1 border rounded-lg ${project.status === "approved" ? "bg-green-500/30" : project.status === "unreviewed" ? "bg-yellow-500/30" : "bg-white/30"}`}>{project.name} {(project.total_seconds/3600).toFixed(2)} hours</div> )}</div> 
        </div>
         )
}
export default Waka