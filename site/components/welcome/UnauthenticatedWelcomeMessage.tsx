import { Transition } from "@headlessui/react";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

export default function UnauthenticatedWelcomeMessage() {
  const [isOpen, setIsOpen] = useState(false);
  

  useEffect(() => {
    // Trigger animation after a delay (adjust as needed)
    const animationTimeout = setTimeout(() => {
      setIsOpen(true);
    }, 500);

    // Clear the timeout on unmount to avoid memory leaks
    return () => clearTimeout(animationTimeout);
  }, []); // Only run once after component mount

  return (
    <div className="flex flex-col justify-between grow">
      {/* Transition Group for sequential transitions */}
      <div className="space-y-5">
        <Transition
          show={isOpen}
          enter="transition ease-out duration-500"
          enterFrom="opacity-0 translate-y-10"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="text-5xl font-bold">Dear aspiring hacker,</div>
        </Transition>

        <Transition
          show={isOpen}
          enter="transition ease-out duration-500 delay-1000"
          enterFrom="opacity-0 translate-y-10"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="text-3xl">within the syntax and logic lies the power to craft solutions, innovate, and shape the future.</div>
        </Transition>

        <Transition
          show={isOpen}
          enter="transition ease-out duration-500 delay-[2s]"
          enterFrom="opacity-0 translate-y-10"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="text-3xl">Embrace this journey with determination, for each line of code you write is a step towards a world transformed by your intellect and creativity.</div>
        </Transition>
      </div>

      <Transition
        show={isOpen}
        enter="transition ease-out duration-500 delay-[3s]"
        enterFrom="opacity-0 translate-y-10"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >

        
        <button className="w-full bg-hc-primary font-bold text-white rounded-full mt-10 text-center py-3 text-4xl" onClick={() => signIn(undefined, {
          callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/onboarding`, team: "T0266FRGM" 
        })}>Log in with Slack</button>
      </Transition>
    </div>
  );
}