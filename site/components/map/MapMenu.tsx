'use client'
import { Fragment, useContext, useState } from "react";
import Background from "../landscape/Background";
import { AnimatePresence, motion, Variant, Variants } from "motion/react"
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import { Loading, Unauthenticated } from "@/components/screens/Modal";
import { STAGES } from "@/app/STAGES";
import ActionableScene from "../landscape/ActionableScene";
import { FaPaintbrush } from "react-icons/fa6";
import { UXEventContext } from "../context/UXStages";
import useSWR from "swr";
import { multiFetcher } from "@/services/fetcher";
import { useEffect } from "react";
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

const exampleData: UserModuleData = {
  moduleName: "Start hacking"
}

const secondExampleData: UserModuleData = {
  moduleName: "Your second project"
}

/**
 * This will not be hardcoded data; the user's progress is indicated by User{item}Data while to-be-hardcoded information is represented as Base{item}.
 */
const compositeUserModuleData: UserModuleData[] = [
  exampleData,
  secondExampleData,
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


export default function MapMenu({ module, progress = compositeUserModuleData, setModule }:{ module: typeof STAGES[number]['moduleName'], progress?: UserModuleData[], setModule: (module: typeof STAGES[number]['moduleName']) => void }) {
  const [fullscreen, setFullscreen] = useState(false);
  const [ selectedProject, setSelectedProject ] = useState("")
  const baseModuleData = STAGES.find(m => m.moduleName === module)!;
  const currModuleIdx = progress.findIndex(p => p.moduleName === module)
  const nextModule = progress[(currModuleIdx + 1) % progress.length].moduleName
  const prevModule = progress[(currModuleIdx - 1 + progress.length) % progress.length].moduleName
  // const percentageProgressInThisModule = progress.find(p => p.moduleName === module)!.stages.filter(s => s.complete).length / progress.find(p => p.moduleName === module)!.stages.length * 100;
  const session = useSession();
  const slackId = session.data?.slack_id
  const urls = [`/api/user/${slackId}/projects?query=all`, `/api/user/${slackId}/projects?query=selected&stage=${currModuleIdx+1}`]
  const { data, error, isLoading, mutate } = useSWR(urls, multiFetcher)
  if (error){
    console.log(error)
  }
  let projects
  if (data){
    projects = (data[0] as any)["data"]["projects"]
  }
  useEffect(() => {
    if (data){
      if ((data[1] as any)["message"]){
        setSelectedProject((data[1] as any)["message"])
      } else {
        setSelectedProject("_select")
      }
    }
  }, [data])

  async function handleChange(e: any){ // i cbf to fix type 2
    const projectName = e.target.value
    const update = await fetch (`/api/user/${slackId}/projects`, { method: "POST", body: JSON.stringify({stage: currModuleIdx + 1, project: projectName})})
    setSelectedProject(projectName)
    return update
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`flex gap-8 lg:gap-0 flex-col backdrop-blur-md h-full lg:h-screen w-screen p-12 sm:p-20 ${baseModuleData.visuals.accents.tertiary} transition-all`}>
              
              <div className = "self-start">
                <div className="text-xl sm:text-2xl uppercase text-white font-bold mb-2">Athena Award</div>
                <h1 className="text-4xl sm:text-6xl uppercase italic text-white font-bold">The Gallery</h1>
              </div>
              
              <motion.div className="grow grid grid-cols-5 gap-10 items-center">
                <ProfileModal />
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
                    <h1 className="text-white font-bold text-4xl sm:text-5xl italic mb-3">{currModuleIdx+1}: {module}</h1>
                    
                    <motion.p transition={{ delay: 0.45 }} initial='hidden' animate='visible' className="text-white leading-normal text-md sm:text-lg italic font-light">{baseModuleData.description.split('\n').map((text, i) => (
                      <Fragment key={i}>
                        {i > 0 && <br />}
                        {text}
                      </Fragment>
                    ))}</motion.p>
                  </motion.div>
                  <div className = "my-5">
                    <h2 className="text-2xl sm:text-3xl text-white italic">Completion Rewards</h2>
                    <div className={`flex gap-2 mt-3 p-3 duration-700 ${baseModuleData!.visuals.accents.secondary} transition-all`}>
                      <div className="size-20 rounded-md bg-red-800 shrink-0 hidden sm:flex items-center justify-center text-center">to be an image</div>
                      <div className="">
                        <div className="text-xl">Lorem ipsum!</div>
                        <div>This is a super cool and intellectually engaging description! Go out there and change the world!</div>
                      </div>
                    </div>
                  </div>
                  

                <div className = "my-5 flex flex-col sm:flex-row w-full justify-between gap-4">
                {data && selectedProject ? 
                  <div className = "">
                    <label htmlFor="project" className = "font-bold text-accent">What project are you working on?</label>
                              <select required className="w-full sm:w-max flex flex-col gap-1 *:bg-darker text-black *:text-black" name = "project" id="project" defaultValue={selectedProject} onChange={handleChange}>
                                <option disabled value = "_select">[Select a project]</option>
                                  {projects && projects.map((project: any, index: number) => /* i really cbf to fix the type rn */
                                      <option key={index} value = {project.name}>{project.name}</option>
                                  )}
                              </select>
                    </div>
                    : <div className={`flex gap-2 mt-3 p-3 transition-all duration-700 items-center justify-center ${baseModuleData!.visuals.accents.secondary}`}>Loading...</div>}

                    <div className = "self-center sm:self-end">
                      <button className={`flex gap-2 mt-3 px-2 py-3 sm:p-3 transition-all duration-700 items-center justify-center ${baseModuleData!.visuals.accents.secondary}`}>
                      <a className = "text-white no-underline" href = {`https://forms.hackclub.com/athena-awards-projects?stage=${currModuleIdx+1}`}>Ready to submit?</a>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <div className="flex gap-2 self-center sm:self-auto items-center text-white">
              <button onClick={() => {setModule(prevModule as typeof STAGES[number]['moduleName']); setSelectedProject("")}} className="playfair-display italic text-2xl">
                <span className="sr-only">Previous</span>
                <svg fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414" xmlns="http://www.w3.org/2000/svg" aria-label="view-back" viewBox="0 0 32 32" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="48" height="48"><g><path d="M19.768,23.89c0.354,-0.424 0.296,-1.055 -0.128,-1.408c-1.645,-1.377 -5.465,-4.762 -6.774,-6.482c1.331,-1.749 5.1,-5.085 6.774,-6.482c0.424,-0.353 0.482,-0.984 0.128,-1.408c-0.353,-0.425 -0.984,-0.482 -1.409,-0.128c-1.839,1.532 -5.799,4.993 -7.2,6.964c-0.219,0.312 -0.409,0.664 -0.409,1.054c0,0.39 0.19,0.742 0.409,1.053c1.373,1.932 5.399,5.462 7.2,6.964l0.001,0.001c0.424,0.354 1.055,0.296 1.408,-0.128Z"></path></g></svg>
              </button>
              <span key={`${module}-section-status`} className="italic text-lg md:text-2xl">
                Project {currModuleIdx + 1} / {progress.length}
              </span>
              <button onClick={() => {setModule(nextModule as typeof STAGES[number]['moduleName']); setSelectedProject("")}} className="playfair-display italic text-2xl">
                <span className="sr-only">Next</span>
                <svg fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414" xmlns="http://www.w3.org/2000/svg" aria-label="view-forward" viewBox="0 0 32 32" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="48" height="48"><g><path d="M12.982,23.89c-0.354,-0.424 -0.296,-1.055 0.128,-1.408c1.645,-1.377 5.465,-4.762 6.774,-6.482c-1.331,-1.749 -5.1,-5.085 -6.774,-6.482c-0.424,-0.353 -0.482,-0.984 -0.128,-1.408c0.353,-0.425 0.984,-0.482 1.409,-0.128c1.839,1.532 5.799,4.993 7.2,6.964c0.219,0.312 0.409,0.664 0.409,1.054c0,0.39 -0.19,0.742 -0.409,1.053c-1.373,1.932 -5.399,5.462 -7.2,6.964l-0.001,0.001c-0.424,0.354 -1.055,0.296 -1.408,-0.128Z"></path></g></svg>
              </button>
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

export function StageChecklistItem({ title, link, complete, delay, module }:{ title: string, link?: string, complete: boolean, delay: number, module: typeof STAGES[number]['moduleName'] }) {
  const currModule = STAGES.find(m => m.moduleName === module)!;
  return (
    <motion.div variants={slidingUpVariant} transition={{ delay: 0.5 + (0.09 * delay) }} initial='hidden' animate='visible'  className={`w-full bg-red-900 p-4 flex justify-between items-center ${currModule.visuals.accents.secondary}`}>
      <div className="flex gap-2 items-center">
        <span>
          {complete ? 
            <svg className="size-7" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414" xmlns="http://www.w3.org/2000/svg" aria-label="checkmark" viewBox="0 0 32 32" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="48" height="48" ><g><path d="M16,8c2.476,0 4.074,0.209 5.138,0.572c0.414,0.141 0.886,0.076 1.195,-0.234l0.509,-0.508c0.222,-0.222 0.186,-0.593 -0.092,-0.739c-1.527,-0.801 -3.704,-1.091 -6.75,-1.091c-8,0 -10,2 -10,10c0,8 2,10 10,10c8,0 10,-2 10,-10c0,-0.346 -0.004,-0.68 -0.012,-1.004c-0.01,-0.431 -0.526,-0.629 -0.831,-0.324l-0.863,0.862c-0.188,0.189 -0.294,0.444 -0.291,0.711c0.02,2.029 0.074,4.85 -1.417,6.341c-0.864,0.864 -2.572,1.414 -6.586,1.414c-4.014,0 -5.722,-0.55 -6.586,-1.414c-0.864,-0.864 -1.414,-2.572 -1.414,-6.586c0,-4.014 0.55,-5.722 1.414,-6.586c0.864,-0.864 2.572,-1.414 6.586,-1.414Z"></path><path d="M10.707,14.293c-0.39,0.39 -0.39,1.024 0,1.414l4.586,4.586c0.39,0.39 1.024,0.39 1.414,0l11.586,-11.586c0.39,-0.39 0.39,-1.024 0,-1.414l-0.336,-0.336c-0.39,-0.39 -1.024,-0.39 -1.414,0l-10.543,10.543l-3.543,-3.543c-0.39,-0.39 -1.024,-0.39 -1.414,0l-0.336,0.336Z"></path></g></svg> : 
            <svg className="size-7" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414" xmlns="http://www.w3.org/2000/svg" aria-label="checkmark" viewBox="0 0 32 32" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="48" height="48" ><g><path d="M22.586,22.586c0.864,-0.864 1.414,-2.572 1.414,-6.586c0,-4.014 -0.55,-5.722 -1.414,-6.586c-0.864,-0.864 -2.572,-1.414 -6.586,-1.414c-4.014,0 -5.722,0.55 -6.586,1.414c-0.864,0.864 -1.414,2.572 -1.414,6.586c0,4.014 0.55,5.722 1.414,6.586c0.864,0.864 2.572,1.414 6.586,1.414c4.014,0 5.722,-0.55 6.586,-1.414Zm-6.586,3.414c8,0 10,-2 10,-10c0,-8 -2,-10 -10,-10c-8,0 -10,2 -10,10c0,8 2,10 10,10Z"></path></g></svg>
          }
        </span>
        <span className="italic">{title}</span>
      </div>
      <button className="flex gap-2 flex-row-reverse">
        <svg className="size-7 peer" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414" xmlns="http://www.w3.org/2000/svg" aria-label="view-forward" viewBox="0 0 32 32" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="48" height="48"><g><path d="M12.982,23.89c-0.354,-0.424 -0.296,-1.055 0.128,-1.408c1.645,-1.377 5.465,-4.762 6.774,-6.482c-1.331,-1.749 -5.1,-5.085 -6.774,-6.482c-0.424,-0.353 -0.482,-0.984 -0.128,-1.408c0.353,-0.425 0.984,-0.482 1.409,-0.128c1.839,1.532 5.799,4.993 7.2,6.964c0.219,0.312 0.409,0.664 0.409,1.054c0,0.39 -0.19,0.742 -0.409,1.053c-1.373,1.932 -5.399,5.462 -7.2,6.964l-0.001,0.001c-0.424,0.354 -1.055,0.296 -1.408,-0.128Z"></path></g></svg>
        <span className="text-sm opacity-0 peer-hover:opacity-100 transition">Go to activity</span>
      </button>
      
    </motion.div>
  )
}

function ProfileModal() {
  const [_, setUXEvent] = useContext(UXEventContext)
  const session = useSession();
  return (
    <>
      <button onClick={() => {
        setUXEvent("profile");
      }} id="profile" className="mb-5 absolute right-8 top-8 sm:right-16 sm:top-16">
        {/* <img src="" width={48} height={48} alt="Profile details" /> */}
        <span className="ml-auto size-10 rounded-full bg-cover bg-no-repeat bg-center block" style={{
          backgroundImage: `url('${session.data!.user.image ? session.data!.user.image : "https://th.bing.com/th/id/OIP.eC3EaX3LZiyZlEnZmQjhngHaEK?w=318&h=180&c=7&r=0&o=5&dpr=2&pid=1"}')`
        }}></span>
      </button>
    </>
  )
}

