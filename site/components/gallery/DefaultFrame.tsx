import { motion, AnimatePresence } from "motion/react";
import Icons from "@/components/panels/Icons";
import Navigation from "./Navigation";
import { STAGES } from "@/app/STAGES";

interface DefaultFrameProps {
  title: string;
  children: React.ReactNode;
  primaryTheme: string;
  module: string;
  prevModule: string;
  nextModule: string;
  setModule: (
    module: (typeof STAGES)[number]["moduleName"] | "Intro" | "Onward!",
  ) => void;
  setSelectedProject: (project: string) => void;
  setPrizeScroller: (value: number) => void;
  setProjectRetrievalComplete: (status: boolean) => void;
  titleProps?: string;
}

export default function DefaultFrame({
  title,
  children,
  primaryTheme,
  module,
  prevModule,
  nextModule,
  setModule,
  setSelectedProject,
  setPrizeScroller,
  setProjectRetrievalComplete,
  titleProps,
}: DefaultFrameProps) {
  return (
    <div className={`h-full w-full relative ${primaryTheme}`}>
      <AnimatePresence>
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex gap-8 lg:gap-0 flex-col backdrop-blur-md w-full lg:h-screen p-12 sm:p-16 transition-all ${primaryTheme} overflow-auto-scroll`}
          >
            <div className={`self-start ${titleProps}`}>
              <div className="text-xl sm:text-2xl uppercase text-white font-bold mb-2">
                Athena Award
              </div>
              <h1 className="text-4xl sm:text-6xl uppercase italic text-white font-bold">
                {title}
              </h1>
            </div>
            <Icons />

            <motion.div className="grow grid grid-cols-4 gap-4">
              {children}
            </motion.div>

            <div className="flex flex-row w-full gap-20">
              <Navigation
                {...{
                  module: module as
                    | "Start hacking"
                    | "Your second project"
                    | "Your final project"
                    | "Onward!",
                  prevModule,
                  nextModule,
                  setModule,
                  setSelectedProject,
                  setPrizeScroller,
                  setProjectRetrievalComplete,
                }}
              />
            </div>
          </motion.div>
        </>
      </AnimatePresence>
    </div>
  );
}
