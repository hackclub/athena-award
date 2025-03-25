'use client';
import { Fragment, useEffect, useState, useContext } from 'react';
import { signIn, useSession } from "next-auth/react";
import UnauthenticatedWelcomeMessage from './UnauthenticatedWelcomeMessage';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';

export default function WelcomeModal({props}: {props: string}){
  const session = useSession();
  const router = useRouter();
  // session.status === 'authenticated'
  const [isOpen, setIsOpen] = useState(false);

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
      <button className={`${props} text-2xl playfair-display`} onClick={() => setIsOpen(true)}>start hacking</button>
      <AnimatePresence>
        {isOpen && <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/25 background-blur-md"
            />

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: .95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: .95 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-[85vw] h-[85vh] transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-6">

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
                          <div id="inspiration" className="text-white flex flex-col h-full">
                            <UnauthenticatedWelcomeMessage setOpen={setIsOpen} />
                          </div>
                        )
                      }
                    </div>

                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </>
  )
}

