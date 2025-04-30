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
    const { data, error, isLoading } = useSWR(["/api/shop", `/api/user/${session.data?.slack_id}/artifacts`], multiFetcher)
    const [uxEvent, setUXEvent] = useContext(UXEventContext)

    let shop, artifacts
    if (data){
        shop = data[0]
        artifacts = Math.floor(data[1]["message"])
    }


    return (
        shop && <Modal uxEventName="shop" uxEvent={uxEvent} setUXEvent={setUXEvent} className="overflow-auto">
            <div className = "flex flex-col gap-3">
            <div className="self-start *:align-middle flex gap-3 w-full align-middle md:sticky">
                <div className="*:align-middle h-fit w-full bg-black/25 p-2 rounded flex gap-4 grow">
                    <img src="https://icons.hackclub.com/api/icons/hackclub-red/bag-add" className="size-[32px] self-center align-middle" alt="info" />
                    <div className="self-center align-middle text-xl sm:text-3xl playfair-display font-bold italic">Shop</div>
                </div>
                <button className="" onClick={() => setUXEvent('map')}>
                    <FaXmark className="size-8 md:size-14 text-white" />
                </button>
            </div>
            <div>
                <p>Click on a placard to order a prize with your approved artifacts! You can earn more artifacts by spending time on projects and getting them approved.</p>

                <p>You have {artifacts} artifacts.</p>
                <div>
                    <div className = "my-6">
                        <div className = {`p-6 my-6 flex flex-row flex-wrap relative h-full justify-center items-center`}>
                            {shop.map((prize: any, idx: number) => 
                                <div key={idx+1 + "_" + String(idx+1)+"_painting"} className = {`sm:basis-1/2 md:basis-1/3 text-center my-10 z-50`}>
                                    <Painting 
                                        showCaptionOnSmall 
                                        index={idx+1 + "_" + String(idx+1)+"_painting"}
                                        tooltip={prize.description}
                                        className="inline" key= {idx} image={prize.image}
                                        description={prize.item_friendly_name}
                                        descriptionBottom={`${prize.price} artifacts`}
                                        link={`https://forms.hackclub.com/athena-award-orders?item=${prize.item_name}`}
                                        />
                                </div>)}
                        </div>
                    </div>
                

                </div>

            </div>
            </div>
        </Modal>
    )
}