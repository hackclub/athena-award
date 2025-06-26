import { Tooltip } from "react-tooltip";
import Modal from "@/components/panels/layout/PopUpModal";
import useSWR from "swr";
import { multiFetcher } from "@/services/fetcher";
import { useContext } from "react";
import { UXEventContext } from "@/components/context/UXStages";
import { useSession } from "next-auth/react";

export default function PodiumModal() {
  const session = useSession();
  const [uxEvent, setUXEvent] = useContext(UXEventContext);
  const { data, error, isLoading } = useSWR(
    ["/api/podium", "/api/user/my?query=team"],
    multiFetcher,
  );
  let podium: {[key: string]: { hours: number; members: string[] }} = {}
  let team: string = ""
  if (data) {
    podium = data[0]
    team = data[1]["message"]

  }

  return (
    <Modal
      customHeader={{ icon: "bank-account", heading: "The Panathenaic Games" }}
      uxEventName="podium"
      uxEvent={uxEvent}
      setUXEvent={setUXEvent}
      className="overflow-auto">
        <div>
            <p>Compete against other Athena Award acolytes in the <a href = "https://en.wikipedia.org/wiki/Panathenaic_Games" target="_blank">Panathenaic Games</a> to honour your deity, <a href = {`https://en.wikipedia.org/wiki/${team}`}>{team}</a>.</p>
            <p>Any projects shipped between June 24th and July 8th will count towards the Games. Winners earn an exclusive t-shirt!</p>
            <div className = "flex flex-row *:col-span-1 *:w-full gap-5 h-96 m-3 p-3">
                {Object.keys(podium).map((deity: any, index: number) =>
                    <div key = {index} className = "flex flex-col justify-end">
                    <Tooltip id = {String(index)} className = "max-w-72"/>
                    <div className = "text-center w-full">
                        <p className = "uppercase">{deity}</p>
                        <span className = "text-sm italic hidden sm:block">
                            { deity == "Neith" && "Egyptian goddess of warfare & creator of the world"}
                            { deity == "Durga" && "Hindu goddess of protection and strength"}
                            { deity == "Minerva" && "Roman goddess of wisdom and justice"}
                        </span>
                        <span className = "text-sm">{podium[deity as 'Neith' | 'Durga' | 'Minerva']["hours"]} hours coded</span>
                    </div>
                    <div data-tooltip-id = {String(index)} data-tooltip-content = { podium[deity as 'Neith' | 'Durga' | 'Minerva']["members"].slice(0,40).join(", ") + ` + ${podium[deity as 'Neith' | 'Durga' | 'Minerva']["members"].length - 41} more`} className = "bg-gold mt-auto justify-self-end" style = {{ height: podium[deity as 'Neith' | 'Durga' | 'Minerva']["hours"] + "%"}}/>
                    </div>
                )}
            </div>
        </div>
    </Modal>
  )
}
