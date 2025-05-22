import { useState, useContext, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { UXEventContext } from "@/components/context/UXStages";
import { Tooltip } from "react-tooltip";
import { Warning } from "@/components/panels/add-ons/Callout";
import { Progress } from "./Progress";
import Waka from "./Waka";
import { FaXmark } from "react-icons/fa6";
import { signOut } from "next-auth/react";
import Modal from "@/components/panels/layout/PopUpModal";
import useSWR from "swr";
import { multiFetcher } from "@/services/fetcher";

export default function Profile() {
  const [uxEvent, setUXEvent] = useContext(UXEventContext);

  const [error, setError] = useState("");

  const session = useSession();

  const submitCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fo = JSON.parse(JSON.stringify(Object.fromEntries(formData)));
    if (fo.code) {
      const response = await fetch(
        `/api/hackathons/${fo.code}/user/${session.data!.slack_id}`,
        {
          method: "POST",
        },
      );
      return response.json();
    }
    return {
      error:
        "Hey! Why are you trying to join a hackathon that doesn't exist? 🤔",
    };
  };

  const urls = [`/api/user/${session.data?.slack_id}/hackathons`];
  const { data } = useSWR(urls, multiFetcher);
  let hackathonName;
  if (data) {
    hackathonName = data[0]["message"];
  }

  return (
    <>
      <Modal
        customClear={() => setError("")}
        uxEvent={uxEvent}
        uxEventName="profile"
        setUXEvent={setUXEvent}
        className="md:grid md:grid-cols-3 max-md:flex max-md:flex-col-reverse"
      >
        <div className="md:col-span-1 md:h-full md:sticky flex flex-col basis-2/5 gap-4">
          <div className="hidden rounded-md bg-white/10 sm:flex items-center gap-4 h-fit p-4 mb-4">
            <img
              className="rounded-full size-16 mx-auto md:m-0"
              src={session.data?.user!.image!}
            />
            <div className="*:truncate truncate">
              <div className="text-xl">Hi {session.data?.user!.name}!</div>
              <div className="text-sm">{session.data?.user!.email}</div>
            </div>
          </div>
          <div>
          <div className="text-white font-bold text-2xl uppercase">
            Hackathons
          </div>
          <div>
            Part of a{" "}
            <Tooltip id="hackathon" place="top-start" className="z-10" />
            <span
              data-tooltip-id="hackathon"
              data-tooltip-content="Ask your Days of Service hackathon leads for the unique Athena Award code!"
              className="font-bold"
            >
              hackathon?{" "}
            </span>
            Submit the unique code here:{" "}
          </div>
          <form
            className="flex flex-row my-4 w-full"
            onSubmit={async (event) => {
              let hackathon = await submitCode(event);
              setError(hackathon.error);
            }}
          >
            <input
              type="text"
              name="code"
              className="!outline-none !border-none !ring-0 rounded-l w-full text-black"
            />
            <button
              type="submit"
              className="rounded-r text-white p-2 bg-hc-primary"
            >
              <img
                src="https://icons.hackclub.com/api/icons/white/send"
                className="size-[32px]"
                alt="Submit"
              />
            </button>
          </form>
          <div className="text-sm">
            {error ? (
              <Warning title="Error">{error}</Warning>
            ) : hackathonName ? (
              <span>
                Congratulations! You're registered as an attendee of{" "}
                <b>{hackathonName}</b>
              </span>
            ) : null}
          </div>
          </div>

        <div>
          <div className="text-white font-bold text-2xl uppercase">
            Onboarding
          </div>
            Want a bit of a refresher? Complete <a href = "/onboarding">onboarding</a> again.
        </div>

        <div>
          <div className="text-white font-bold text-2xl uppercase">
            Referral Code
          </div>
            <span>Earn prizes for people who sign up using your referral link!</span>
            <a href = {`https://award.athena.hackclub.com?referred_by=${session.data?.slack_id}`} className = "text-center block">https://award.athena.hackclub.com?referred_by={session.data?.slack_id}</a>
      </div>
          <button
            className="text-white font-bold text-2xl uppercase mt-auto self-start"
            onClick={() => signOut({ redirectTo: "/" })}
          >
            Sign Out
          </button>
        </div>

        {/*<div className="w-[1px] h-full bg-hc-primary" />*/}

        <div className="md:col-span-2 flex flex-col gap-3 md:overflow-scroll">
          <div className="self-start *:align-middle flex gap-3 w-full align-middle sticky">
            <div className="*:align-middle w-full h-fit bg-black/25 p-2 rounded flex gap-4">
              <img
                src="https://icons.hackclub.com/api/icons/hackclub-red/person"
                className="size-[32px] self-center align-middle"
                alt="Profile"
              />
              <div className="self-center align-middle text-xl sm:text-3xl playfair-display font-bold italic">
                Profile
              </div>
            </div>
            <button className="shrink-0" onClick={() => setUXEvent("map")}>
              <FaXmark className="size-8 md:size-14 text-white" />
            </button>
          </div>

          <div className="grow overflow-y-auto">
            <div className="flex flex-col gap-4 my-3">
              <Progress />
              <Waka />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
