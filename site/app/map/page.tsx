'use client';
import Background from "@/components/landscape/Background";
import MapMenu from "@/components/map/MapMenu";
import { useState, useContext } from "react";
import { ProfileIsOpenContext } from "@/components/island/Modal";
import ProfileModal from "@/components/profile/Modal";
import { SessionProvider } from "next-auth/react"
import { STAGES } from "@/types/Pathways";

export default function Map() {
  // api calls for progress go here
  const [module, setModule] = useState("Start hacking" as typeof STAGES[number]['moduleName']);
  const [ profileIsOpen, setProfileIsOpen ] = useState(false)
  return (
    <div className="w-screen h-screen">
      <ProfileIsOpenContext.Provider value = {{profileIsOpen: profileIsOpen, setProfileIsOpen: setProfileIsOpen }}>
        <ProfileModal/>
        <MapMenu module={module} setModule={setModule}>
        </MapMenu>
      </ProfileIsOpenContext.Provider>
    </div>
  )
}