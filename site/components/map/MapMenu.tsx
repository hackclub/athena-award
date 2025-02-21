'use client'
import { Fragment, useContext, useState } from "react";
import Background from "../landscape/Background";
import { AnimatePresence, motion, Variant, Variants } from "motion/react"
import Image from "next/image";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { Tooltip } from "react-tooltip";
import { ProfileIsOpenContext } from "../island/Modal";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import { Loading, Unauthenticated } from "@/components/screens/Modal";

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
  stages: UserStageData[],
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
  stages: BaseStage[],
}

const exampleData: UserModuleData = {
  moduleName: "Start Hacking",
  stages: [
    {
      name: 'Download your first IDE',
      id: 'download-ide',
      complete: true,
    },
    {
      name: 'Complete your first YSWS',
      id: 'complete-ysws',
      complete: true,
    },
    {
      name: 'Join the Hack Club Slack',
      id: 'join-slack',
      complete: true,
    },
    {
      name: 'Build your personal site',
      id: 'build-site',
      complete: false,
    },
    {
      name: 'Some incomplete task',
      id: 'incomplete-task',
      complete: false,
    },
  ]
}

const secondExampleData: UserModuleData = {
  moduleName: "Level up in web development",
  stages: [
    {
      name: 'Learn HTML',
      id: 'learn-html',
      complete: false,
    },
    {
      name: 'Learn CSS',
      id: 'learn-css',
      complete: false,
    },
    {
      name: 'Learn JavaScript',
      id: 'learn-js',
      complete: false,
    },
    {
      name: 'Learn React',
      id: 'learn-react',
      complete: false,
    },
    {
      name: 'Some incomplete task',
      id: 'incomplete-task',
      complete: false,
    }
  ]
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
const compositeModuleStructure: BaseModule[] = [
  {
    moduleName: 'Start Hacking',
    visuals: {
      name: 'Vista from a Grotto',
      artist: 'David Teniers the Younger',
      src: '/vista.jpg', // the background image
      scene: 'https://prod.spline.design/A3EcLirhCciwn3lU/scene.splinecode', // for the interactive worldly component
      accents: {
        primary: 'bg-rose-950',
        secondary: 'bg-red-900/30',
      }
    },
    completionRewards: [{
      name: 'Lorem ipsum!',
      id: 'lorem-ipsum',
      description: 'This is a really cool reward! Go out there and change the world.',
    }],
    stages: [
      {
        name: 'Start Hacking',
        id: 'start-hacking',
      },
      {
        name: 'Complete your first YSWS',
        id: 'complete-ysws',
      },
      {
        name: 'Join the Hack Club Slack',
        id: 'join-slack',
      },
      {
        name: 'Build your personal site',
        id: 'build-site',
      },
      {
        name: 'Some incomplete task',
        id: 'incomplete-task',
      },
    ],
  },
  {
    moduleName: 'Level up in web development',
    visuals: {
      name: 'The Ponte Salario',
      artist: 'Hubert Robert',
      src: '/ponte-salario.jpg', // the background image
      scene: 'https://prod.spline.design/A3EcLirhCciwn3lU/scene.splinecode', // for the interactive worldly component
      accents: {
        primary: 'bg-sky-950',
        secondary: 'bg-sky-900/30',
      }
    },
    completionRewards: [{
      name: 'Lorem ipsum!',
      id: 'lorem-ipsum',
      description: 'This is a really cool reward! Go out there and change the world.',
    }],
    stages: [
      {
        name: 'Learn HTML',
        id: 'learn-html',
      },
      {
        name: 'Learn CSS',
        id: 'learn-css',
      },
      {
        name: 'Learn JavaScript',
        id: 'learn-js',
      },
      {
        name: 'Learn React',
        id: 'learn-react',
      },
      {
        name: 'Some incomplete task',
        id: 'incomplete-task',
      },
    ],
  }
]

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

export default function MapMenu({ module, progress = compositeUserModuleData, setModule }:{ module: string, progress?: UserModuleData[], setModule: (module: string) => void }) {
  const [fullscreen, setFullscreen] = useState(false);

  const baseModuleData = compositeModuleStructure.find(m => m.moduleName === module)!;
  const userModuleData = progress.find(m => m.moduleName === module)!;
  const currModuleIdx = progress.findIndex(p => p.moduleName === module)
  const nextModule = progress[(currModuleIdx + 1) % progress.length].moduleName
  const prevModule = progress[(currModuleIdx - 1 + progress.length) % progress.length].moduleName
  const percentageProgressInThisModule = progress.find(p => p.moduleName === module)!.stages.filter(s => s.complete).length / progress.find(p => p.moduleName === module)!.stages.length * 100;
  const session = useSession();

  return (
    <div>
    { session.status === "authenticated" ? 
    <div className={`w-screen h-screen relative ${baseModuleData.visuals.accents.primary}`}>
      <div className="fixed w-screen h-screen">
        <AnimatePresence>
          {fullscreen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1.5} }} exit={{ opacity: 0, transition: { delay: 0 } }}>
              <Background shouldAnimate={fullscreen} />
              <motion.div className="fixed z-10 text-white">
                <div className="fixed top-16 right-16">
                  <button onClick={() => setFullscreen(false)}>
                    <span className="sr-only">Close</span>
                    <svg fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414" xmlns="http://www.w3.org/2000/svg" aria-label="view-close" viewBox="0 0 32 32" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="48" height="48"><g><path d="M11.121,9.707c-0.39,-0.391 -1.024,-0.391 -1.414,0c-0.391,0.39 -0.391,1.024 0,1.414l4.95,4.95l-4.95,4.95c-0.391,0.39 -0.391,1.023 0,1.414c0.39,0.39 1.024,0.39 1.414,0l4.95,-4.95l4.95,4.95c0.39,0.39 1.023,0.39 1.414,0c0.39,-0.391 0.39,-1.024 0,-1.414l-4.95,-4.95l4.95,-4.95c0.39,-0.39 0.39,-1.024 0,-1.414c-0.391,-0.391 -1.024,-0.391 -1.414,0l-4.95,4.95l-4.95,-4.95Z"></path></g></svg>
                  </button>
                </div>
                <motion.div layout className="fixed bottom-16 right-16 px-4 py-2 bg-black/40 text-white rounded-full text-right flex group-hover:gap-4 items-center group transition-all">
                  {/* <div className="">The background is:</div> */}
                  <div className="size-10 rounded-full bg-white"></div>
                  <div className="overflow-hidden w-0 group-hover:w-auto h-14">
                    <div className="italic playfair-display text-xl">{baseModuleData.visuals.name}</div>
                    <div className="italic text-base">{baseModuleData.visuals.artist}</div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {!fullscreen &&
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: [1, 0], transition: { delay: 0.5, duration: 0.75 } }} className={`w-screen h-screen px-20 py-14 fixed overflow-y-scroll z-10 transition duration-700 backdrop-blur-xl ${baseModuleData.visuals.accents.primary}`}>
          <motion.div key={`${module}-full`} variants={slidingParentVariant} initial='hidden' animate='visible' className="grid grid-cols-5 gap-10">
          <ProfileModal />
            <div className="col-span-full lg:col-span-3">
              <motion.div key={`${module}-img`} variants={slidingUpVariant} className='aspect-[3/2] bg-white group transition-all rounded-2xl' style={{
                backgroundImage: `url('${baseModuleData!.visuals.src}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }} onClick={() => {
                setFullscreen(!fullscreen);
              }}>
                <div className="w-full h-full bg-black/0 group-hover:bg-black/30 transition cursor-zoom-in rounded-2xl flex items-center justify-center text-white">
                  <span className="opacity-0 group-hover:opacity-100">Click to go</span>
                </div>
              </motion.div>
              <motion.div key={`${module}-progress`} variants={slidingUpVariant} transition={{ delay: 0.2 }} initial='hidden' animate='visible'  className="mt-5 flex gap-2 w-full items-center">
                <div className="w-full h-3 rounded-full bg-white/40">
                  <div className="h-full bg-white rounded-full" style={{
                    width: `${percentageProgressInThisModule}%`
                  }}></div>
                </div>
                <div className="text-white text-base">{percentageProgressInThisModule}%</div>
              </motion.div>
            </div>
            <div className="col-span-full lg:col-span-2 text-white">
              <motion.h2 variants={slidingUpVariant} transition={{ delay: 0.3 }} initial='hidden' animate='visible' className="text-3xl">Modules</motion.h2>
              <motion.div key={`${module}-details`} variants={slidingUpVariant} transition={{ delay: 0.4 }} initial='hidden' animate='visible' className="h-[30vh] overflow-scroll my-5 space-y-3 pr-4">
                {userModuleData.stages.map((stage, i) => (
                  <StageChecklistItem key={i} title={stage.name} complete={stage.complete} delay={i} module={module} />
                ))}
              </motion.div>

              <h2 className="text-3xl">Completion Rewards</h2>
              <div className={`flex gap-2 mt-3 p-3 transition duration-700 ${baseModuleData!.visuals.accents.secondary}`}>
                <div className="size-20 rounded-md bg-red-800 shrink-0 flex items-center justify-center text-center">to be an image</div>
                <div className="">
                  <div className="text-xl">Lorem ipsum!</div>
                  <div>This is a super cool and intellectually engaging description! Go out there and change the world!</div>
                </div>
              </div>
            </div>
            <div className="col-span-full lg:col-span-3">
              <h1 className="text-white font-bold text-5xl italic mb-3">{module}</h1>
              <motion.p variants={slidingUpVariant} transition={{ delay: 0.45 }} initial='hidden' animate='visible' className="text-white leading-normal text-lg italic font-light">Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae sed consectetur nemo? Quod veniam ab illo quia architecto dignissimos, aliquam explicabo voluptatum mollitia beatae porro itaque possimus animi molestiae natus!</motion.p>
            </div>
            <div className="col-span-full lg:col-span-2"> {/* TO DO: move this section on top of the image on smaller screens */}
              <div className="w-full h-full relative">
                <div className="absolute right-0 bottom-0 flex gap-2 items-center text-white">
                  <button onClick={() => {setModule(prevModule);}} className="playfair-display italic text-2xl">
                    <span className="sr-only">Previous</span>
                    <svg fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414" xmlns="http://www.w3.org/2000/svg" aria-label="view-back" viewBox="0 0 32 32" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="48" height="48"><g><path d="M19.768,23.89c0.354,-0.424 0.296,-1.055 -0.128,-1.408c-1.645,-1.377 -5.465,-4.762 -6.774,-6.482c1.331,-1.749 5.1,-5.085 6.774,-6.482c0.424,-0.353 0.482,-0.984 0.128,-1.408c-0.353,-0.425 -0.984,-0.482 -1.409,-0.128c-1.839,1.532 -5.799,4.993 -7.2,6.964c-0.219,0.312 -0.409,0.664 -0.409,1.054c0,0.39 0.19,0.742 0.409,1.053c1.373,1.932 5.399,5.462 7.2,6.964l0.001,0.001c0.424,0.354 1.055,0.296 1.408,-0.128Z"></path></g></svg>
                  </button>
                  <span key={`${module}-section-status`} className="italic text-2xl">
                    Stage {currModuleIdx + 1} / {progress.length}
                  </span>
                  <button onClick={() => {setModule(nextModule);}} className="playfair-display italic text-2xl">
                    <span className="sr-only">Next</span>
                    <svg fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414" xmlns="http://www.w3.org/2000/svg" aria-label="view-forward" viewBox="0 0 32 32" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="48" height="48"><g><path d="M12.982,23.89c-0.354,-0.424 -0.296,-1.055 0.128,-1.408c1.645,-1.377 5.465,-4.762 6.774,-6.482c-1.331,-1.749 -5.1,-5.085 -6.774,-6.482c-0.424,-0.353 -0.482,-0.984 -0.128,-1.408c0.353,-0.425 0.984,-0.482 1.409,-0.128c1.839,1.532 5.799,4.993 7.2,6.964c0.219,0.312 0.409,0.664 0.409,1.054c0,0.39 -0.19,0.742 -0.409,1.053c-1.373,1.932 -5.399,5.462 -7.2,6.964l-0.001,0.001c-0.424,0.354 -1.055,0.296 -1.408,-0.128Z"></path></g></svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </div> 
    : session.status === "loading" 
    ? <Loading/> 
    : <Unauthenticated/> }
    </div>
  )
}

export function StageChecklistItem({ title, link, complete, delay, module }:{ title: string, link?: string, complete: boolean, delay: number, module: typeof compositeModuleStructure[number]['moduleName'] }) {
  const currModule = compositeModuleStructure.find(m => m.moduleName === module)!;
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
  const { profileIsOpen, setProfileIsOpen } = useContext(ProfileIsOpenContext)
  const session = useSession();
  return (
    <>
    <ProfileIsOpenContext.Provider value = {{profileIsOpen: profileIsOpen, setProfileIsOpen: setProfileIsOpen }}>
      <button onClick={() => {
        console.log(profileIsOpen)
        setProfileIsOpen(true);
      }} id="profile" className="mb-5 absolute right-6 top-6">
        {/* <img src="" width={48} height={48} alt="Profile details" /> */}
        <span className="ml-auto size-10 rounded-full bg-cover bg-no-repeat bg-center block" style={{
          backgroundImage: `url('${session.data!.user.image ? session.data!.user.image : "https://th.bing.com/th/id/OIP.eC3EaX3LZiyZlEnZmQjhngHaEK?w=318&h=180&c=7&r=0&o=5&dpr=2&pid=1"}')`
        }}></span>
      </button>
    </ProfileIsOpenContext.Provider>
    </>
  )
}

