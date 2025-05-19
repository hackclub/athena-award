import { motion } from "motion/react";
import { ResourceCue } from "./GalleryMenu";
import { slidingUpVariant } from "./constants";
import DefaultFrame from "./DefaultFrame";
import { Tooltip } from "react-tooltip";
import { STAGES } from "@/app/STAGES";

interface NextStepsProps {
  points: number;
  module: (typeof STAGES)[number]["moduleName"] | "Intro" | "Onward!";
  prevModule: string;
  nextModule: string;
  setModule: (module: (typeof STAGES)[number]["moduleName"]) => void;
  setSelectedProject: (project: string) => void;
  setPrizeScroller: (value: number) => void;
  setProjectRetrievalComplete: (status: boolean) => void;
}

interface Resource {
  name: string;
  id: string;
  link: string;
}

const nextStepsResources = [
  {
    name: "Contribute to Open Source",
    id: "open-source",
    link: "https://github.com/hackclub",
  },
  {
    name: "Start a Hack Club",
    id: "hack-club",
    link: "https://hackclub.com/clubs",
  },
  {
    name: "Run a Hackathon",
    id: "hackathon",
    link: "https://hackclub.com/hackathons",
  },
];

export default function NextSteps({ 
  points,
  module,
  prevModule,
  nextModule,
  setModule,
  setSelectedProject,
  setPrizeScroller,
  setProjectRetrievalComplete,
}: NextStepsProps) {
  return (
    <DefaultFrame
      title="Next Steps"
      primaryTheme="bg-[url('https://hc-cdn.hel1.your-objectstorage.com/s/v3/c0fecb8d1d545a2c132b00a0d723d55fcd61cd02_image__6_.png')] bg-cover"
      module={module}
      prevModule={prevModule}
      nextModule={nextModule}
      setModule={setModule}
      setSelectedProject={setSelectedProject}
      setPrizeScroller={setPrizeScroller}
      setProjectRetrievalComplete={setProjectRetrievalComplete}
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
            Community Track 👥
          </motion.h2>
          <motion.h2
            variants={slidingUpVariant}
            transition={{ delay: 0.4 }}
            initial="hidden"
            animate="visible"
            className="text-xl text-black text-center md:text-left"
          >
            Give back to the community
          </motion.h2>
          <motion.div
            key={`next-steps-details`}
            variants={slidingUpVariant}
            transition={{ delay: 0.4 }}
            initial="hidden"
            animate="visible"
            className="h-full overflow-auto flex flex-col gap-3"
          >
            <p>
              Ready to take your skills to the next level?
            </p>
            {nextStepsResources.map((resource: Resource, index: number) => (
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
            Leadership Track 👤
          </motion.h2>
          <motion.h2
            variants={slidingUpVariant}
            transition={{ delay: 0.4 }}
            initial="hidden"
            animate="visible"
            className="text-xl text-black text-center md:text-left"
          >
            Lead and inspire others
          </motion.h2>
          <motion.div
            variants={slidingUpVariant}
            transition={{ delay: 0.4 }}
            initial="hidden"
            animate="visible"
            className="md:w-11/12 flex flex-col gap-10"
          >
            <p>
              Take on leadership roles and help others discover the joy of coding.
            </p>
            <p>
              Start a Hack Club at your school, organize a hackathon, or become a mentor.
              Help others discover the joy of coding and build a stronger tech community!
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