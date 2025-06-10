"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { useRouter } from "next/navigation";
import WelcomeModal from "../welcome/WelcomeModal";
import { inviteSlackUser } from "@/services/inviteUserToSlack";
import { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import PartnerDropdown from "@/components/ui/PartnerDropdown";

export const shineEffect = (props: string) =>
  `${props} border text-center mx-auto focus:outline-none focus:ring focus:ring-slate-500/50 focus-visible:outline-none focus-visible:ring focus-visible:ring-slate-500/50 relative before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white/.5)_50%,transparent_75%,transparent_100%)] dark:before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:[transition:background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] hover:before:duration-[1500ms]`;
export const shineEffectProps =
  "p-5 text-2xl text-hc-primary-dull rounded-xl bg-cream border-hc-primary-dull/80";

export function AuthStateButton({ className }: { className?: string }) {
  /// @ PAST SELF WHY IS THIS EVEN IN HERE
  const session = useSession();
  const router = useRouter();
  const [registrationStep, setRegistrationStep] = useState(1);
  const [ema, setEma] = useState("");
  const [partners, setPartners] = useState([""]);
  const [err, setErr] = useState("");

  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    setEma(email);
    const referredBy = searchParams.get("referred_by")!;
    const utm_source = searchParams.get("utm_source")!;
    const ref = searchParams.get("ref")!;

    setPartners(await fetch("/api/partners").then((r) => r.json()));

    setRegistrationStep(2);
    const r = await inviteSlackUser(email, referredBy, utm_source, ref);
    if (r.ok) {
      console.log("ok");
    } else {
      setErr(r.error);
    }
  }
  return (
    <>
      <div className="flex mx-auto w-full items-center">
        {session.status === "authenticated" ? (
          <button
            onClick={() => {
              router.push("/onboarding");
            }}
            className="bg-cream text-2xl p-5 rounded-lg text-hc-primary-dull"
          >
            <h1>enter the gallery</h1>
          </button>
        ) : (
          <div
            className={`max-md:w-full flex flex-col p-5 bg-hc-primary-dull/80 rounded-xl ${className}`}
          >
            {registrationStep === 1 ? (
              <form
                className="flex flex-col gap-3 *:text-white items-center"
                onSubmit={(e) => handleEmailSubmit(e)}
              >
                <label className="not-italic text-xl text-center ">
                  New to Hack Club? ✨
                </label>
                <span className="flex flex-col md:flex-row gap-2 w-full">
                  <input
                    type="email"
                    placeholder="orpheus@mail.com"
                    defaultValue={email ? email : ""}
                    className="text-black w-full"
                    required
                    name="email"
                    id="email"
                  />
                  <button type="submit">Submit</button>
                </span>
              </form>
            ) : err ? (
              <span className="not-italic text-lg md:text-xl text-center text-white max-w-1/2">
                <p className="underline decoration-wavy text-xl">
                  Something went wrong!
                </p>
                <p>
                  {err.includes("already_in_team") ? (
                    <span>
                      You're already in the Hack Club Slack - sign in{" "}
                      <a target="_blank" href="https://hackclub.slack.com">
                        here
                      </a>
                    </span>
                  ) : (
                    <span>
                      <p>{err}</p>
                      <p className="text-sm">
                        Please send an email to athena@hackclub.com with this
                        error message if you're seeing this.
                      </p>
                    </span>
                  )}
                </p>
              </span>
            ) : registrationStep === 2 ? (
              <span className="not-italic text-lg md:text-xl text-center text-white max-w-1/2">
                <PartnerDropdown
                  email={ema}
                  partners={partners}
                  setRegistrationStep={setRegistrationStep}
                />
              </span>
            ) : (
              <span className="not-italic text-lg md:text-xl text-center text-white max-w-1/2">
                <p className="underline decoration-wavy text-xl text-gold">
                  Check your email!
                </p>
                <p className="font-semibold">
                  Then, come back here and sign in!
                </p>
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );
}
export function Header({
  children,
  skipWelcomeModal = false,
}: {
  children?: React.ReactNode;
  skipWelcomeModal?: boolean;
}) {
  const session = useSession();
  return (
    <div className="fixed pointer-events-auto w-full z-50 bg-hc-primary-dull/90 border-b-2 border-gold/20">
      <div className="flex flex-row justify-around md:justify-between px-3 md:px-6 w-full">
        <div className="flex flex-row gap-6 items-center">
          <a className="inline self-center m-2" href="/">
            <img
              className="w-96"
              src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/6338dbbd7a0200f2b9f2f5b7b59834511c45cc58_athena_award_1000x1000-cropped.svg"
            />
          </a>
        </div>

        <div className="flex flex-row uppercase font-semibold items-center text-xl *:md:text-2xl justify-between gap-5 *:text-cream">
          <a
            href="/about"
            className="no-underline hover:underline hover:decoration-wavy hover:text-hc-secondary"
          >
            ABOUT
          </a>
          <a
            href="/map"
            className="no-underline hover:underline hover:decoration-wavy hover:text-hc-secondary"
          >
            MAP
          </a>
          <span className="hidden md:inline border border-cream/10 h-full" />
          <a className="hidden md:inline" href="https://hackclub.com">
            <img
              className="w-16 md:w-24"
              src="https://assets.hackclub.com/flag-standalone-wtransparent.svg"
            />
          </a>
        </div>

        {skipWelcomeModal ? null : (
          <div className="pointer-events-auto max-sm:mx-auto *:sm:ml-auto">
            <WelcomeModal props={`${shineEffect(shineEffectProps)}`} />
          </div>
        )}
      </div>
    </div>
  );
}
