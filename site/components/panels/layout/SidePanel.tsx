'use client';
import { Transition, Dialog } from "@headlessui/react";
import { Dispatch, Fragment, ReactNode, SetStateAction, useState } from "react";
import SidePanelBackground from "./SparkleBackground";
import ActionSegue from "./ActionSegue";

export default function SidePanel({
  openPanel, setOpenPanel, title, children
}:{ openPanel: boolean, setOpenPanel: Dispatch<SetStateAction<boolean>>, title: string, children: ReactNode }) {
  const [widePanel, setWidePanel] = useState(false);
  return (
    <Transition show={openPanel} as={Fragment}>
      <Dialog as={'div'} className="fixed z-40" onClose={() => setOpenPanel(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 z-[1]" />
        </Transition.Child>

        <div className="fixed inset-0 z-[2] overflow-x-clip">
          <div className="flex min-h-full items-center justify-end">
            <Transition.Child
              as={Fragment}
              enter="transition-opacity duration-200 delay-[500ms]"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-200 delay-50"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className={`h-screen transition-[width] max-md:w-[100vw] ${ widePanel ? 'md:w-[100vw]' : 'md:w-[70vw]' } translate-x-0 overflow-hidden bg-hc-secondary text-left shadow-xl`}
                style={{
                }}
              >
                <SidePanelBackground>
                  <div className="p-14">
                    <div className="flex items-center gap-4 text-hc-primary">
                      <button className="size-[52px] shrink-0" onClick={() => setWidePanel(!widePanel)}>
                        <span className="sr-only">expand panel</span>
                        <img src="https://icons.hackclub.com/api/icons/hackclub-red/expand" className="size-[52px]" alt="" />
                      </button>
                      <Dialog.Title
                        as="h2"
                        className="text-5xl font-bold whitespace-nowrap"
                      >
                        {title}
                      </Dialog.Title>

                      <div className="w-full h-3 bg-hc-primary"></div>
                    </div>
                    <div className="mt-2">
                      {children}
                    </div>

                    <div className="mt-4">
                      <button onClick={() => setOpenPanel(false)}>Close</button>
                    </div>
                  </div>

                </SidePanelBackground>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}