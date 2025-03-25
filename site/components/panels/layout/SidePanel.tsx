'use client';
import { Dispatch, Fragment, ReactNode, SetStateAction, useState } from "react";
import SidePanelBackground from "./SparkleBackground";
import { AnimatePresence, motion } from "motion/react";

export default function SidePanel({
  openPanel, setOpenPanel, title, children
}:{ openPanel: boolean, setOpenPanel: Dispatch<SetStateAction<boolean>>, title: string, children: ReactNode }) {
  const [widePanel, setWidePanel] = useState(false);
  return (
    <AnimatePresence>
      {openPanel && <motion.div className="fixed z-40">
        <motion.div key="panel-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 bg-black/25 z-[1]" />

        <div className="fixed inset-0 z-[2] overflow-x-clip">
          <div className="flex min-h-full items-center justify-end">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }} exit={{ opacity: 0,  transition: { delay: 0.05 } }} className={`h-screen transition-[width] max-md:w-[100vw] ${ widePanel ? 'md:w-[100vw]' : 'md:w-[70vw]' } translate-x-0 overflow-hidden bg-hc-secondary text-left shadow-xl`}
                style={{
                }}
              >
                <SidePanelBackground>
                  <div className="p-14">
                    <div className="flex items-center gap-4 text-hc-primary">
                      <button className="size-[52px] shrink-0" onClick={() => setWidePanel(!widePanel)}>
                        <span className="sr-only">expand panel</span>
                        <img src="https://icons.hackclub.com/api/icons/hackclub-red/expand" className="size-[52px]" alt="" />
                      </button>
                      <h2 className="text-5xl font-bold whitespace-nowrap">{title}</h2>

                      <div className="w-full h-3 bg-hc-primary"></div>
                    </div>
                    <div className="mt-2">
                      {children}
                    </div>

                    <div className="mt-4">
                      <button onClick={() => setOpenPanel(false)}>Close</button>
                    </div>
                  </div>

                </SidePanelBackground>
              </motion.div>
          </div>
        </div>
      </motion.div>}
    </AnimatePresence>
  )
}