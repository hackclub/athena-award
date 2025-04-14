// defunct
import ACHIEVEMENTS_LIST from "@/app/Achievements";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "@/services/fetcher";
import { Warning } from "@/components/panels/add-ons/Callout";


export function Achievements(){
  const session = useSession();
  const { data, error, isLoading} = useSWR(`/api/user/${session.data!.slack_id}/achievements`, fetcher) 
  if (error){
    return (<Warning title = "Error">{error.info.message}</Warning>)
  }
  if (isLoading){
    return (<div>Loading achievements...</div>)
  }
  const achievements = (data as any)["message"]
    return (
        <>
        <p className="text-2xl text-hc-primary">You've completed { achievements ? achievements.split(",").length : 0} out of {ACHIEVEMENTS_LIST.length} achievements!</p>
        <p className = "py-2">Achievements are smaller, bonus goals that you can complete for fun (or bragging rights). Some achievements will give you extra artifacts towards the Athena Award. </p>
        <p className = "py-2">Completed an achievement? Tag <b className = "text-hc-primary">@phthallo</b> or <b className = "text-hc-primary">@phaedra</b> (we don't bite) on the Hack Club Slack to get your artifacts.</p>
        <div className = "flex flex-col gap-3">
        { (ACHIEVEMENTS_LIST).map((achievement: any, index) => ( // fix types
            <div key={index} className = {`${achievements!.includes(String(achievement.id)) ? "bg-green-400/30" : "bg-gray-200"} border border-gray-400 p-2 rounded-lg flex flex-row gap-2`}>
                <img className = "h-10 my-auto" src = {achievement.icon}/>
                <div className ="w-full">
                    <span className = "flex flex-row justify-between">
                    <b>{achievement.title}</b> 
                    <a href = {achievement.link}><img className="inline my-auto h-6" src = "https://icons.hackclub.com/api/icons/hackclub-red/external"/></a>
                    </span>
                    <p>{achievement.description}</p>
                    <div className = "flex flex-col sm:flex-row justify-between">
                      <span className = "italic font-bold"> { achievements!.includes(String(achievement.id)) ? "Completed!" : "Locked" }</span>
                      <span className = "italic"><b>Reward:</b> {achievement.reward}</span>
                    </div>
                </div>

                
            </div>
        ))}
        </div>
        </>
    )
}