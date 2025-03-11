// defunct
import Icon from '@hackclub/icons'
import { Dialog, Tab, Transition } from '@headlessui/react'
import { Fragment, useContext  } from 'react';
import { Tooltip } from 'react-tooltip';
import { MapIsOpenContext } from '../island/Modal'
import DraggableMap from './DraggableMap';
import AchievementsTab from './AchievementsTab';
import { useRouter } from 'next/navigation';

export default function Map() {
  const { mapIsOpen, setMapIsOpen } = useContext(MapIsOpenContext)
  const router = useRouter()
  return (
    <>
      <MapIsOpenContext.Provider value={{ mapIsOpen: mapIsOpen, setMapIsOpen: setMapIsOpen }}>      
        <Transition appear show={mapIsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={() => setMapIsOpen(false)}>
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
                <Dialog.Panel className="w-full h-[80vh] max-w-5xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all">
                  <div className="flex min-h-full">
                    <Tab.Group vertical>
                      <Tab.List className="h-[80vh] flex flex-col p-6 justify-between items-center rounded-l-xl text-hc-primary bg-hc-secondary w-32">
                        <div className="flex flex-col justify-evenly items-center grow">
                          <div className="-rotate-90 font-bold text-2xl px-7 whitespace-nowrap">CHAPTER 1</div>

                          <div className="gap-4 flex flex-col">
                            <Tooltip id="Progress" place="right" className="z-10"/>
                            <Tab data-tooltip-id="Progress" data-tooltip-content="Map">
                              <img src="https://icons.hackclub.com/api/icons/hackclub-red/compass" className="size-[32px]" alt="" />
                            </Tab>
                            
                            <Tooltip id="Chapters" place="right" className="z-10" />
                            <Tab data-tooltip-id="Chapters" data-tooltip-content="Chapters">
                              <img src="https://icons.hackclub.com/api/icons/hackclub-red/expand" className="size-[32px]" alt="" />
                            </Tab>

                            <Tooltip id="Fast Forward" place="right" className="z-10" />
                            <Tab data-tooltip-id="Fast Forward" data-tooltip-content="Fast Forward">
                              <img src="https://icons.hackclub.com/api/icons/hackclub-red/rep" className="size-[32px]" alt="" />
                            </Tab>
                            
                            <Tooltip id="Achievements" place="right"  className="z-10"/>
                            <Tab data-tooltip-id="Achievements" data-tooltip-content="Achievements">
                              <img src="https://icons.hackclub.com/api/icons/hackclub-red/flag" className="size-[32px]" alt="" />
                            </Tab>
                          </div>
                        </div>
                        
                        <button className="p-2 bg-hc-primary/20 rounded-md w-full" onClick={() => setMapIsOpen(false)}>Close</button>
                      </Tab.List>
                      <Tab.Panels className="w-full min-h-full">
                        <Tab.Panel className="w-full h-full bg-hc-green overflow-hidden">
                          <DraggableMap />
                        </Tab.Panel>
                        <Tab.Panel className="flex max-w-full items-stretch h-full">
                          <div className="basis-1/4 group hover:basis-1/3 text-center transition-all delay-100 duration-500 ease-out bg-hc-secondary px-4 flex flex-col justify-center items-center" role="button" onClick={() => {router.push("/adventure/discovery/getting-started"); console.log('clicked')}}>
                            <div className="flex justify-center flex-col items-center">
                              <div className="text-4xl font-bold text-hc-primary group-hover:text-5xl whitespace-nowrap duration-500 transition-all">1</div>
                              <div className="text-2xl font-bold text-hc-primary group-hover:text-3xl whitespace-nowrap duration-500 transition-all">Discovery</div>
                            </div>
                            <img
                              src="https://cloud-4s37kwlps-hack-club-bot.vercel.app/0chapter-1.png"
                              width={345}
                              height={372}
                              className="w-full h-auto"
                              alt=""
                            />
                          </div>
                          <div className="basis-1/4 hover:basis-1/3 text-center flex items-center justify-center transition-all delay-100 duration-500 ease-out px-4 bg-orange-300/15 relative gap-48">
                            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                            <div className="flex justify-center flex-col items-center">
                              <div className="text-4xl font-bold text-orange-300 group-hover:text-5xl duration-500 transition-all">2</div>
                              <div className="text-2xl font-bold text-orange-300 group-hover:text-3xl duration-500 transition-all">First Line of Code</div>
                            </div>
                              <div className="w-full h-auto flex items-center justify-center aspect-[345_/_372]">
                                <div className="bg-white h-20 w-20 rounded-full flex items-center justify-center text-gray-400">
                                  <img src="https://icons.hackclub.com/api/icons/0x9ca3af/private" className="size-[72px]" alt="" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="basis-1/4 hover:basis-1/3 text-center flex items-center justify-center transition-all delay-100 duration-500 ease-out px-4 bg-hc-green/15 relative gap-48">
                            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                            <div className="flex justify-center flex-col items-center">
                              <div className="text-4xl font-bold text-hc-green group-hover:text-5xl duration-500 transition-all">3</div>
                              <div className="text-2xl font-bold text-hc-green group-hover:text-3xl duration-500 transition-all">Hacky with Hack Club</div>
                            </div>
                              <div className="w-full h-auto flex items-center justify-center aspect-[345_/_372]">
                                <div className="bg-white h-20 w-20 rounded-full flex items-center justify-center">
                                  <img src="https://icons.hackclub.com/api/icons/0x9ca3af/private" className="size-[72px]" alt="" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="basis-1/4 hover:basis-1/3 text-center flex items-center justify-center transition-all delay-100 duration-500 ease-out px-4 bg-hc-blue/15 relative gap-48">
                            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                            <div className="flex justify-center flex-col items-center">
                              <div className="text-4xl font-bold text-hc-blue group-hover:text-5xl duration-500 transition-all">4</div>
                              <div className="text-2xl font-bold text-hc-blue group-hover:text-3xl duration-500 transition-all">Leveling Up</div>
                            </div>
                              <div className="w-full h-auto flex items-center justify-center aspect-[345_/_372]">
                                <div className="bg-white h-20 w-20 rounded-full flex items-center justify-center text-gray-400">
                                  <img src="https://icons.hackclub.com/api/icons/0x9ca3af/private" className="size-[72px]" alt="" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Tab.Panel>
                        <Tab.Panel>fast forward</Tab.Panel>
                        <Tab.Panel className="min-w-full min-h-full bg-hc-secondary/60 p-4">
                          <h2 className="text-4xl text-hc-primary font-bold">Achievements</h2>
                          <div className="text-lg">Congratulate yourself! You've written <span className="font-bold">167</span> lines of code!</div>
                          <AchievementsTab />
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
      </MapIsOpenContext.Provider>
    </>
  )
}
