// defunct
'use client';
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { Fragment, ReactNode, useEffect, useState } from "react";
import SidePanel from "../panels/layout/SidePanel";
import Icon, { glyphs } from "@hackclub/icons";
import { motion } from "motion/react";
import { FaLightbulb, FaMagnifyingGlass, FaPlus } from "react-icons/fa6"
import { IconType } from "react-icons";

interface ActionProps {
  title: string
  children: ReactNode
  percentX: number;
  percentY: number;
  icon?: 'lightbulb' | 'magnifying-glass';
}

export default function Action(props: ActionProps) {
  const router = useRouter();
  const { percentX, percentY } = props;
  const [openPanel, setOpenPanel] = useState(false);
  const [transformation, setTransformation] = useState({ x: 0, y: 0 });
  const [win, setWindow] = useState<Window>(null!); // this + the useeffect is to silence "window is not defined" errors

  const handleClick = () => {
    setTimeout(() => {
      setOpenPanel(true);
    }, 0);
  }

  useEffect(() => {
    const handleMouseMovement = (e: MouseEvent) => {
      setTransformation({
        x: e.clientX,
        y: e.clientY
      });
    }

    setWindow(window);
    window.addEventListener('mousemove', handleMouseMovement);
  }, []);

  return (
    <>
      <motion.button
        className="h-16 p-1 rounded-full border-4 border-white bg-hc-primary/40 hover:bg-hc-primary-dull absolute z-[5] transition-[max-width] ease-out max-w-16 min-w-16 pointer-events-auto flex items-center gap-1 overflow-hidden justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClick}
        style={{
          top: `${(percentY * 1.15) - 7.5}vh`,
          left: `${(percentX * 1.15) - 7.5}vw`,
          transform: `translate(${transformation.x * 0.05 * (1440 / win?.innerWidth)}px, ${transformation.y * 0.05 * (1024 / win?.innerHeight)}px)`
        }}
      >
        {props.icon === 'magnifying-glass' && <FaMagnifyingGlass className="size-8 text-white" />}
        {props.icon === 'lightbulb' && <FaLightbulb className="size-8 text-white" />}
        {/* <Icon glyph={"controls"} size={32} /> */}
      </motion.button>
      <SidePanel
        openPanel={openPanel} setOpenPanel={setOpenPanel}
        title={props.title}
      >
        {props.children}
      </SidePanel>
    </>

  )
}