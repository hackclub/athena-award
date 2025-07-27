"use client";
import { Fragment, useContext, useState, useMemo } from "react";
import Background from "../landscape/Background";
import { AnimatePresence, motion, Variant, Variants } from "motion/react";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import { useSession } from "next-auth/react";
import { Loading, Unauthenticated } from "@/components/screens/Modal";
import { STAGES, BaseModule } from "@/app/STAGES";
import ActionableScene from "../landscape/ActionableScene";
import { FaPaintbrush } from "react-icons/fa6";
import useSWR from "swr";
import { multiFetcher } from "@/services/fetcher";
import { useEffect } from "react";
import { Action, Tip } from "@/components/panels/add-ons/Callout";
import Icons from "@/components/panels/Icons";
import { Error } from "@/components/screens/Modal";
import Link from "next/link";
import Navigation from "./Navigation";
import Introduction from "./Introduction";
import NextSteps from "./NextSteps";
import { slidingUpVariant } from "./constants";

export function ResourceCue({
  title,
  delay,
  link,
}: {
  title: string;
  link: string;
  delay: number;
}) {
  return (
    <motion.a
      variants={slidingUpVariant}
      transition={{ delay: 0.5 + 0.09 * delay }}
      initial="hidden"
      animate="visible"
      className={`w-full bg-white/20 p-3 flex justify-between rounded no-underline text-black`}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="flex gap-2">
        <span className="italic">{title}</span>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 peer"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </svg>
    </motion.a>
  );
}

export default function GalleryMenu({
  module,
  progress = STAGES,
  setModule,
}: {
  module: (typeof STAGES)[number]["moduleName"] | "Intro" | "Onward!";
  progress?: typeof STAGES;
  setModule: (
    module: (typeof STAGES)[number]["moduleName"] | "Intro" | "Onward!",
  ) => void;
}) {
  const [fullscreen, setFullscreen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("_select#");
  const [prizeScroller, setPrizeScroller] = useState(0);
  const [projectRetrievalComplete, setProjectRetrievalComplete] =
    useState(false);
  const session = useSession();
  const slackId = session.data?.slack_id;

  let currModuleIdx = progress.findIndex((p) => p.moduleName === module);
  const nextModule =
    module === "Intro"
      ? progress[0].moduleName
      : module === "Onward!"
        ? "Intro"
        : currModuleIdx === progress.length - 1
          ? "Onward!"
          : progress[currModuleIdx + 1].moduleName;

  const prevModule =
    module === "Intro"
      ? "Onward!"
      : module === "Onward!"
        ? progress[progress.length - 1].moduleName
        : currModuleIdx === 0
          ? "Intro"
          : progress[currModuleIdx - 1].moduleName;

  let urls = [
    `/api/user/my/projects?query=valid_for_selection&stage=${currModuleIdx + 1}`,
    `/api/user/my/projects?query=selected&stage=${currModuleIdx + 1}`,
    `/api/shop?stage=${currModuleIdx + 1}`,
    `/api/user/my/points`,
  ];

  /** this is the current stage represented as a module object with the relevant visuals data */
  const baseModuleData = STAGES.find((m) => m.moduleName === module)!;

  const { data, error, isLoading, mutate } = useSWR(
    baseModuleData ? urls : [`/api/user/my/points`],
    multiFetcher,
  );

  if (error) {
    console.log(error);
  }

  async function handleChange(e: any) {
    const projectName = e.target.value;
    const update = await fetch(`/api/user/my/projects`, {
      method: "POST",
      body: JSON.stringify({ stage: currModuleIdx + 1, project: projectName }),
    });
    setSelectedProject(projectName);
    return update;
  }

  let projects;
  let points: number = 0;
  let prizes = [
    { item_friendly_name: "Loading..." },
    { description: "Loading..." },
    { image: null },
  ];
  if (data) {
    projects = data[0];
    prizes = data[2];
    if (!baseModuleData) {
      points = Number(data[0]["message"]);
    }
  }

  useEffect(() => {
    if (baseModuleData && data) {
      if ((data[1] as any)["message"]["project_name"]) {
        setSelectedProject(
          (data[1] as any)["message"]["project_name_override"] ||
            (data[1] as any)["message"]["project_name"],
        );
      } else {
        setSelectedProject("_select#");
      }
      setProjectRetrievalComplete(true);
    } else {
      setSelectedProject("_select#");
    }
  }, [data]);

  if (session.status === "unauthenticated") {
    return <Unauthenticated />;
  }

  const memoizedIntroPage = useMemo(
    () => (
      <Introduction
        points={points}
        module={module as "Intro"}
        prevModule={prevModule}
        nextModule={nextModule}
        setModule={
          setModule as (
            m: (typeof STAGES)[number]["moduleName"] | "Intro" | "Onward!",
          ) => void
        }
        setSelectedProject={setSelectedProject}
        setPrizeScroller={setPrizeScroller}
        setProjectRetrievalComplete={setProjectRetrievalComplete}
      />
    ),
    [
      points,
      module,
      progress,
      prevModule,
      nextModule,
      setModule,
      setSelectedProject,
      setPrizeScroller,
      setProjectRetrievalComplete,
    ],
  );

  const memoizedNextStepsPage = useMemo(
    () => (
      <NextSteps
        points={points}
        module={module as "Onward!"}
        prevModule={prevModule}
        nextModule={nextModule}
        setModule={setModule}
        setSelectedProject={setSelectedProject}
        setPrizeScroller={setPrizeScroller}
        setProjectRetrievalComplete={setProjectRetrievalComplete}
      />
    ),
    [
      points,
      module,
      progress,
      prevModule,
      nextModule,
      setModule,
      setSelectedProject,
      setPrizeScroller,
      setProjectRetrievalComplete,
    ],
  );

  if (!baseModuleData) {
    switch (module) {
      case "Intro":
        return memoizedIntroPage;
      case "Onward!":
        return memoizedNextStepsPage;
    }
    return (
      <>
        <Error error={`Module '${module}' was not found.`} />
      </>
    );
  }
  return (
    <>
      <div>
        {session.status === "authenticated" ? (
          <div
            className={`h-full w-full relative ${baseModuleData.visuals.accents.primary}`}
          >
            <ActionableScene
              shouldAnimate={fullscreen}
              sourceScene={baseModuleData.visuals.scene}
              module={baseModuleData["moduleName"]}
              setFullscreen={setFullscreen}
            />
            <AnimatePresence>
              {!fullscreen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`flex gap-8 lg:gap-0 flex-col backdrop-blur-md h-full lg:h-screen w-screen p-12 sm:p-16 ${baseModuleData.visuals.accents.tertiary} transition-all`}
                  >
                    <div className="self-start">
                      <div className="text-xl sm:text-2xl uppercase text-white font-bold mb-2">
                        Athena Award
                      </div>
                      <h1 className="text-4xl sm:text-6xl uppercase italic text-white font-bold">
                        The Gallery
                      </h1>
                    </div>
                    <Icons />

                    <motion.div className="grow grid grid-cols-5 gap-10 items-center">
                      <div className="col-span-full lg:col-span-2">
                        <div
                          className={`${baseModuleData.visuals.accents.tertiary} p-4 transition-all`}
                        >
                          <motion.div
                            className="aspect-[3/2] bg-white group transition-all rounded-2xl"
                            style={{
                              backgroundImage: `url('${baseModuleData!.visuals.src}')`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                            onClick={() => {
                              setFullscreen(true);
                            }}
                          >
                            <div className="w-full h-full bg-black/0 group-hover:bg-black/30 transition cursor-zoom-in rounded-2xl flex items-center justify-center text-white">
                              <span className="opacity-0 group-hover:opacity-100">
                                Click to go
                              </span>
                            </div>
                          </motion.div>
                        </div>
                        {/* photo creds */}
                        <div>
                          <div className="text-white text-base italic mt-2 uppercase flex items-center">
                            <FaPaintbrush className="size-4 inline mr-2" /> "
                            {baseModuleData.visuals.name}" -{" "}
                            {baseModuleData.visuals.artist}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-full lg:col-span-3 text-white">
                        <motion.div
                          transition={{ delay: 0.4 }}
                          initial="hidden"
                          animate="visible"
                          className="my-5 space-y-3 pr-4"
                        >
                          <h1 className="text-white font-bold text-4xl sm:text-5xl italic mb-3">
                            {currModuleIdx + 1}: {module}
                          </h1>

                          <motion.p
                            transition={{ delay: 0.45 }}
                            initial="hidden"
                            animate="visible"
                            className="text-white leading-normal text-md sm:text-lg italic font-light"
                          >
                            {baseModuleData.description
                              .split("\n")
                              .map((text, i) => (
                                <Fragment key={i}>
                                  {i > 0 && <br />}
                                  {text}
                                </Fragment>
                              ))}
                          </motion.p>
                        </motion.div>
                        <div className="my-5 flex flex-col sm:flex-row w-full justify-between gap-4">
                          {/* to do, clean this entire section up lmfao*/}
                          {projectRetrievalComplete &&
                          data &&
                          selectedProject &&
                          data[1] &&
                          (data[1]["message"]["status"] == "rejected" ||
                            data[1]["message"]["status"] == "pending") ? ( // don't ask bro
                            <div>
                              <Tooltip
                                className="max-w-[20rem]"
                                id="hackatime_info"
                              />
                              <span
                                className="flex flex-row gap-2 items-center py-2"
                                data-tooltip-id="hackatime_info"
                                data-tooltip-content="Nothing showing up here? Check Settings to set up project tracking with Hackatime!"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                                  />
                                </svg>
                                <label
                                  htmlFor="project"
                                  className="font-bold text-accent"
                                >
                                  What project are you working on?
                                </label>

                              </span>

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
                                    [Other YSWS Project/Summer Program Project]
                                  </option>
                                </select>
                              </span>
                            </div>
                          ) : isLoading ? (
                            <div
                              className={`flex gap-2 mt-3 p-3 transition-all duration-700 items-center justify-center ${baseModuleData!.visuals.accents.secondary}`}
                            >
                              Loading...
                            </div>
                          ) : data &&
                            data[1] &&
                            data[1]["message"]["status"] == "approved" ? (
                            <Tip title="Project approved">
                              Your project "{selectedProject}" was approved!
                              Head to the Shop
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-4 inline-block mx-1"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                                />
                              </svg>{" "}
                              to order your prize.
                            </Tip>
                          ) : data &&
                            data[1] &&
                            data[1]["message"]["status"] == "unreviewed" ? (
                            <Action title="Project awaiting review">
                              Your project {selectedProject} has been submitted
                              for review.
                            </Action>
                          ) : (
                            <span>
                              <Action title="Complete onboarding: Download Hackatime">
                                You need to set up{" "}
                                <a
                                  className="text-white"
                                  href="https://hackatime.hackclub.com/my/wakatime_setup"
                                >
                                  Hackatime
                                </a>{" "}
                                before you start the Athena Award! Go to the
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="inline align-middle size-5 "
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                                  />
                                </svg>{" "}
                                in the top right corner for more information.
                              </Action>
                            </span>
                          )}
                          <div className="self-center sm:self-start max-sm:flex flex-col items-center justify-center">
                            {data &&
                            selectedProject !== "_select#" &&
                            data[1] &&
                            data[1]["message"]["status"] === "pending" ? (
                              <button
                                className={`flex gap-2 mt-3 px-2 py-3 sm:p-3 transition-all duration-700 items-center justify-center ${baseModuleData!.visuals.accents.secondary}`}
                                onClick={async () =>
                                  await fetch(
                                    `/api/user/my/projects/refresh?stage=${currModuleIdx + 1}`,
                                    { method: "POST" },
                                  )
                                }
                              >
                                <a
                                  target="_blank"
                                  className="text-white no-underline"
                                  href={`https://forms.hackclub.com/athena-award-projects?stage=${currModuleIdx + 1}`}
                                >
                                  Ready to submit?
                                </a>
                              </button>
                            ) : data && selectedProject == "_select#" ? (
                              <button
                                disabled
                                className={`flex gap-2 mt-3 px-2 py-3 sm:p-3 transition-all duration-700 items-center justify-center ${baseModuleData!.visuals.accents.secondary}`}
                              >
                                Select a project to submit
                              </button>
                            ) : data &&
                              data[1]["message"]["status"] == "approved" ? (
                              <button
                                disabled
                                className={`flex gap-2 mt-3 px-2 py-3 sm:p-3 transition-all duration-700 items-center justify-center ${baseModuleData!.visuals.accents.secondary}`}
                              >
                                Stage completed 🎉
                              </button>
                            ) : data &&
                              data[1]["message"]["status"] == "rejected" ? (
                              <button
                                className={`flex gap-2 mt-3 px-2 py-3 sm:p-3 transition-all duration-700 items-center justify-center ${baseModuleData!.visuals.accents.secondary}`}
                                onClick={async () =>
                                  await fetch(
                                    `/api/user/my/projects/refresh?stage=${currModuleIdx + 1}`,
                                    { method: "POST" },
                                  )
                                }
                              >
                                <a
                                  target="_blank"
                                  className="text-white no-underline"
                                  href={`https://forms.hackclub.com/athena-award-projects?stage=${currModuleIdx + 1}`}
                                >
                                  Your project was rejected - click here to
                                  resubmit!
                                </a>
                              </button>
                            ) : data &&
                              data[1]["message"]["status"] == "unreviewed" ? (
                              <button
                                disabled
                                className={`flex gap-2 mt-3 px-2 py-3 sm:p-3 transition-all duration-700 items-center justify-center ${baseModuleData!.visuals.accents.secondary}`}
                              >
                                Project awaiting review
                              </button>
                            ) : (
                              <div>Loading...</div>
                            )}
                            <p className = "block font-normal text-sm">Projects may take up to 10 minutes to change status.</p>

                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <div className="flex flex-row w-full gap-20">
                      <Navigation
                        {...{
                          module,
                          progress,
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
              )}
            </AnimatePresence>
          </div>
        ) : session.status === "loading" ? (
          <Loading />
        ) : (
          <Unauthenticated />
        )}
      </div>
    </>
  );
}
