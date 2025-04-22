'use client';
import Background from "@/components/landscape/Background";
import MapMenu from "@/components/map/MapMenu";
import { useState, useContext } from "react";
import ProfileModal from "@/components/modals/profile/Modal";
import InfoModal from "@/components/modals/info/Modal";
import { SessionProvider } from "next-auth/react"
import { STAGES } from "@/app/STAGES";
import { UXEvent, UXEventContext } from "@/components/context/UXStages";
import ShopModal from "@/components/modals/shop/Modal";
import LeaderboardModal from "@/components/modals/leaderboard/Modal";

export default function Map() {
  // api calls for progress go here
  const [module, setModule] = useState("Start hacking" as typeof STAGES[number]['moduleName']);
  const [ profileIsOpen, setProfileIsOpen ] = useState(false)
  const [_uxEvent, setUXEvent] = useState<UXEvent>('map')
  return (
    <div className="w-screen h-screen">
      <UXEventContext.Provider value={[_uxEvent, setUXEvent]}>
        <ShopModal/>
        <ProfileModal />
        <InfoModal/>
        <LeaderboardModal/>
        <MapMenu module={module} setModule={setModule}>
        </MapMenu>
      </UXEventContext.Provider>
    </div>
  )
}