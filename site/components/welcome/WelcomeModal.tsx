"use client";
import { Fragment, useEffect, useState, useContext } from "react";
import { signIn, useSession } from "next-auth/react";
import UnauthenticatedWelcomeMessage from "./UnauthenticatedWelcomeMessage";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

export default function WelcomeModal({ props }: { props?: string }) {
  const session = useSession();
  const router = useRouter();
  // session.status === 'authenticated'
  const [isOpen, setIsOpen] = useState(false);

  async function registerUser() {
    const res = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({
        email: session.data!.user.email,
      }),
      headers: {
        Authorization:
          "Bearer " +
          btoa(session.data!.access_token! + ":" + process.env.AUTH_SECRET!),
      },
    }).then((r) => r.json());
    return res;
  }

  return (
    <>
      {session.status === "unauthenticated" && (
        <>
          <button
            className={`${props} text-xl playfair-display border-[#E89368]`}
            onClick={() => setIsOpen(true)}
          >
            log in with hack club slack
          </button>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div className="relative z-50">
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
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="w-[90vw] h-[90vh] md:w-[85vw] md:h-[85vh] transform rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-3 sm:p-6">
                          <div className="bg-greenish w-full h-full rounded-2xl p-6 md:p-12">
                            <div
                              id="inspiration"
                              className="text-white flex flex-col h-full"
                            >
                              <UnauthenticatedWelcomeMessage
                                setOpen={setIsOpen}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
}
