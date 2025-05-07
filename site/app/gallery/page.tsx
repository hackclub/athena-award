"use client";
import Background from "@/components/landscape/Background";
import GalleryMenu from "@/components/gallery/GalleryMenu";
import { useState, useContext } from "react";
import ProfileModal from "@/components/modals/profile/Modal";
import InfoModal from "@/components/modals/info/Modal";
import { SessionProvider } from "next-auth/react";
import { STAGES } from "@/app/STAGES";
import { UXEvent, UXEventContext } from "@/components/context/UXStages";
import ShopModal from "@/components/modals/shop/Modal";
import LeaderboardModal from "@/components/modals/leaderboard/Modal";

export default function Gallery() {
  // api calls for progress go here
  const [module, setModule] = useState<"Start hacking" | "Your second project" | "Your final project">(
    "Intro" as (typeof STAGES)[number]["moduleName"],
  );
  const [profileIsOpen, setProfileIsOpen] = useState(false);
  const [_uxEvent, setUXEvent] = useState<UXEvent>("map");
  return (
    <div className="w-screen h-screen">
      <UXEventContext.Provider value={[_uxEvent, setUXEvent]}>
        <ShopModal />
        <ProfileModal />
        <InfoModal />
        <LeaderboardModal />
        <GalleryMenu module={module} setModule={setModule as (m: (typeof STAGES)[number]["moduleName"]) => void}></GalleryMenu>
      </UXEventContext.Provider>
    </div>
  );
}
