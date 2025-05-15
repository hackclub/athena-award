"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { useRouter } from "next/navigation";
import WelcomeModal from "../welcome/WelcomeModal";
import { inviteSlackUser } from "@/services/inviteUserToSlack";
import { FormEvent } from "react";
import { useSearchParams } from "next/navigation";

export const shineEffect = (props: string) =>
  `${props} border text-center mx-auto focus:outline-none focus:ring focus:ring-slate-500/50 focus-visible:outline-none focus-visible:ring focus-visible:ring-slate-500/50 relative before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white/.5)_50%,transparent_75%,transparent_100%)] dark:before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:[transition:background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] hover:before:duration-[1500ms]`;
export const shineEffectProps =
  "p-5 text-2xl text-hc-secondary rounded-xl bg-hc-primary-dull/80 border-hc-primary-dull/80";

export function AuthStateButton({ className }: { className?: string }) {
  /// @ PAST SELF WHY IS THIS EVEN IN HERE
  const session = useSession();
  const router = useRouter();
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [err, setErr] = useState("");

  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const referredBy = searchParams.get("referred_by")!;
    const utm_source = searchParams.get("utm_source")!;

    setEmailSubmitted(true);
    const r = await inviteSlackUser(email, referredBy, utm_source);
    if (r.ok) {
      console.log("ok");
    } else {
      setErr(r.error);
    }
  }
  return (
    <>
      <div className="flex mx-auto items-center">
        {session.status === "authenticated" ? (
          <button
            onClick={() => {
              router.push("/gallery");
            }}
            className={shineEffect(shineEffectProps)}
          >
            <h1>enter the gallery</h1>
          </button>
        ) : (
          <div
            className={`flex flex-col p-5 bg-hc-primary-dull/80 rounded-xl ${className}`}
          >
            {!emailSubmitted ? (
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
                <p>{err}</p>
                <p className="text-sm">
                  Please send an email to athena@hackclub.com with this error
                  message if you're seeing this.
                </p>
              </span>
            ) : (
              <span className="not-italic text-lg md:text-xl text-center text-white max-w-1/2">
                <p className="underline decoration-wavy text-xl">
                  Check your email!
                </p>
                <p>
                  Keep an eye on your inbox for an invite to our community of
                  high school hackers.
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
      <div className="flex flex-row justify-between px-6 w-full">
        <div className = "flex flex-row gap-3">
        <a className="inline" href="https://hackclub.com">
          <img
            className="w-32"
            src="https://assets.hackclub.com/flag-orpheus-top.svg"
          />
        </a>
        </div>

        <div className = "self-center flex flex-row uppercase font-semibold *:text-2xl justify-between gap-10 *:text-[#E89368]">
          <a href = "/about" className = "no-underline hover:underline hover:decoration-wavy hover:text-hc-secondary">ABOUT</a>
          <a href = "/map" className = "no-underline hover:underline hover:decoration-wavy hover:text-hc-secondary">PROJECT MAP</a>
        </div>

      { skipWelcomeModal ? null : (
          <div className="pointer-events-auto max-sm:mx-auto *:sm:ml-auto">
            <WelcomeModal props={`${shineEffect(shineEffectProps)}`} />
          </div>
        )}
      </div>
    </div>
  );
}
