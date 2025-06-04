import { auth } from "@/auth";
import { Header } from "@/components/panels/Header";
import { generatePoster } from "@/services/generatePoster";

export default async function Referral() {
  const session = await auth();
  const posterUint8 = await generatePoster(
    session ? "?referred_by=" + session?.slack_id! : "",
  );
  const posterStuff = Buffer.from(posterUint8.buffer).toString("base64");
  return (
    <>
      <Header skipWelcomeModal />
      <div className="w-screen flex flex-col gap-4 overflow-y-scroll h-screen bg-hc-primary-dull bg-[url(/bg.svg)] px-16 pb-16 pt-28 relative">
        <div className="self-start">
          <a
            className="text-xl sm:text-2xl uppercase text-white font-bold mb-2"
            href="/"
          >
            Athena Award
          </a>
          <h1 className="text-4xl sm:text-6xl uppercase italic text-white font-bold playfair-display">
            Poster
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-full *:text-white">
          <div className="flex flex-col gap-4">
            <p>
              Print it out and stick it up around your city in libraries and
              schools!
            </p>

            {session ? (
              <p>
                You're currently logged in, so this poster will use your
                referral code. You can earn cool prizes specifically from having
                people join if they use your code.
                <br />
                <br />
                No printer? No worries. Send this link to your friends!
                <br />
                <a
                  href={`https://award.athena.hackclub.com?referred_by=${session?.slack_id}`}
                >
                  https://award.athena.hackclub.com?referred_by=
                  {session?.slack_id}
                </a>
              </p>
            ) : (
              <p>
                You're not logged in right now! Log in so that the poster will
                use your referral code.{" "}
              </p>
            )}
            <p>Happy hacking!</p>
          </div>
          <iframe
            className="col-span-1 h-full w-full"
            id="frame"
            src={"data:application/pdf;base64," + posterStuff}
          />
        </div>
      </div>
    </>
  );
}
