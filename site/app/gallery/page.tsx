"use client";
import GalleryMenu from "@/components/gallery/GalleryMenu";
import { useState } from "react";
import ProfileModal from "@/components/modals/profile/Modal";
import InfoModal from "@/components/modals/info/Modal";
import { STAGES } from "@/app/STAGES";
import { UXEvent, UXEventContext } from "@/components/context/UXStages";
import ShopModal from "@/components/modals/shop/Modal";
import LeaderboardModal from "@/components/modals/leaderboard/Modal";
import PodiumModal from "@/components/modals/podium/Modal";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Gallery() {
  // api calls for progress go here
  const searchParams = useSearchParams();
  const stage = Number(searchParams.get("stage"));
  const router = useRouter();

  const [module, setModule] = useState<
    (typeof STAGES)[number]["moduleName"] | "Intro" | "Onward!"
  >("Intro");

  useEffect(() => {
    if (stage >= 1 && stage <= 3) {
      setModule(STAGES[stage - 1]["moduleName"]);
      router.push("/gallery");
    } else if (stage === 4) {
      setModule("Onward!");
      router.push("/gallery");
    }
  }, []);

  const session = useSession();

  const [_uxEvent, setUXEvent] = useState<UXEvent>("map");
  return (
    <div className="w-screen h-screen">
      <UXEventContext.Provider value={[_uxEvent, setUXEvent]}>
        <ShopModal />
        <ProfileModal />
        <InfoModal />
        <LeaderboardModal />
        <PodiumModal/>
        <GalleryMenu
          module={module}
          setModule={
            setModule as (
              m: (typeof STAGES)[number]["moduleName"] | "Intro" | "Onward!",
            ) => void
          }
        ></GalleryMenu>
      </UXEventContext.Provider>
    </div>
  );
}
