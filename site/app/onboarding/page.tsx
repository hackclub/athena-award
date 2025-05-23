"use client";
import { useSession } from "next-auth/react";
import { Loading, Unauthenticated } from "@/components/screens/Modal";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import PartnerDropdown from "@/components/ui/PartnerDropdown";

const steps = [
  {
    step: "1. Build three projects 💻",
    description:
      "Code three projects that challenge you. Things for school and work don't count!",
  },
  {
    step: "2. Ship your projects ⛵",
    description:
      "What's the point of making a project if no one else can use it? To 'ship' your project, open-source it and create a working version of it that others online can try!",
  },
  {
    step: "3. Code for 30 hours ⏰",
    description:
      "Redeem the artifacts you earn from coding for prizes. Complete the Athena Award to earn an invite for a hackathon in New York City.",
  },
];

export default function Page() {
  const session = useSession();
  const router = useRouter();
  const [stage, setStage] = useState(1);
  const [hackatimeInstalled, setHackatimeInstalled] = useState(false);
  const [track, setTrack] = useState("beginner");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  async function checkIfHackatime() {
    if (stage === 3){
      let hackatime;
      hackatime = await fetch(`/api/user/${session.data?.slack_id}/waka`).then(r => r.json())      
      console.log(hackatime, "stats")
      if (hackatime && hackatime.data && hackatime.data.status){
        setButtonDisabled(false)
        setHackatimeInstalled(true)
        await fetch(`/api/user/${session.data?.slack_id}/waka`, {method: "POST"})
      } else {
        setButtonDisabled(true)
      }
    }
  }

  function onButtonClick() {
    setButtonDisabled(true);
    setTimeout(() => setButtonDisabled(false), 3000);
  }

  if (session.status === "loading") {
    return <Loading />;
  } else if (session.status === "unauthenticated") {
    return <Unauthenticated />;
  }
  const findUserOS = () => {
    const r = window.navigator.userAgent.toLowerCase();
    if (r.includes("win")) {
      return {
        readable_name: "Windows",
        script: "Powershell",
      };
    }
    if (r.includes("mac")) {
      return {
        readable_name: "MacOS",
        script: "Terminal",
      };
    }
    if (r.includes("linux")) {
      return {
        readable_name: "Linux",
        script: "Terminal",
      };
    }
    return {
      readable_name: "Other",
      script: "Other",
    };
  };
  const userOS = findUserOS();

  // Define the ordered stages, skipping stage 3 for beginners
  const stages = [1, 2, ...(track === "beginner" ? [] : [3]), 4, 5];
  const currentStageIndex = stages.indexOf(stage);

  function goToPrevStage() {
    if (currentStageIndex > 0) {
      setStage(stages[currentStageIndex - 1]);
    }
  }

  function goToNextStage() {
    if (currentStageIndex < stages.length - 1) {
      setStage(stages[currentStageIndex + 1]);
    } else {
      router.push("/gallery");
    }
  }

  return (
    <main className="w-screen h-full relative flex flex-col justify-center items-center">
      <div className="w-screen h-screen fixed top-0 left-0 z-[1] overflow-hidden bg-[url(/ponte-salario.jpg)] bg-cover blur-sm brightness-50 after:absolute after:inset-0 after:bg-hc-primary/80 after:mix-blend-soft-light" />
      <div className="relative z-10">
        <div className="flex flex-col w-screen h-full md:h-screen p-16 sm:p-24 gap-6 text-hc-secondary">
          <div className="bottom-10 flex w-full flex-row justify-between gap-10 items-center">
            <button
              onClick={() => {
                goToPrevStage();
                onButtonClick();
                console.log(stage)
              }}
              className={`${currentStageIndex === 0 ? "text-hc-secondary/40 cursor-not-allowed" : "text-hc-secondary"}  no-underline text-right ml-auto`}
            >
              <h1 className="text-md md:text-lg inline">{'<'}- prev</h1>
            </button>
            <span className="relative grow mx-auto rounded-lg h-5 *:h-5 bg-white/40">
              <span
                style={{ width: ((currentStageIndex + 1) * 100) / stages.length + "%" }}
                className={`border-2 border-hc-primary-dull absolute bg-hc-primary-dull rounded-l-lg ${((currentStageIndex + 1) * 100) / stages.length === 100 ? "rounded-r-lg" : null}`}
              />
            </span>
            <button
              disabled={buttonDisabled || (stage === 3 && !hackatimeInstalled)}
              onClick={() => {
                goToNextStage();
                onButtonClick();
              }}
              className={`${buttonDisabled || (stage === 3 && !hackatimeInstalled) ? "text-hc-secondary/40 cursor-not-allowed" : "text-hc-secondary"} text-hc-secondary no-underline text-right ml-auto`}
            >
              <h1 className="text-md md:text-lg">next -{'>'}</h1>
            </button>
          </div>
          {stage === 1 && (
            <>
              <h1 className="text-3xl sm:text-5xl text-center">
                Welcome to the <i>Athena Award</i>
              </h1>
              <div className="text-left pt-8 mx-auto flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-4 w-full">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ease: "easeOut", delay: index * 0.75 }}
                    className="bg-hc-primary-dull/40 rounded basis-1/3 p-4 h-max lg:h-48 overflow-auto-scroll"
                  >
                    <h1 className="text-2xl sm:text-4xl text-left whitespace-nowrap">
                      {step.step}
                    </h1>
                    <p className="text-left text-lg py-1 sm:text-xl">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {stage === 2 && (
            <>
              <h1 className="text-3xl sm:text-5xl text-center">
                Select a track
              </h1>
              <div className="text-center mx-auto gap-4 w-full flex flex-col">
                <div className="text-2xl">
                  Do you want to build guided or custom projects?
                </div>
                <p>
                  Select the one that describes you best - this choice will only
                  affect resources provided to you.
                </p>
                <div
                  className={`grid md:grid-cols-2 *:col-span-1 gap-6 justify-center *:bg-hc-primary-dull/40 *:p-4 *:h-max *:lg:h-48`}
                >
                  <motion.button
                    onClick={async () => {
                      setTrack("beginner");
                      await fetch(`/api/user/${session.data?.slack_id}/track`, {
                        method: "POST",
                        body: JSON.stringify({ track: "beginner" }),
                      });
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ease: "easeOut", delay: 0.75 }}
                    className={`hover:!scale-105 rounded transition ${
                      track === "beginner"
                        ? "border-2 border-hc-primary"
                        : null
                    }`}
                  >
                    <h1 className="text-2xl sm:text-4xl text-left">Guided</h1>
                    <ul className="text-left text-lg py-1 sm:text-xl list-inside list-disc">
                      <li>
                        I'm not sure what to make and would like some more
                        resources.
                      </li>
                      <li>
                        I completed a project from GirlsWhoCode, Black Girls
                        Code or another summer program and want to submit it
                        here!
                      </li>
                    </ul>
                  </motion.button>
                  <motion.button
                    onClick={async () => {
                      setTrack("advanced");
                      await fetch(`/api/user/${session.data?.slack_id}/track`, {
                        method: "POST",
                        body: JSON.stringify({ track: "advanced" }),
                      });
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ease: "easeOut", delay: 0.75 }}
                    className={`hover:!scale-105 rounded transition ${
                      track === "advanced"
                        ? "border-2 border-hc-primary"
                        : null
                    }`}
                  >
                    <h1 className="text-2xl sm:text-4xl text-left">Custom</h1>
                    <ul className="text-left text-lg py-1 sm:text-xl list-disc list-inside">
                      <li>I have a lot of ideas about things I want to make.</li>
                      <li>
                        I'm a confident programmer and have created some
                        projects before
                      </li>
                    </ul>
                  </motion.button>
                </div>
              </div>
            </>
          )}

          {stage === 3 && (
            <>
              <h1 className="text-3xl sm:text-5xl text-center">
                Project Tracking Setup
              </h1>
              <div className="text-left pt-8 mx-auto items-center justify-center gap-4 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ease: "easeOut", delay: 0.75 }}
                  className="md:grid md:grid-cols-3 gap-4"
                >
                  <div className="*:mx-auto w-full text-center">
                    <img src="https://cloud-g5g5sistf-hack-club-bot.vercel.app/1untitled_artwork_8_1.png" />
                    <p className="text-center italic">
                      hi ^-^ i'm orpheus, and i'm here to guide you through
                      getting started with the athena award!
                    </p> {' '}
                      <span>
                      confused? ask for help in{" "}
                      <a
                        target="_blank"
                        className="bg-hc-primary-dull px-1 text-white"
                        href="https://app.slack.com/client/T0266FRGM/C06T17NQB0B"
                      >
                        #athena-award
                      </a>
                      .
                    </span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ease: "easeOut", delay: 2 }}
                    className="col-span-2 flex flex-col gap-4"
                  >
                    <p className="text-left text-lg py-1 sm:text-xl">
                      you're a little more advanced, so let's help you get
                      started with Hackatime! it's a nifty tool we hack clubbers
                      use to track time spent coding!
                    </p>
                    <div className = "grid grid-cols-1 lg:grid-cols-2 grow">
                    <ul className="text-lg list-outside list-decimal *:py-1">
                      <li>
                        Sign in{" "}
                        <a
                          target="_blank"
                          href="https://hackatime.hackclub.com/auth/slack?close_window=true"
                        >
                          here
                        </a>{" "}
                        to create your hackatime account
                      </li>
                      <li>
                        Install a code editor or IDE. i recommend{" "}
                        <a
                          href="https://code.visualstudio.com/"
                          target="_blank"
                        >
                          VS Code
                        </a>
                        . however, any code editor on{" "}
                        <a href="https://wakatime.com/plugins" target="_blank">
                          this list
                        </a>{" "}
                        will work.
                      </li>
                      <li>
                        Follow these handy{" "}
                        <a
                          target="_blank"
                          href="https://hackatime.hackclub.com/my/wakatime_setup"
                        >
                          setup instructions
                        </a>
                        , then come back here!
                      </li>
                      <span className = "text-gold">Confused? Check out the presentation!</span>
                    </ul>  
                      <object data = "https://hc-cdn.hel1.your-objectstorage.com/s/v3/82354da750615a142140fcf632862705c7323508_athena_hackatime_setup.pdf" type="application/pdf" className = "h-full w-full">
                        <p><a href = "https://hc-cdn.hel1.your-objectstorage.com/s/v3/82354da750615a142140fcf632862705c7323508_athena_hackatime_setup.pdf"/></p>
                      </object>
                  </div>
                
                  <div className = "grid grid-cols-1 gap-8">
                    <button className = "bg-hc-primary-dull/50 w-full mx-auto p-2" onClick={checkIfHackatime}>click me once you've set hackatime up!</button>
                    <p>Give me a moment, I'm checking to see if you've made your Hackatime account... <span className = "bg-hc-primary-dull px-1">{hackatimeInstalled ? "Nice, it looks like you have a Hackatime account - you can go to the next step!" : "I can't find a Hackatime account for you..." }</span></p>
                  </div>
                  </motion.div>
                </motion.div>
              </div>
            </>
          )}

          {stage == 4 && (
            <>
              <h1 className="text-3xl sm:text-5xl text-center">
                Project Requirements
              </h1>
              <div className = "grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="col-span-2 pt-8 flex flex-col justify-center gap-4">
                  <p>
                    Before you submit your projects, we need some kind of proof
                    that you've been working on it for as long as you have.
                  </p>

                  <p>
                    GitHub is a website that lets you store your code. Sign up to
                    GitHub{" "}
                    <a target="_blank" href="https://github.com/signup">
                      here
                    </a>
                    , and return back to this site.
                  </p>
                  <ul className="list-inside list-disc py-5 flex flex-col gap-3">
                    <li>
                      A commit is effectively a snapshot of the changes you've
                      made in your code since the last time you committed.
                    </li>
                    <li>
                      Commits are helpful particularly if you want to track when
                      you added a certain feature or introduced a certain bug
                      (oops)!
                    </li>
                    <li>
                      In general: commit often. For the Athena Award,{' '}                 
                      <span className="bg-hc-primary-dull px-1">
                      we require that you commit your changes around once per hour.
                      </span>
                    </li>
                    <li>
                      For example, you can see the current commit that this
                      website is on by checking out the{" "}
                      <a
                        target="_blank"
                        href="https://github.com/hackclub/athena-award"
                      >
                        GitHub repository
                      </a>
                      .
                    </li>
                  </ul>
                </div>

                <img className = "col-span-1 my-auto" src = "https://hc-cdn.hel1.your-objectstorage.com/s/v3/9f8f3847231e46f5b2626e7e8afb179bff6ad261_image.png"/>
              </div>
            </>
          )}

          {stage === 5 && (
            <>
              <h1 className="text-3xl sm:text-5xl text-center">Support</h1>
              <div className="text-left pt-8 mx-auto items-center justify-center gap-4 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ease: "easeOut", delay: 0.75 }}
                  className="md:grid md:grid-cols-3 gap-4"
                >
                  <div className="col-span-2 *:text-xl flex flex-col gap-10 justify-center">
                    <p>
                      lost? confused? don't know what to do? here are some
                      things that could help!
                    </p>
                    <ul className="list-inside list-decimal *:md:indent-10">
                      <li>
                        introduce yourself in{" "}
                        <a
                          className="bg-hc-primary-dull px-1 text-white"
                          href="https://app.slack.com/client/T0266FRGM/C75M7C0SY"
                        >
                          #welcome
                        </a>
                      </li>
                      <li>
                        chat with others in the{" "}
                        <a
                          target="_blank"
                          className="bg-hc-primary-dull px-1 text-white"
                          href="https://app.slack.com/client/T0266FRGM/C06T17NQB0B"
                        >
                          #athena-award
                        </a>{" "}
                        channel on the Hack Club Slack
                      </li>
                      <li>
                        send an email to{" "}
                        <span className="bg-hc-primary-dull px-1">
                          athena@hackclub.com
                        </span>
                      </li>
                    </ul>
                    <span>
                      psst. you can always revisit this page from{" "}
                      <a
                        href={`${process.env.NEXT_PUBLIC_BASE_URL}/onboarding`}
                        className="bg-hc-primary-dull px-1 text-white"
                      >
                        /onboarding
                      </a>{" "}
                      or your profile.
                    </span>
                  </div>

                  <div className="*:mx-auto w-full text-center">
                    <img src="https://hackclub.com/arcade/o7.png" />
                    <span className="text-center italic">
                      go forth and be hacky!
                    </span>
                  </div>
                </motion.div>
              </div>
            </>
          )}

          <span className="self-end mt-auto uppercase text-md mx-auto text-white/40">
            onboarding - {Math.floor(((currentStageIndex + 1) * 100) / stages.length)}% complete
          </span>
        </div>
      </div>
    </main>
  );
}
