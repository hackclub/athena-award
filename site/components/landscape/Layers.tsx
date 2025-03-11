// defunct 
'use client';
import { useState, useEffect, ReactNode, Fragment, useRef } from "react";
import Image from "next/image";
import Action from "./Action";
import { ActionData, Page } from "@/types/Pathways";
import DevelopmentSettings from "@/DEVELOPMENT_SETTINGS";
import classNames from "classnames";


export default function Layers({ data, children }:{ data: Page | { layers: string[], actions: ActionData[] }, children?: ReactNode }) {
  const { ANIMATE_LAYERS } = DevelopmentSettings;
  const { layers, actions } = data;
  const layerCollectionRef = useRef<HTMLDivElement>(null!);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [divPosition, setDivPosition] = useState({ x: 0, y: 0 });
  const [win, setWindow] = useState<Window>(null!);
  
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    setWindow(window);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  function handleMouseMove(event: MouseEvent) {
    if (!ANIMATE_LAYERS) return;
    const { clientX: mouseX, clientY: mouseY } = event;
    const centerX = innerWidth / 2;
    const centerY = innerHeight / 2;
    
    const relativePosition = {
      x: mouseX - centerX,
      y: mouseY - centerY
    };

    setMousePosition(relativePosition);
    setDivPosition({
      x: (relativePosition.x / 10),
      y: (relativePosition.y / 10)
    });
  };

  return (
    <>
    <div className="w-screen h-screen relative top-0 left-0 overflow-hidden">
      {
        layers.map((layer, i) => (
          <div className={classNames({
            "w-[115vw] h-[115vh] absolute left-[-7.5vw] top-[-7.5vh] flex justify-center items-center overflow-visible transition-all ease-out pointer-events-none": true,
          })} key={i} style={{
            // top layers (ex 5, 6) should be moving the fastest while lower layers (ex 0, 1) should be moving slower
            // we want for the max to be 1 and the min to be about what, 1/4?
            // map: i on [0, length) to [0.25, 1]
            // (i) / (length - 1) * (0.75) + 0.25
            transform: `translate(${((i / (layers.length - 1) * 0.75 + 0.25) * -divPosition.x) * (1440 / win?.innerWidth)}px, ${((i / (layers.length - 1) * 0.75) -divPosition.y) * (1024 / win?.innerHeight)}px)`
            // top: -1 * (divPosition.top * ((i === 0 ? 0.8 : i) * 0.5) + 0.3),
            // left: -1 * (divPosition.left * ((i === 0 ? 0.8 : i) * 0.5) + 0.3),
          }}>
            <Image
              src={layer}
              alt=""
              width={1728}
              height={1117}
              className={classNames({
                "max-w-[unset]": true,
                "w-[115vw] h-auto": true // (innerHeight * 1.15) * (1440 / 1024) < innerWidth,
                // "ml-[-7.5vw] w-[115vw] h-auto": (window.innerHeight * 1.15) * (1440 / 1024) < window.innerWidth,
                // "ml-[-7.5vw] mt-[-7.5vh] h-[115vh] w-auto": (window.innerWidth * 1.15) * (1024 / 1440) < window.innerHeight,
              })}
            />
          </div>
        ))
      }
    </div>
      {
        actions.map((action, i) => (
          <Fragment key={i}>
            <Action percentX={action.x} percentY={action.y} title={action.title} route={action.route} follow={{
              src: layers.length - 1,
              basePosition: divPosition
            }} icon={action.icon}>
              {children}
            </Action>
          </Fragment>
        ))
      }
    </>
  )
}

function VignetteOverlay() {
  return (
    <div className="fixed inset-0 z-[999] opacity-50 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/0 to-black/80"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/0 to-black/80"></div>
    </div>
  )
}