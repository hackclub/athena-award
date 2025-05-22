"use client";

import { STAGES } from "@/app/STAGES";
import Background from "./Background";
import { Fragment, useState, useEffect } from "react";
import Action from "./Action";
import { AnimatePresence, motion } from "motion/react";

export default function ActionableScene({
  shouldAnimate = false,
  sourceScene = "https://prod.spline.design/0vuYDA6geatVNNiC/scene.splinecode",
  module = "Start hacking",
  setFullscreen,
}: {
  shouldAnimate?: boolean;
  sourceScene?: string;
  module: (typeof STAGES)[number]["moduleName"];
  setFullscreen: (b: boolean) => void;
}) {
  const actions = STAGES.find((stage) => stage.moduleName === module)!.actions;
  const [isLandscape, setIsLandscape] = useState(true);

  useEffect(() => {
    // Function to check if we're in landscape mode
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    // Check on mount
    checkOrientation();

    // Add event listener for resize
    window.addEventListener('resize', checkOrientation);

    // Cleanup
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  return (
    <div className="fixed w-screen h-screen z-0">
      <Background 
        shouldAnimate={shouldAnimate} 
        sourceScene={sourceScene} 
        paused={!isLandscape}
      />
      <AnimatePresence>
        {!isLandscape && shouldAnimate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div className="text-white text-center p-8">
              <h2 className="text-2xl font-bold mb-4">Please rotate your device</h2>
              <p>This experience works best in landscape mode</p>
            </div>
          </motion.div>
        )}
        {shouldAnimate &&
          actions.map((action, i) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={i}
            >
              <Action
                title={action.name}
                percentX={action.x}
                percentY={action.y}
                icon={action.icon}
                interactives={action.component || null}
              >
                <p>
                  Need help coming up with a project idea? Want to find
                  resources?
                </p>
                <div className="flex flex-col gap-4 my-2">
                  {action.resources.map((resource: any, index: number) => (
                    <div
                      key={index}
                      className="not-prose basis-1/3 grow group w-full lg:flex hover:scale-105 transition shadow-md relative rounded-lg bg-white"
                    >
                      {resource.image ? (
                        <div
                          className="h-auto w-32 flex-none bg-cover rounded-l-lg text-center overflow-hidden shrink-0"
                          style={{ backgroundImage: `url(${resource.image})` }}
                        />
                      ) : null}
                      <div className="rounded-r-lg p-4 flex flex-col justify-between leading-normal w-full">
                        <div className="absolute top-0 right-0 p-4">
                          <a
                            className="transition group-hover:translate-x-6 group-hover:translate-y-6"
                            target="_blank"
                            href={resource.link}
                          >
                            <img
                              src="https://icons.hackclub.com/api/icons/hackclub-red/external"
                              className="size-[32px]"
                              alt=""
                            />
                          </a>
                        </div>
                        <div>
                          <div className="text-gray-900 font-bold text-xl">
                            {resource.name}
                          </div>
                          <p className="text-gray-700 text-base">
                            {resource.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Action>
            </motion.div>
          ))}
        {
          <button
            onClick={() => setFullscreen(false)}
            className="playfair-display italic font-bold absolute right-16 top-16 text-white text-2xl"
          >
            back to map -{">"}
          </button>
        }
      </AnimatePresence>
    </div>
  );
}
