'use client';
import { Transition, Dialog } from '@headlessui/react';
import { Fragment, useEffect, useState, useContext } from 'react';
import { signIn, useSession } from "next-auth/react";
import UnauthenticatedWelcomeMessage from './UnauthenticatedWelcomeMessage';
import { useRouter } from 'next/navigation';

export default function WelcomeModal() {
  const session = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(session.status === 'authenticated');

  async function registerUser() {
    const res = await fetch('/api/user',  
      {
        method: "POST", 
        body: JSON.stringify({
            email: session.data!.user.email,
          }),
        headers: { Authorization: "Bearer " + btoa(session.data!.access_token! + ":" + process.env.AUTH_SECRET!)}
  }).then(r => r.json())
    return res
  }

  return (
    <>
      <button className="m-5 p-5 bg-hc-primary-dull mx-auto rounded-xl text-center text-hc-secondary" onClick={() => setIsOpen(true)}><h1 className="text-2xl">start hacking</h1></button>
      <Transition
        show={isOpen}
        enter="transition duration-100 ease-out"
        enterFrom="scale-95"
        enterTo="scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="scale-100 opacity-100"
        leaveTo="scale-95 opacity-0"
        // as={Fragment}
      >
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 background-blur-md" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                enter="transition-all ease-in-out duration-700"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-[85vw] h-[85vh] transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-6">

                  <div className="bg-[#373E2F] w-full h-full rounded-2xl p-12">
                    {
                      session.status === 'authenticated' ? (
                        <div id="success-auth" className="justify-center flex flex-col h-full py-[5vh]">
                          <div>
                            <div className="text-5xl font-bold text-white">Hello <span className="text-hc-secondary">{session.data.user!.name}</span>!</div>
                            <div className="text-xl text-white">You've successfully logged in with Slack. Proceed with your journey...</div>
                          </div>
                          <button className="w-full bg-hc-primary font-bold text-white rounded-full mt-10 text-center py-3 text-4xl" onClick={() => {router.push("/onboarding"); registerUser() }}>Proceed</button>
                        </div>
                      ) : (
                        <div id="inspiration" className="text-white flex flex-col h-full py-12">
                          <UnauthenticatedWelcomeMessage />
                        </div>
                      )
                    }
                  </div>

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

