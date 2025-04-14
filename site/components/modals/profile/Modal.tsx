import { useState, useContext, FormEvent, useEffect, Fragment } from 'react'
import { useSession } from "next-auth/react";
import { UXEventContext } from '@/components/context/UXStages';
import { AnimatePresence, motion } from 'motion/react';
import { Tooltip } from 'react-tooltip';
import { Warning } from '@/components/panels/add-ons/Callout';
import { Progress } from './Progress';
import Waka from './Waka';
import { FaXmark } from 'react-icons/fa6';
import { signOut } from 'next-auth/react';
import Modal from '@/components/panels/layout/PopUpModal';

// i'll migrate this to use useswr but rn it's weird and doesn't want to support more than one call

export default function Profile() {
    const [uxEvent, setUXEvent] = useContext(UXEventContext)
    
    const [ hackathonName, setHackathonName ] = useState("")
    const [ error, setError ] = useState("")
    const [ currentStage, setCurrentStageName ] = useState("")

    const session = useSession();

    const clear = () => {
      setUXEvent("map");
      setError("");
    }

    const submitCode = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      const fo = JSON.parse(JSON.stringify(Object.fromEntries(formData)))
      if (fo.code){
        const response = await fetch(`/api/hackathons/${fo.code}/user/${session.data!.slack_id}`, {
          method: 'POST'
        })
        return response.json()
      }
      return {"error": "Hey! Why are you trying to join a hackathon that doesn't exist? 🤔"}
    }

    const fetchHackathons = async () =>{
      const response = await fetch(`/api/user/${session.data!.slack_id}/hackathons`, {
        method: 'GET'
      }).then(r => r.json()).then(data => {setHackathonName(data["message"])})
      return response
    }

    const fetchStage = async () =>{
      const response = await fetch(`/api/user/${session.data!.slack_id}?query=current_stage`, {
        method: 'GET'
      }).then(r => r.json()).then(data => {setCurrentStageName(data["message"])})
      return response
    }

    useEffect(() => {
      if (session.status === "authenticated" && uxEvent === "profile") {
        fetchHackathons()
        fetchStage()
      }
    }, [uxEvent]);


    return (
        <>
        <Modal uxEvent={uxEvent} uxEventName="profile" setUXEvent={setUXEvent} className="md:grid md:grid-cols-3 max-md:flex max-md:flex-col-reverse">
                    <div className="md:col-span-1 md:h-full md:sticky flex flex-col basis-2/5">
                      <div className="hidden rounded-md bg-white/10 sm:flex items-center gap-4 h-fit p-4 mb-4">
                        <img
                          className="rounded-full size-16 mx-auto md:m-0"
                          src={session.data?.user!.image!}
                        />
                        <div className = "*:truncate truncate">
                          <div className="text-xl">
                            Hi {session.data?.user!.name}!
                          </div>
                          <div className="text-sm">
                            {session.data?.user!.email}
                          </div>
                        </div>
                      </div>
                      <div className="text-white font-bold text-2xl uppercase">Hackathons</div>
                        <div>
                          Part of a{' '}
                          <Tooltip id="hackathon" place="top-start" className="z-10"/>
                          <span 
                            data-tooltip-id="hackathon" 
                            data-tooltip-content="Ask your Days of Service hackathon leads for the unique Athena Award code!" 
                            className="font-bold">
                            hackathon?{' '}
                          </span> 
                          Submit the unique code here:{' '}
                        </div>
                        <form className = "flex flex-row my-4 w-full" onSubmit={ async (event) => {
                          let hackathon = await submitCode(event)
                          fetchHackathons()
                          setError(hackathon.error)
                        }}>
                          <input type="text" name="code" className="!outline-none !border-none !ring-0 rounded-l w-full text-black"/>
                          <button type="submit" className="rounded-r text-white p-2 bg-hc-primary">
                            <img src="https://icons.hackclub.com/api/icons/white/send" className="size-[32px]" alt="Submit" />
                          </button>
                        </form>
                        <div className = "text-sm">
                          { (error) ? <Warning title = "Error">{error}</Warning> :
                            (hackathonName) ? <span>Congratulations! You're registered as an attendee of <b>{hackathonName}</b></span> :
                            null
                          }
                        </div>

                        <div className="text-white font-bold text-2xl uppercase">NEED HELP?</div>
                        <ul className = "list-disc list-inside">
                          <li>For urgent help, DM @phthallo or @phaedra on the Hack Club Slack.</li>
                          <li>For non-urgent help and other questions, send a message in the <a className = "link" href = "https://app.slack.com/client/T0266FRGM/C06T17NQB0B">#athena-awards</a> channel.</li>
                        </ul>
                        <button className = "text-white font-bold text-2xl uppercase mt-auto self-start" onClick={() => signOut({ redirectTo: "/" })}>Sign Out</button>                      
                        
                        </div>
                    
                    {/*<div className="w-[1px] h-full bg-hc-primary" />*/}
                    
                    <div className = "md:col-span-2 flex flex-col gap-3 md:overflow-y-scroll">

                      <div className="self-start *:align-middle flex gap-3 w-full align-middle md:sticky">
                        <div className="*:align-middle w-full h-fit bg-black/25 p-2 rounded flex gap-4">
                          <img src="https://icons.hackclub.com/api/icons/hackclub-red/person" className="size-[32px] self-center align-middle" alt="Profile" />
                          <div className="self-center align-middle text-xl sm:text-3xl playfair-display font-bold italic">Profile</div>
                        </div>
                        <button className="shrink-0" onClick={() => setUXEvent('map')}>
                          <FaXmark className="size-8 md:size-14 text-white" />
                        </button>
                      </div>

                      <div className = "grow overflow-scroll"> 
                        <div className="text-white uppercase text-2xl grow sm:text-3xl font-bold">Progress</div>
                        <div className = "flex flex-col gap-4 my-3">
                          <Progress/>
                          <Waka/>
                        </div>
                      </div>

                    </div>
                  </Modal>
            </>
/* <ProfileIsOpenContext.Provider value={{profileIsOpen: profileIsOpen, setProfileIsOpen: setProfileIsOpen}}>
    <Transition appear show={profileIsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={() => clear()}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95 translate-y-[50vh]"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-[50vh]"
              >
                <Dialog.Panel className="w-full h-[80vh] max-w-5xl transform overflow-auto rounded-xl bg-white text-left align-middle shadow-xl transition-all">
                  <div className="flex min-h-full">
                    <Tab.Group vertical>
                      <Tab.List className="h-[80vh] sticky top-0 flex flex-col p-6 justify-between items-center rounded-l-xl text-hc-primary bg-hc-secondary w-20 sm:w-32">
                        <div className="flex flex-col justify-evenly items-center grow">
                          <Tooltip id="Profile" place="right"  className="z-10"/>
                            <Tab data-tooltip-id="Profile" data-tooltip-content="Profile">
                              <img src="https://icons.hackclub.com/api/icons/hackclub-red/person" className="size-[32px]" alt="" />
                            </Tab>

                            <Tooltip id="Progress" place="right"  className="z-10"/>
                            <Tab data-tooltip-id="Progress" data-tooltip-content="Progress">
                              <img src="https://icons.hackclub.com/api/icons/hackclub-red/checkmark" className="size-[32px]" alt="" />
                            </Tab>

                          <Tooltip id="Achievements" place="right"  className="z-10"/>
                            <Tab data-tooltip-id="Achievements" data-tooltip-content="Achievements">
                              <img src="https://icons.hackclub.com/api/icons/hackclub-red/flag" className="size-[32px]" alt="" />
                            </Tab>


                        </div>
                        <button className="p-2 bg-hc-primary/20 rounded-md w-full overflow-hidden sm:text-base" onClick={() => clear()}>Close</button>
                      </Tab.List>
                    <Tab.Panels className="w-full min-h-full">
                    <Tab.Panel className="w-full h-full p-10">
                    <h2 className="text-4xl text-hc-primary font-bold mb-3">Profile</h2>
                    <div className = "text-xl">
                      <div>
                        {session.status === "authenticated" ? 
                        <Fragment>
                        <div>
                            <div className = "flex md:flex-row flex-col gap-8">
                                <img className = "rounded-full w-3/12 mx-auto md:m-0" src = {`${session.data.user!.image}`}></img>
                                <div>
                                    <h1 className="text-lg sm:text-2xl text-hc-primary">Personal Information</h1>
                                <p>
                                    <b>Name:</b>{' '}
                                    {session.data.user!.name}
                                </p> 
                                <p>
                                    <b>Email:</b>{' '}
                                    {session.data.user!.email}
                                </p> 
                                <p>
                                  <b>Hackathons:</b>{' '}
                                    { hackathonName ? hackathonName : "None" }
                                </p>
                                <p>
                                  <b>Current stage:</b> {' '}
                                    { currentStage ? currentStage : "None"}
                                </p>
                                </div>
                                </div>
                            </div>
                        <div>
                        <h1 className="text-lg sm:text-2xl text-hc-primary">Other</h1>
                        <p>
                            Part of a{' '}
                            <Tooltip id="hackathon" place="top-start" className="z-10"/>
                            <span 
                                data-tooltip-id="hackathon" 
                                data-tooltip-content="Ask your Days of Service hackathon leads for the unique Athena Award code!" 
                                className="font-bold">
                                hackathon?{' '}
                            </span> 
                            Submit the unique code here:{' '}
                            </p>
                            <form className = "flex flex-col sm:flex-row gap-5 my-4" onSubmit={ async (event) => { 
                                {
                                  let hackathon = await submitCode(event)
                                  fetchHackathons()
                                  setError(hackathon.error)
                                  } }}>
                              <input type="text" name="code"/>
                              <button type="submit" className="border rounded-lg bg-hc-primary/60 border-hc-primary/40 text-white p-2">Submit</button>
                            </form>
                            <div className = "text-sm">
                              { (error) ? <Warning title = "Error">{error}</Warning> :
                                (hackathonName) ? <span>Congratulations! You're registered as an attendee of <b>{hackathonName}</b></span> :
                                null
                              }
                            </div>
                        </div>
                        </Fragment>
                        :                          
                        <div>
                            Not signed in. <a href = {process.env.NEXT_PUBLIC_BASE_URL}>Sign in</a>
                        </div> 
                    }
                      </div>
                    </div>
                    </Tab.Panel>
                    <Tab.Panel className = "w-full h-full p-10">
                      <h2 className="text-4xl text-hc-primary font-bold mb-3">Progress</h2>
                      <div className = "flex flex-col gap-4">
                        <Progress/>
                        <Waka/>
                      </div>
                    </Tab.Panel>
                    <Tab.Panel className = "w-full h-full p-10">
                      <h2 className="text-4xl text-hc-primary font-bold mb-3">Achievements</h2>
                      <Achievements/>
                    </Tab.Panel>
                    </Tab.Panels>
                    </Tab.Group>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </ProfileIsOpenContext.Provider> */
    )
}