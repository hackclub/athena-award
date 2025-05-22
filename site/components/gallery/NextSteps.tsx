import { motion } from "motion/react";
import { ResourceCue } from "./GalleryMenu";
import { slidingUpVariant } from "./constants";
import DefaultFrame from "./DefaultFrame";
import { Tooltip } from "react-tooltip";
import { STAGES } from "@/app/STAGES";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { multiFetcher } from "@/services/fetcher";
import { useState } from "react";
import { useEffect } from "react";

interface NextStepsProps {
  points: number;
  module: (typeof STAGES)[number]["moduleName"] | "Intro" | "Onward!";
  prevModule: string;
  nextModule: string;
  setModule: (module: (typeof STAGES)[number]["moduleName"]) => void;
  setSelectedProject: (project: string) => void;
  setPrizeScroller: (value: number) => void;
  setProjectRetrievalComplete: (status: boolean) => void;
  titleProps?: string;
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
  setPrizeScroller,
  setProjectRetrievalComplete,
  titleProps,
}: NextStepsProps) {

  const session = useSession()
  const slackId = session.data?.slack_id
  const [ selectedProject, setSelectedProject ] = useState("_select#")
  const [ idOfNextSubmission, setIdOfNextSubmission ] = useState(4)
  useEffect(() => {
    fetch(`/api/user/${slackId}/projects?query=most_recent_submission`).then(
      r => r.json()
    ).then( res =>
    setIdOfNextSubmission(res.message + 1)
    )
  }, [])

  let urls = [
    `/api/user/${slackId}/projects?query=valid_for_selection&stage=${idOfNextSubmission}`,
    `/api/user/${slackId}/points`,
  ];

  /** this is the current stage represented as a module object with the relevant visuals data */
  const baseModuleData = STAGES.find((m) => m.moduleName === module)!;

  const { data, error, isLoading, mutate } = useSWR(
    urls,
    multiFetcher,
  );

  if (error) {
    console.log(error);
  }

  async function handleChange(e: any) {
    const projectName = e.target.value;
    const update = await fetch(`/api/user/${slackId}/projects`, {
      method: "POST",
      body: JSON.stringify({ stage: idOfNextSubmission, project: projectName }),
    });
    setSelectedProject(projectName);
    return update;
  }

  let projects;
  if (data) {
    projects = data[0];
  }

  return (
    <DefaultFrame
      title="Next Steps"
      primaryTheme="bg-[url('https://hc-cdn.hel1.your-objectstorage.com/s/v3/c0fecb8d1d545a2c132b00a0d723d55fcd61cd02_image__6_.png')] bg-cover"
      module={module}
      prevModule={prevModule}
      nextModule={nextModule}
      // @ts-ignore
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
            Keep hacking 👥
          </motion.h2>
          <motion.h2
            variants={slidingUpVariant}
            transition={{ delay: 0.4 }}
            initial="hidden"
            animate="visible"
            className="text-xl text-black text-center md:text-left"
          >
            Submit more projects for more prizes!
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
              You might have finished the required projects for the Athena Award, but keep on submitting projects for bonus artifacts to be spent in the shop.
            </p>

          <div>
            
            <div>
                <span className="flex flex-row items-center gap-2">
                      <select
                        required
                        className="w-full sm:min-w-max flex flex-col gap-1 *:bg-darker text-black *:text-black bg-white/80 rounded-full px-5"
                        name="project"
                        id="project"
                        defaultValue={selectedProject}
                        onChange={handleChange}
                      >
                        <option disabled value="_select#">
                          [Select a project]
                        </option>
                        {projects &&
                          projects.map(
                            (
                              project: any,
                              index: number /* i really cbf to fix the type rn */,
                            ) => (
                              <option
                                key={index}
                                value={project.name}
                              >
                                {project.project_name_override ||
                                  project.name}
                              </option>
                            ),
                          )}
                        <option value="Other YSWS Project">
                          [Other YSWS Project]
                        </option>
                      </select>
                    </span>
                  </div>

                  <button className={`flex gap-2 mt-3 px-2 py-3 sm:p-3 transition-all duration-700 items-center justify-center bg-cream/40`}>
                  <a
                    target="_blank"
                    className="text-white no-underline"
                    href={`https://forms.hackclub.com/athena-award-projects?stage=${idOfNextSubmission}`}>
                    Ready to submit?
                  </a>
                  </button>
            </div>
          </motion.div>
        </div>
        <span className="mx-auto md:my-auto !bg-transparent rounded-none text-2xl lowercase playfair-display italic">or</span>
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