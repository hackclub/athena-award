import Icon from '@hackclub/icons'
import { Dialog, Tab, Transition } from '@headlessui/react'
import { Fragment, useState, useContext, FormEvent, useEffect } from 'react'
import { useSession } from "next-auth/react";
import { Tooltip } from 'react-tooltip';
import { ProfileIsOpenContext } from '../island/Modal';
import { Session } from 'next-auth';
import { Warning } from '@/components/panels/add-ons/Callout';
import { Achievements } from './Achievements';
import { Progress } from './Progress';
import Waka from './Waka';

// i'll migrate this to use useswr but rn it's weird and doesn't want to support more than one call

export default function Profile(){
    const { profileIsOpen, setProfileIsOpen } = useContext(ProfileIsOpenContext)
    const [ hackathonName, setHackathonName ] = useState("")
    const [ error, setError ] = useState("")
    const [ currentStage, setCurrentStageName ] = useState("")

    const session = useSession();
    function clear(){
      setProfileIsOpen(false)
      setError("")
    }

    async function submitCode(event: FormEvent<HTMLFormElement>){
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
    async function fetchHackathons(){
      const response = await fetch(`/api/user/${session.data!.slack_id}/hackathons`, {
        method: 'GET'
      }).then(r => r.json()).then(data => {setHackathonName(data["message"])})
      return response
    }

    async function fetchStage(){
      const response = await fetch(`/api/user/${session.data!.slack_id}?query=current_stage`, {
        method: 'GET'
      }).then(r => r.json()).then(data => {setCurrentStageName(data["message"])})
      return response
      }

    useEffect(() => {
      if (session.status === "authenticated"){
        fetchHackathons()
        fetchStage()
      }
    }, [profileIsOpen])

    return (
        <>
<ProfileIsOpenContext.Provider value={{profileIsOpen: profileIsOpen, setProfileIsOpen: setProfileIsOpen}}>
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
                      <Tab.List className="h-[80vh] sticky top-0 flex flex-col p-6 justify-between items-center rounded-l-xl text-hc-primary bg-hc-secondary w-20 sm:w-32"> {/* fix not being able to see achievements on mobile */}
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
                                <img className = "rounded-full w-4/12 mx-auto md:m-0" src = {`${session.data.user!.image}`}></img>
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
                      <Progress/>
                      <Waka/>
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
    </ProfileIsOpenContext.Provider>
    </>
    )
}