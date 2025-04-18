import Modal from "@/components/panels/layout/PopUpModal";
import { UXEventContext } from "@/components/context/UXStages";
import { useContext } from "react";
import { FaXmark } from "react-icons/fa6";
import useSWR from "swr";
import { multiFetcher } from "@/services/fetcher";
import { useSession } from "next-auth/react";
export default function LeaderboardModal(){
    const session = useSession();
    const [ uxEvent, setUXEvent ] = useContext(UXEventContext);
    const { data, error, isLoading } = useSWR(["/api/leaderboard"], multiFetcher)

    let leaderboard = []
    if (data){
        leaderboard = data[0]
    }

    return (
        <Modal uxEventName="leaderboard" uxEvent={uxEvent} setUXEvent={setUXEvent} className="overflow-auto">
        <div>
            <div className="self-start *:align-middle flex gap-3 w-full align-middle md:sticky">
                <div className="*:align-middle h-fit w-full bg-black/25 p-2 rounded flex gap-4 grow">
                    <img src="https://icons.hackclub.com/api/icons/hackclub-red/list" className="size-[32px] self-center align-middle" alt="info" />
                    <div className="self-center align-middle text-xl sm:text-3xl playfair-display font-bold italic">Leaderboard</div>
                </div>
                <button className="" onClick={() => setUXEvent('map')}>
                    <FaXmark className="size-8 md:size-14 text-white" />
                </button>
            </div>

            <div className = "flex flex-col gap-2 py-3">
                {leaderboard.map((user: any, index: number) => 
                <div key = {index}>
                    {index == 70 ? <span className = "uppercase opacity-45 text-center flex justify-center py-3">stipend cutoff</span> : null}
                    <div className ={`${index >= 70 ? "bg-hc-primary/10" : "bg-hc-primary/40"} p-4 rounded-md flex flex-row justify-between w-full border border-white`}>
                        <span className = "flex flex-row items-center align-middle gap-4">{index+1}. <img src = {user.profile_picture} className = "inline size-5 rounded-full"/> {user.display_name} {user.slack_id === session.data?.slack_id ? <span className = "font-bold">(You)</span> : null} </span>
                        <span className = "self-end">
                            { (user.total_time_approved_projects).toFixed(2)} hours ({user.points} artifacts)
                        </span>
                    </div>
                </div>
                )}
            </div>

        </div>
    </Modal>

    )
}