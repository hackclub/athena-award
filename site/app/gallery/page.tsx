"use client";
import GalleryMenu from "@/components/gallery/GalleryMenu";
import { useState } from "react";
import ProfileModal from "@/components/modals/profile/Modal";
import InfoModal from "@/components/modals/info/Modal";
import { STAGES } from "@/app/STAGES";
import { UXEvent, UXEventContext } from "@/components/context/UXStages";
import ShopModal from "@/components/modals/shop/Modal";
import LeaderboardModal from "@/components/modals/leaderboard/Modal";
import { useSession } from "next-auth/react";

export default function Gallery() {
  // api calls for progress go here
  const [module, setModule] = useState<(typeof STAGES)[number]["moduleName"] | "Intro" | "Onward!">(
      "Intro",
  );
  const session = useSession();
  
  const [_uxEvent, setUXEvent] = useState<UXEvent>("map");
  return (
    <div className="w-screen h-screen">
      <UXEventContext.Provider value={[_uxEvent, setUXEvent]}>
        <ShopModal />
        <ProfileModal />
        <InfoModal />
        <LeaderboardModal />
        <GalleryMenu module={module} setModule={setModule as (m: (typeof STAGES)[number]["moduleName"] | "Intro" | "Onward!") => void}></GalleryMenu>
      </UXEventContext.Provider>
    </div>
  );
}
