// defunct
'use client';
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { Fragment, ReactNode, useEffect, useState } from "react";
import SidePanel from "../panels/layout/SidePanel";
import Icon, { glyphs } from "@hackclub/icons";
import { AdventureChapter } from "@/types/Pathways";

interface MapTransitionProps {
  route: `/${AdventureChapter}/${string}`,
  title: string;
}

interface SidePanelProps {
  route: 'side-panel';
  title: string
  children: ReactNode
}

type ActionProps = (MapTransitionProps | SidePanelProps) & {
  
  /**
   * Enables following of a specific layer in mouse movement
   */
  follow: {
    src: number,
    basePosition: {
      x: number,
      y: number,
    },
  };
  percentX: number;
  percentY: number;
  icon?: keyof typeof glyphs;
}

export default function Action(props: ActionProps) {
  const router = useRouter();
  const { route, percentX, percentY, follow } = props;
  const [followData, setFollowData] = useState(follow);
  const [isHovered, setIsHovered] = useState(false);
  const [openPanel, setOpenPanel] = useState(false);
  const [win, setWindow] = useState<Window>(null!); // this + the useeffect is to silence "window is not defined" errors

  const handleClick = () => {
    switch (route) {
      case "side-panel": {
        setTimeout(() => {
          setOpenPanel(true);
        }, 0);
      }
      break;
      default: {
        router.push(`/adventure/${props.route}`);
      }
    }
  }

  useEffect(() => {
    setWindow(window);
    setFollowData(follow);
  }, [follow]);

  return (
    <>
    <button 
      className="h-16 p-1 hover:pr-3 rounded-full border-4 border-white bg-hc-primary absolute z-[30] transition-[max-width] ease-out hover:w-fit hover:max-w-96 max-w-16 min-w-16 pointer-events-auto flex items-center gap-1 hover:cursor-pointer overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        top: `${(percentY * 1.15) - 7.5}vh`,
        left: `${(percentX * 1.15) - 7.5}vw`,
        transform: `translate(${-props.follow.basePosition.x * (1440 / win?.innerWidth)}px, ${-props.follow.basePosition.y * (1024 / win?.innerHeight)}px)`
      }}
    >
      <span className="font-bold text-white whitespace-nowrap">
        <img src={`https://icons.hackclub.com/api/icons/white/${props.icon || 'rep'}`} className="size-[48px]" alt="" />   
      </span>
      <Transition
        show={isHovered}
        enter="transition-all overflow-hidden duration-100 delay-[250ms]"
        enterFrom="opacity-0 w-0"
        enterTo="opacity-100 w-fit"
        leave="transition-all overflow-hidden duration-100"
        leaveFrom="opacity-100 w-fit"
        leaveTo="opacity-0 w-0"
      >
        <span className="text-white whitespace-nowrap text-lg uppercase">{props.title}</span>
      </Transition>
    </button>
    { route === 'side-panel' && (
      <SidePanel
        openPanel={openPanel} setOpenPanel={setOpenPanel}
        title={props.title}
      >
        {props.children}
      </SidePanel>
    )}
    </>

  )
}