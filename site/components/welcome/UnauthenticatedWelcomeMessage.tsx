import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { AnimatePresence, motion } from "motion/react";

export default function UnauthenticatedWelcomeMessage({
  setOpen,
}: {
  setOpen: (b: boolean) => void;
}) {
  // useEffect(() => {
  //   // Trigger animation after a delay (adjust as needed)
  //   const animationTimeout = setTimeout(() => {
  //     setIsOpen(true);
  //   }, 500);

  //   // Clear the timeout on unmount to avoid memory leaks
  //   return () => clearTimeout(animationTimeout);
  // }, []); // Only run once after component mount

  const inspiration = [
    "Dear visionary hacker,",
    "Behind each line of code is a brushstroke; take your chance to build, to express, to leave your mark on this living gallery of ideas.",
    "Venture forth! Create.",
    "For every project you craft, an artifact awaits...",
    "a testament to your journey through the halls of innovation.",
  ];

  return (
    <div className="flex flex-col justify-between grow overflow-y-auto">
      <div className="space-y-5">
        {inspiration.map((text, i) => (
          <motion.div
            key={i}
            className={
              i === 0
                ? "text-3xl md:text-5xl font-bold italic playfair-display"
                : "text-lg md:text-2xl italic font-serif"
            }
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: "easeOut", delay: i * 0.75 }}
          >
            {text}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: inspiration.length }}
        className="w-full flex flex-col sm:flex-row justify-between self-end"
      >
        <button
          className="underline decoration-slice text-hc-secondary hover:text-hc-primary transition font-bold rounded-full text-center text-lg md:text-4xl italic playfair-display"
          onClick={() => setOpen(false)}
        >
          &lt;- Go back
        </button>
        <button
          className="underline decoration-slice text-hc-secondary hover:text-hc-primary transition font-bold rounded-full text-center text-lg md:text-4xl italic playfair-display"
          onClick={() =>
            signIn("slack", {
              callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/onboarding`,
              team: "T0266FRGM",
            })
          }
        >
          Log in with Slack -&gt;
        </button>
      </motion.div>
    </div>
  );
}
