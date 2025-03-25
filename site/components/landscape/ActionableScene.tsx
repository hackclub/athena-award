'use client';

import { STAGES } from "@/app/STAGES";
import Background from "./Background";
import { Fragment, useState } from "react";
import Action from "./Action";
import { AnimatePresence, motion } from "motion/react";

export default function ActionableScene({ shouldAnimate = false, sourceScene = 'https://prod.spline.design/0vuYDA6geatVNNiC/scene.splinecode', module = 'Start hacking', setFullscreen }:{ shouldAnimate?: boolean, sourceScene?: string, module: typeof STAGES[number]['moduleName'], setFullscreen: (b: boolean) => void }) {
  const actions = STAGES.find(stage => stage.moduleName === module)!.actions;
  const [openPanel, setOpenPanel] = useState(false);

  return (
    <div className="fixed w-screen h-screen z-0">
      <Background shouldAnimate={shouldAnimate} sourceScene={sourceScene} />
      <AnimatePresence>
        {shouldAnimate && actions.map((action, i) => (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={i}>
            <Action
              title={action.name}
              percentX={action.x}
              percentY={action.y}
              icon={action.icon}
              interactives={action.component || null}
            >
              <p>Need help coming up with a project idea? want to find resources?</p>
              <div className="flex flex-col gap-4">
                {action.resources.map(resource => (
                  <div key={resource.name} className="p-4 bg-white rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold">{resource.name}</h2>
                    <div className="italic text-base">{resource.description}</div>
                    <a href={resource.link} className="text-blue-600 hover:underline">Learn more</a>
                  </div>
                ))}
              </div>
            </Action>
          </motion.div>
        ))}
      {<button onClick={() => setFullscreen(false)} className="playfair-display italic font-bold absolute right-16 top-16 text-white text-2xl">
        back to map -{'>'}
      </button>}
      </AnimatePresence>
    </div>
  )
}