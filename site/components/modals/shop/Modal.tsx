import Painting from "@/components/panels/Painting";
import Modal from "@/components/panels/layout/PopUpModal";
import useSWR from "swr";
import { multiFetcher } from "@/services/fetcher";
import { useContext } from "react";
import { UXEventContext } from "@/components/context/UXStages";
import { FaXmark } from "react-icons/fa6";
import { useSession } from "next-auth/react";


export default function ShopModal(){
    const session = useSession()
    const { data, error, isLoading } = useSWR(["/api/shop", `/api/user/${session.data?.slack_id}/points`], multiFetcher)
    const [uxEvent, setUXEvent] = useContext(UXEventContext)

    let prizeStage, points: number
    if (data){
        prizeStage = data[0]
        points = data[1]["message"]
    }


    return (
        prizeStage && <Modal uxEventName="shop" uxEvent={uxEvent} setUXEvent={setUXEvent} className="overflow-auto">
            <div className = "flex flex-col gap-3">
            <div className="self-start *:align-middle flex gap-3 w-full align-middle md:sticky">
                <div className="*:align-middle h-fit w-full bg-black/25 p-2 rounded flex gap-4 grow">
                    <img src="https://icons.hackclub.com/api/icons/hackclub-red/person" className="size-[32px] self-center align-middle" alt="info" />
                    <div className="self-center align-middle text-xl sm:text-3xl playfair-display font-bold italic">Prizes</div>
                </div>
                <button className="" onClick={() => setUXEvent('map')}>
                    <FaXmark className="size-8 md:size-14 text-white" />
                </button>
            </div>
            <div>
                <p>Select one prize from each stage after completion.</p>
                <div>
                    {[...Array(3)].map((_, index) => 
                    <div key={index} className = "my-6">
                        <h1 className = "text-2xl md:text-4xl">Stage {index+1}</h1>
                        <div className = {`p-6 my-6 flex flex-row flex-wrap relative h-full justify-center items-center ${points/25 >= index+1 ? "" : "select-none"}`}>
                            <h1 className = {`${points/25 >= index+1 ? "hidden" : "absolute text-4xl text-center self-center place-self-center m-auto z-50 w-full h-full p-4 bg-gray-800/65"}`}>locked</h1>
                            {prizeStage.filter((prize: any) => prize.fields.stage == index+1).map((prize: any, index: number) => <Painting showCaptionOnSmall className="inline grow sm:basis-1/2 md:basis-1/3" key= {index} image="https://placehold.co/600x400">{prize.fields.item_friendly_name}</Painting>)}
                        </div>
                    </div>
                    )}
                </div>

            </div>
            </div>
        </Modal>
    )
}