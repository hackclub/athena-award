import { motion } from "motion/react";
import { ResourceCue } from "./GalleryMenu";
import { introResources, slidingUpVariant } from "./constants";
import DefaultFrame from "./DefaultFrame";
import { Tooltip } from "react-tooltip";
import { STAGES } from "@/app/STAGES";

interface IntroductionProps {
  points: number;
  module: (typeof STAGES)[number]["moduleName"] | "Intro" | "Onward!";
  prevModule: string;
  nextModule: string;
  setModule: (module: ((typeof STAGES)[number]["moduleName"] | "Intro" | "Onward!")) => void;
  setSelectedProject: (project: string) => void;
  setPrizeScroller: (value: number) => void;
  setProjectRetrievalComplete: (status: boolean) => void;
}

interface Resource {
  name: string;
  id: string;
  link: string;
}

export default function Introduction({ 
  points,
  module,
  prevModule,
  nextModule,
  setModule,
  setSelectedProject,
  setPrizeScroller,
  setProjectRetrievalComplete,
}: IntroductionProps) {
  return (
    <DefaultFrame
      title="Introduction"
      primaryTheme="bg-[url('https://hc-cdn.hel1.your-objectstorage.com/s/v3/c0fecb8d1d545a2c132b00a0d723d55fcd61cd02_image__6_.png')] bg-cover bg-center bg-cream/50 bg-blend-overlay"
      module={module}
      prevModule={prevModule}
      nextModule={nextModule}
      setModule={setModule}
      setSelectedProject={setSelectedProject}
      setPrizeScroller={setPrizeScroller}
      setProjectRetrievalComplete={setProjectRetrievalComplete}
      titleProps="*:text-black/75"
    >
      <div className="grow flex flex-col md:flex-row gap-4 col-span-full *:rounded-lg *:bg-white/30 *:!text-black *:backdrop-blur *:px-4 *:py-2 *:my-2">
        <div className="md:basis-1/2 text-black flex-1 w-full">
          <motion.h2
            variants={slidingUpVariant}
            transition={{ delay: 0.3 }}
            initial="hidden"
            animate="visible"
            className="text-3xl text-black text-center md:text-left"
          >
            Guided Track 👥
          </motion.h2>
          <motion.h2
            variants={slidingUpVariant}
            transition={{ delay: 0.4 }}
            initial="hidden"
            animate="visible"
            className="text-xl text-black text-center md:text-left"
          >
            Build something with help
          </motion.h2>
          <motion.div
            key={`intro-details`}
            variants={slidingUpVariant}
            transition={{ delay: 0.4 }}
            initial="hidden"
            animate="visible"
            className="h-full overflow-auto flex flex-col gap-3"
          >
            <p>
              Not sure what to make?
            </p>
            {introResources.map((resource: Resource, index: number) => (
              <ResourceCue
                key={index}
                title={resource.name}
                link={resource.link}
                delay={index}
              />
            ))}
          </motion.div>
        </div>
        <span className="mx-auto md:my-auto !bg-transparent rounded-none text-2xl lowercase playfair-display italic">or</span>
        <div className="md:basis-1/2 flex-1 text-black">
          <Tooltip id="original" className="max-w-64" />
          <motion.h2
            variants={slidingUpVariant}
            className="text-3xl text-black text-center md:text-left"
          >
            Custom Track 👤
          </motion.h2>
          <motion.h2
            variants={slidingUpVariant}
            transition={{ delay: 0.4 }}
            initial="hidden"
            animate="visible"
            className="text-xl text-black text-center md:text-left"
          >
            Build something yourself
          </motion.h2>
          <motion.div
            variants={slidingUpVariant}
            transition={{ delay: 0.4 }}
            initial="hidden"
            animate="visible"
            className="md:w-11/12 flex flex-col gap-10"
          >
            <p>
              You can submit any three technical projects for the Athena
              Award.
            </p>
            <p>
              For every hour you code on an{" "}
              <span
                data-tooltip-id="original"
                data-tooltip-content="A project which is not completed from a tutorial, or existing Hack Club YSWS ('You Ship We Ship') program"
              >
                original
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mx-1 size-6 inline"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                  />
                </svg>
              </span>{" "}
              project, you will earn Artifacts - currency that can be spent in
              the Shop
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 mx-1 inline align-middle"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                />
              </svg>
              on iPads, Framework 12 laptops, and more.
            </p>
          </motion.div>
        </div>
      </div>
      <div className="col-span-full py-2 md:py-0">
        <div className="bg-white/40 relative h-6 rounded-lg self-end">
          <div
            className={`absolute bg-white/80 h-6 rounded-l-lg ${points >= 100 && "rounded-r-lg"}`}
            style={{ width: points + "%" }}
          />
          <div className="absolute text-center w-full uppercase z-50 text-gray-500">
            Athena Award - {points}% completed
          </div>
        </div>
      </div>
    </DefaultFrame>
  );
} 