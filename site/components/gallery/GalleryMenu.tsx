'use client'
import { Fragment, useContext, useState, useMemo } from "react";
import Background from "../landscape/Background";
import { AnimatePresence, motion, Variant, Variants } from "motion/react"
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import { useSession } from "next-auth/react";
import { Loading, Unauthenticated } from "@/components/screens/Modal";
import { STAGES } from "@/app/STAGES";
import ActionableScene from "../landscape/ActionableScene";
import { FaPaintbrush } from "react-icons/fa6";
import useSWR from "swr";
import { multiFetcher } from "@/services/fetcher";
import { useEffect } from "react";
import { Action, Tip } from "@/components/panels/add-ons/Callout";
import Icons from "@/components/panels/Icons";
import { Error } from "@/components/screens/Modal";
import Link from "next/link";

// TODO: make it so you can switch between the landscape with all of the interactive content + the map menu

interface UserStageData {
  name: string,
  id: string,
  complete: boolean,
};

interface BaseStage {
  name: string,
  id: string,
}

interface UserModuleData {
  moduleName: string,
  // stages: UserStageData[],
}

interface BaseModule {
  moduleName: string,
  visuals: {
    name: string,
    artist: string,
    src: string // the background image
    scene: `https://prod.spline.design/${string}` // for the interactive worldly component
    accents: {
      primary: string,
      secondary: string,
    }
  },
  completionRewards: {
    name: string,
    id: string,
    description: string,
  }[]
  // stages: BaseStage[],
}


const introData = {
  moduleName: "Intro"
}

const exampleData: UserModuleData = {
  moduleName: "Start hacking"
}

const secondExampleData: UserModuleData = {
  moduleName: "Your second project"
}

const thirdExampleData: UserModuleData = {
  moduleName: "Your final project"
}
/**
 * This will not be hardcoded data; the user's progress is indicated by User{item}Data while to-be-hardcoded information is represented as Base{item}.
 */
const compositeUserModuleData: UserModuleData[] = [
  introData,
  exampleData,
  secondExampleData,
  thirdExampleData
] as const;

/**
 * This will always be hardcoded data; the user's progress is indicated by User{item}Data while to-be-hardcoded information is represented as Base{item}.
 */


const slidingUpVariant: Variants = {
  hidden: {
    y: 10,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1
  }
}

// to stagger children
const slidingParentVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren", //use this instead of delay
      staggerChildren: 0.2, //apply stagger on the parent tag
  },
  }
}

const introResources = [
  {
    "name": "Learn to make a website with Boba Drops 🧋",
    "id": "boba-drops",
    "link": "https://boba.hackclub.com"
  },
  {
    "name": "Create a video game with Sprig 🎮",
    "id": "sprig",
    "link": "https://sprig.hackclub.com"

  },
  {
    "name": "Design a PCB with Onboard ⚡",
    "id": "onboard",
    "link": "https://onboard.hackclub.com"
  },
]

export default function GalleryMenu({ module, progress = compositeUserModuleData, setModule }:{ module: any, progress?: UserModuleData[], setModule: (module: typeof STAGES[number]['moduleName']) => void }) {
  const [fullscreen, setFullscreen] = useState(false);
  const [ selectedProject, setSelectedProject ] = useState("_select#")
  const [ prizeScroller, setPrizeScroller ] = useState(0)
  const [ projectRetrievalComplete, setProjectRetrievalComplete ] = useState(false)
  const session = useSession();
  const slackId = session.data?.slack_id

  let currModuleIdx = progress.findIndex(p => p.moduleName === module) 
  const nextModule = progress[(currModuleIdx + 1) % progress.length].moduleName 
  const prevModule = progress[(currModuleIdx - 1 + progress.length) % progress.length].moduleName

  function Navigation(){
    let currModuleIdx = STAGES.find( m => m.moduleName === module) ? progress.findIndex(p => p.moduleName === module) : 0
    return (
      <div className = "flex flex-row w-full gap-20">
        <div className="flex gap-2 items-center self-center text-white">
          <button onClick={() => {
                  currModuleIdx 
                      ? setModule(prevModule as typeof STAGES[number]['moduleName']) 
                      : setModule( compositeUserModuleData[compositeUserModuleData.length - 1]["moduleName"] as typeof STAGES[number]['moduleName'])
                  setSelectedProject("_select#"); 
                  setProjectRetrievalComplete(false); 
                  setPrizeScroller(0)}} className="playfair-display italic text-2xl">
            <span className="sr-only">Previous</span>
            <svg fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414" xmlns="http://www.w3.org/2000/svg" aria-label="view-back" viewBox="0 0 32 32" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="48" height="48"><g><path d="M19.768,23.89c0.354,-0.424 0.296,-1.055 -0.128,-1.408c-1.645,-1.377 -5.465,-4.762 -6.774,-6.482c1.331,-1.749 5.1,-5.085 6.774,-6.482c0.424,-0.353 0.482,-0.984 0.128,-1.408c-0.353,-0.425 -0.984,-0.482 -1.409,-0.128c-1.839,1.532 -5.799,4.993 -7.2,6.964c-0.219,0.312 -0.409,0.664 -0.409,1.054c0,0.39 0.19,0.742 0.409,1.053c1.373,1.932 5.399,5.462 7.2,6.964l0.001,0.001c0.424,0.354 1.055,0.296 1.408,-0.128Z"></path></g></svg>
          </button>
          <span key={`${module}-section-status`} className="italic text-lg md:text-2xl">
            {currModuleIdx 
              ? <span>Project {currModuleIdx} / {progress.length - 1}</span>
              : <span>{module}</span>
            } 
          </span>
          <button onClick={() => { 
                    currModuleIdx 
                        ? setModule(nextModule as typeof STAGES[number]['moduleName']) 
                        : setModule( compositeUserModuleData[1]["moduleName"] as typeof STAGES[number]['moduleName']); 
                      setSelectedProject("_select#"); 
                      setProjectRetrievalComplete(false); 
                      setPrizeScroller(0)}} className="playfair-display italic text-2xl">
            <span className="sr-only">Next</span>
            <svg fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414" xmlns="http://www.w3.org/2000/svg" aria-label="view-forward" viewBox="0 0 32 32" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="48" height="48"><g><path d="M12.982,23.89c-0.354,-0.424 -0.296,-1.055 0.128,-1.408c1.645,-1.377 5.465,-4.762 6.774,-6.482c-1.331,-1.749 -5.1,-5.085 -6.774,-6.482c-0.424,-0.353 -0.482,-0.984 -0.128,-1.408c0.353,-0.425 0.984,-0.482 1.409,-0.128c1.839,1.532 5.799,4.993 7.2,6.964c0.219,0.312 0.409,0.664 0.409,1.054c0,0.39 -0.19,0.742 -0.409,1.053c-1.373,1.932 -5.399,5.462 -7.2,6.964l-0.001,0.001c-0.424,0.354 -1.055,0.296 -1.408,-0.128Z"></path></g></svg>
          </button>
          <span className = "text-white uppercase text-sm">Next: {nextModule as typeof STAGES[number]['moduleName']}</span>
        </div>
      </div>
    )
  }

  function DefaultFrame({title, children, primaryTheme}: {title: string, children: React.ReactNode, primaryTheme: string}){
    return (
      <div className={`h-full w-full relative ${primaryTheme}`}>
      <div id="tw-palette" className="hidden">
        <div className="bg-sky-900/30"></div>
        <div className="bg-sky-950/40"></div>
        <div className="bg-red-900/30"></div>
        <div className="bg-red-900/40"></div>
      </div>
      <AnimatePresence>
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`flex gap-8 lg:gap-0 flex-col backdrop-blur-md h-full lg:h-screen w-screen p-12 sm:p-16 transition-all ${primaryTheme} overflow-y-scroll`}>
              
              <div className = "self-start">
                <div className="text-xl sm:text-2xl uppercase text-white font-bold mb-2">Athena Award</div>
                <h1 className="text-4xl sm:text-6xl uppercase italic text-white font-bold">{title}</h1>
              </div>
              <Icons />

              <motion.div className="grow grid grid-cols-4 gap-4"> 
                {children}
              </motion.div>
                <Navigation/>
              </motion.div>
          </>
          </AnimatePresence>
        </div>
    )
  }


  function InfoPage({points}: {points: number}){
    return (
      <DefaultFrame title="Introduction" primaryTheme="bg-[url('/pattern.svg')] bg-cover">
        <div className = "grow flex flex-col md:flex-row gap-4 col-span-full *:bg-black/30 *:px-4 *:py-2 *:my-2">
            <div className="md:basis-1/2 text-white flex-1 w-full">
                <motion.h2 variants={slidingUpVariant} transition={{ delay: 0.3 }} initial='hidden' animate='visible' className="text-3xl text-white text-center md:text-left">Beginner Track 👥</motion.h2>
                <motion.h2 variants={slidingUpVariant} transition={{ delay: 0.4 }} initial='hidden' animate='visible' className="text-xl text-white text-center md:text-left">Build something with help</motion.h2>
                <motion.div key={`${module}-details`} variants={slidingUpVariant} transition={{ delay: 0.4 }} initial='hidden' animate='visible' className="h-full overflow-scroll flex flex-col gap-3">
                <p>New to coding? For your three projects, you could complete one of Hack Club's You Ship We Ship (YSWS) programs to learn some new skills.</p>
                {introResources.map((resource, index) =>
                    <StageChecklistItem key={index} title={resource.name} link={resource.link} delay={index}/>
                )}
                </motion.div>
            </div>
            <span className = "mx-auto md:my-auto uppercase text-white/40">OR</span>
            <div className = "md:basis-1/2  flex-1 text-white">
            <Tooltip id = "original" className = "max-w-64"/>
              <motion.h2 variants={slidingUpVariant} className = "text-3xl text-white text-center md:text-left">Advanced Track 👤</motion.h2>
              <motion.h2 variants={slidingUpVariant} transition={{ delay: 0.4 }} initial='hidden' animate='visible' className="text-xl text-white text-center md:text-left">Build something yourself</motion.h2>
              <motion.div variants={slidingUpVariant} transition={{ delay: 0.4}} initial='hidden' animate='visible' className="md:w-11/12 flex flex-col gap-10">
                <p>You can submit any three technical projects for the Athena Award.</p>
                <p>
                  For every hour you code on an <span data-tooltip-id="original" data-tooltip-content="A project which is not completed from a tutorial, or existing Hack Club YSWS ('You Ship We Ship') program">
                    original
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-1 size-6 inline">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                  </span> project, you will earn Artifacts - currency that can be spent in the Shop
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mx-1 inline align-middle">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                </svg>
                on iPads, Framework 12 laptops, and more.
                </p>
              </motion.div>
            </div>
          </div>
          <div className = "col-span-full py-2 md:py-0">
          <div className = "bg-white/40 relative h-6 rounded-lg self-end">
                    <div className = {`absolute bg-white/80 h-6 rounded-l-lg ${points >= 100 && "rounded-r-lg"}`} style={{width: points+"%"}}/>
                    <div className = "absolute text-center w-full uppercase z-50 text-gray-500">Athena Award - {points}% completed</div>
                  </div>
          </div>
      </DefaultFrame>
    )
  }
  
  const baseModuleData = STAGES.find(m => m.moduleName === module)!;

  let urls = [
    `/api/user/${slackId}/projects?query=valid_for_selection&stage=${currModuleIdx}`, 
    `/api/user/${slackId}/projects?query=selected&stage=${currModuleIdx}`, 
    `/api/shop?stage=${currModuleIdx}`, 
    `/api/user/${slackId}/points`]
  
  const { data, error, isLoading, mutate } = useSWR(baseModuleData ? urls : [`/api/user/${slackId}/points`], multiFetcher)
  if (error){
    console.log(error)
  }


  // const percentageProgressInThisModule = progress.find(p => p.moduleName === module)!.stages.filter(s => s.complete).length / progress.find(p => p.moduleName === module)!.stages.length * 100;
  
  async function handleChange(e: any){ // i cbf to fix type 2
    const projectName = e.target.value
    const update = await fetch (`/api/user/${slackId}/projects`, { method: "POST", body: JSON.stringify({stage: currModuleIdx, project: projectName})})
    setSelectedProject(projectName)
    return update
  }

  let projects
  let points: number = 0
  let prizes = [{"item_friendly_name": "Loading..."}, {"description": "Loading..."}, {"image": null}]
  if (data){
    projects = (data[0])
    prizes = data[2]
    if (!baseModuleData){
      points = Number(data[0]["message"])
    }
  }
 
  useEffect(() => {
      if (baseModuleData && data){  
        if ((data[1] as any)["message"]["project_name"]){
          setSelectedProject((data[1] as any)["message"]["project_name"])
        } else {
          setSelectedProject("_select#")
        }
        setProjectRetrievalComplete(true)
      } else {
        setSelectedProject("_select#")
      }
  }, [data])

  if (session.status === "unauthenticated"){
    return <Unauthenticated/>
  }

  const memoizedInfoPage = useMemo(() => <InfoPage points={points}/>, [points]);

  if (!(baseModuleData)){
    switch (module){
      case ("Intro"):
        return memoizedInfoPage;
    }
    return (
      <>
      <Error error={`Module '${module}' was not found.`}/></>)
  }
  
  return (
    <>
    <div>
    { session.status === "authenticated" ? 
    <div className={`h-full w-full relative ${baseModuleData.visuals.accents.primary}`}>
      <div id="tw-palette" className="hidden">
        <div className="bg-sky-900/30"></div>
        <div className="bg-sky-950/40"></div>
        <div className="bg-red-900/30"></div>
        <div className="bg-red-900/40"></div>
      </div>
      <ActionableScene shouldAnimate={fullscreen} sourceScene={baseModuleData.visuals.scene} module={baseModuleData["moduleName"]} setFullscreen={setFullscreen}/>
      <AnimatePresence>
        {!fullscreen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`flex gap-8 lg:gap-0 flex-col backdrop-blur-md h-full lg:h-screen w-screen p-12 sm:p-16 ${baseModuleData.visuals.accents.tertiary} transition-all`}>
              
              <div className = "self-start">
                <div className="text-xl sm:text-2xl uppercase text-white font-bold mb-2">Athena Award</div>
                <h1 className="text-4xl sm:text-6xl uppercase italic text-white font-bold">The Gallery</h1>
              </div>
              <Icons />

              <motion.div className="grow grid grid-cols-5 gap-10 items-center">
                <div className="col-span-full lg:col-span-2">
                  <div className={`${baseModuleData.visuals.accents.tertiary} p-4 transition-all`}>
                    <motion.div className='aspect-[3/2] bg-white group transition-all rounded-2xl' style={{
                      backgroundImage: `url('${baseModuleData!.visuals.src}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }} onClick={() => {
                      setFullscreen(true);
                    }}>
                      <div className="w-full h-full bg-black/0 group-hover:bg-black/30 transition cursor-zoom-in rounded-2xl flex items-center justify-center text-white">
                        <span className="opacity-0 group-hover:opacity-100">Click to go</span>
                      </div>
                    </motion.div>
                  </div>
                  {/* photo creds */}
                  <div>
                    <div className="text-white text-base italic mt-2 uppercase flex items-center"><FaPaintbrush className="size-4 inline mr-2" /> "{baseModuleData.visuals.name}" - {baseModuleData.visuals.artist}</div>
                  </div>
                </div>
                <div className="col-span-full lg:col-span-3 text-white">
                  <motion.div transition={{ delay: 0.4 }} initial='hidden' animate='visible' className="my-5 space-y-3 pr-4">
                    <h1 className="text-white font-bold text-4xl sm:text-5xl italic mb-3">{currModuleIdx}: {module}</h1>
                    
                    <motion.p transition={{ delay: 0.45 }} initial='hidden' animate='visible' className="text-white leading-normal text-md sm:text-lg italic font-light">{baseModuleData.description.split('\n').map((text, i) => (
                      <Fragment key={i}>
                        {i > 0 && <br />}
                        {text}
                      </Fragment>
                    ))}</motion.p>
                  </motion.div>

                    {/* <div className = "my-5">
                      <h2 className="text-2xl sm:text-3xl text-white italic">Completion Rewards</h2>
                      <div className = "flex flex-row gap-2 align-middle justify-center">

                      <div className={`grow flex gap-2 mt-3 p-3 duration-700 ${baseModuleData!.visuals.accents.secondary} transition-all`}>
                      <button onClick={() => setPrizeScroller((prizeScroller - 1 + prizes.length) % prizes.length)}>
                        <svg fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414" xmlns="http://www.w3.org/2000/svg" aria-label="view-back" viewBox="0 0 32 32" preserveAspectRatio="xMidYMid meet" fill="currentColor" className="size-4"><g><path d="M19.768,23.89c0.354,-0.424 0.296,-1.055 -0.128,-1.408c-1.645,-1.377 -5.465,-4.762 -6.774,-6.482c1.331,-1.749 -5.1,-5.085 -6.774,-6.482c0.424,-0.353 0.482,-0.984 0.128,-1.408c-0.353,-0.425 -0.984,-0.482 -1.409,-0.128c-1.839,1.532 -5.799,4.993 -7.2,6.964c-0.219,0.312 -0.409,0.664 -0.409,1.054c0,0.39 0.19,0.742 0.409,1.053c1.373,1.932 5.399,5.462 7.2,6.964l0.001,0.001c0.424,0.354 1.055,0.296 1.408,-0.128Z"></path></g></svg>
                      </button>
                        <div className="size-20 rounded-md bg-red-800 shrink-0 hidden sm:flex items-center justify-center text-center">{ prizes[prizeScroller]["image"] ? <img src = {prizes[prizeScroller]["image"]}/> : "image" }</div>
                        <div className="grow">
                          <div className="text-xl"><span className = "font-bold">{prizes[prizeScroller]["item_friendly_name"]}</span></div>
                          <ul>{prizes[prizeScroller]["description"]}</ul>
                        </div>
                        <button onClick={() => setPrizeScroller((prizeScroller + 1) % prizes.length)}>
                      <svg fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414" xmlns="http://www.w3.org/2000/svg" aria-label="view-forward" viewBox="0 0 32 32" preserveAspectRatio="xMidYMid meet" fill="currentColor" className="size-4"><g><path d="M12.982,23.89c-0.354,-0.424 -0.296,-1.055 0.128,-1.408c1.645,-1.377 5.465,-4.762 6.774,-6.482c-1.331,-1.749 -5.1,-5.085 -6.774,-6.482c-0.424,-0.353 -0.482,-0.984 -0.128,-1.408c0.353,-0.425 0.984,-0.482 1.409,-0.128c1.839,1.532 -5.799,4.993 7.2,6.964c0.219,0.312 0.409,0.664 0.409,1.054c0,0.39 -0.19,0.742 -0.409,1.053c-1.373,1.932 -5.399,5.462 -7.2,6.964l-0.001,0.001c-0.424,0.354 -1.055,0.296 -1.408,-0.128Z"></path></g></svg>
                    </button>
                      </div>

                    </div> 
                  </div> */}
                  

                <div className = "my-5 flex flex-col sm:flex-row w-full justify-between gap-4">
                  {/* to do, clean this entire section up lmfao*/}
                  { projectRetrievalComplete && data && selectedProject && data[1] && (data[1]["message"]["status"] == "rejected" || (data[1]["message"]["status"] == "pending")) // don't ask bro 
                        ? <div>
                        <Tooltip className = "max-w-[20rem]" id = "hackatime_info"/>
                        <span className = "flex flex-row gap-2 items-center py-2" data-tooltip-id = "hackatime_info" data-tooltip-content="Nothing showing up here? Check Settings to set up project tracking with Hackatime!">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                          </svg>
                          <label htmlFor="project" className = "font-bold text-accent">What project are you working on?</label>
                        </span>

                          <span className = "flex flex-row items-center gap-2">
                                  <select required className="w-full sm:w-max flex flex-col gap-1 *:bg-darker text-black *:text-black" name = "project" id="project" defaultValue={selectedProject} onChange={handleChange}>
                                    <option disabled value = "_select#">[Select a project]</option>
                                      {projects && projects.map((project: any, index: number) => /* i really cbf to fix the type rn */
                                          <option key={index} value = {project.name}>{project.name}</option>
                                      )}
                                    <option value = "Other YSWS Project">[Other YSWS Project]</option>
                                  </select>
                            </span>

                        </div> 
                        : isLoading 
                          ? <div className={`flex gap-2 mt-3 p-3 transition-all duration-700 items-center justify-center ${baseModuleData!.visuals.accents.secondary}`}>Loading...</div>
                          : data && data[1] && data[1]["message"]["status"] == "approved"
                            ? <Tip title="Project approved">
                                  Your project {selectedProject} was approved! Head to the Shop 
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 inline-block mx-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                                  </svg> to order your prize.
                                </Tip>
                             : data && data[1] && data[1]["message"]["status"] == "unreviewed" 
                              ? <Action title = "Project awaiting review">Your project {selectedProject} has been submitted for review.</Action>
                              : <span><Action title="Complete onboarding: Download Hackatime">
                              You need to set up <a className = "text-white" href = "https://hackatime.hackclub.com/my/wakatime_setup">Hackatime</a> before you start the Athena Award! 
                              Go to the
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="inline align-middle size-5 ">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                              </svg> in the top right corner for more information.
                            </Action></span> 
                        }
                      <div className = "self-center sm:self-end">
                          { data && selectedProject !== "_select#" && (data[1] && data[1]["message"]["status"] === "pending")
                          ? <button className={`flex gap-2 mt-3 px-2 py-3 sm:p-3 transition-all duration-700 items-center justify-center ${baseModuleData!.visuals.accents.secondary}`} onClick={ async () =>  await fetch(`/api/user/${session.data?.slack_id}/projects/refresh?stage=${currModuleIdx}`, { method: "POST" })}>  
                              <a target="_blank" className = "text-white no-underline" href = {`https://forms.hackclub.com/athena-award-projects?stage=${currModuleIdx}`}>Ready to submit?</a>
                            </button>
                          : (data && selectedProject == "_select#")
                            ? <button disabled className={`flex gap-2 mt-3 px-2 py-3 sm:p-3 transition-all duration-700 items-center justify-center ${baseModuleData!.visuals.accents.secondary}`}>
                              Select a project to submit                    
                              </button>
                            : (data && data[1]["message"]["status"] == "approved")
                              ? <button disabled className={`flex gap-2 mt-3 px-2 py-3 sm:p-3 transition-all duration-700 items-center justify-center ${baseModuleData!.visuals.accents.secondary}`}>Stage completed 🎉</button>
                              : (data && data[1]["message"]["status"] == "rejected") 
                                ? <button className={`flex gap-2 mt-3 px-2 py-3 sm:p-3 transition-all duration-700 items-center justify-center ${baseModuleData!.visuals.accents.secondary}`} onClick={ async () =>  await fetch(`/api/user/${session.data?.slack_id}/projects/refresh?stage=${currModuleIdx}`, { method: "POST" })}>
                                    <a target="_blank" className = "text-white no-underline" href = {`https://forms.hackclub.com/athena-award-projects?stage=${currModuleIdx}`}>Your project was rejected - click here to resubmit!</a>
                                  </button>
                                : (data && data[1]["message"]["status"] == "unreviewed")
                                  ? <button disabled className={`flex gap-2 mt-3 px-2 py-3 sm:p-3 transition-all duration-700 items-center justify-center ${baseModuleData!.visuals.accents.secondary}`}>Project awaiting review</button>
                                  : <div>Loading...</div> 
                            }
                    </div>
                  </div>
                </div>
              </motion.div>
              
             <div className = "flex flex-row w-full gap-20">
                <Navigation/>
            </div>
              </motion.div>


          </>
        )}
      </AnimatePresence>
    </div> 
    : session.status === "loading" 
    ? <Loading/> 
    : <Unauthenticated/> }
    </div>
    </>
  )
}

export function StageChecklistItem({ title, delay, link }:{ title: string, link: string, delay: number}) {
  return (
    <motion.div variants={slidingUpVariant} transition={{ delay: 0.5 + (0.09 * delay) }} initial='hidden' animate='visible'  className={`w-full bg-white/20 p-3 flex justify-between`}>
      <div className="flex gap-2">
        <span className="italic">{title}</span>
      </div>
      <button className="flex gap-2 flex-row-reverse">
        <a href = {link} className = "text-white" target="_blank">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 peer">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </a>
      </button>
    </motion.div>
  )
}



