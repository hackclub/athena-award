import { Header } from "@/components/panels/Header";
import { AuthStateButton } from "@/components/panels/Header";
export default function About() {
  return (
    <>
      <Header skipWelcomeModal={true} />
      <img
        className="object-cover w-screen h-[50vh]"
        src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/390b6fa1417d3af121ebf065b59e7ad25052c811_image.png"
      />
      <div className="flex flex-col w-screen p-16 min-h-screen bg-hc-primary-dull bg-[url(/bg.svg)]">
        <div className="self-start">
          <a
            className="text-xl sm:text-2xl uppercase text-white font-bold mb-2"
            href="/"
          >
            Athena Award
          </a>
          <h1 className="text-4xl sm:text-6xl uppercase italic text-white font-bold playfair-display">
            About
          </h1>
          <div className="py-4 *:text-white *:text-xl flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              <img
                className="hidden md:inline w-48"
                src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/7b4d1a4b891fce753d13942487d0258bdd9ae77c_image.png"
              />
              <div className="*:text-white flex flex-col gap-4">
                <h2 className="!text-3xl">
                  Welcome, acolytes, to the Athena Award.
                </h2>

                <div className="*:text-lg *:md:text-xl">
                  <p>
                    The Athena Award is a program run by Hack Club for girls and
                    gender minorities looking to get into programming, coding,
                    and building technical projects of any kind.
                  </p>
                  <p>In collaboration with:</p>
                  <ul className="list-inside list-disc">
                    <li>MIT Beaverworks</li>
                    <li>GitHub</li>
                    <li>GirlsWhoCode</li>
                    <li>Girl Scouts of Greater New York</li>
                    <li>
                      and <a href="/#collaborators">numerous others</a>
                    </li>
                  </ul>
                </div>

                <h2 className="!text-3xl">What's in it for me?</h2>
                <div className="*:text-lg *:md:text-xl">
                  <p>
                    Build three projects (or more!) in 30 hours, and you'll be
                    invited to a{" "}
                    <span className="font-bold !text-gold">
                      three-day hackathon
                    </span>{" "}
                    running November 14th - November 16th in the{" "}
                    <span className="!text-gold">heart of New York City</span>.{" "}
                    Travel stipends available!
                  </p>

                  <p>
                    Can't make it to New York City? No stress - for every hour
                    you code during the Athena Award, you'll be rewarded with
                    one <span className="!text-gold">artifact</span>.
                  </p>
                  <p>
                    Artifacts can be redeemed in our shop for{" "}
                    <span className="!text-gold font-bold">
                      laptops, hoodies, headphones
                    </span>{" "}
                    and more, to help you keep on hacking!
                  </p>

                  <p>
                    Additionally, all successful recipients of the Athena Award
                    will be sent a certificate - available in digital and
                    physical form - to certify their technical skills.{" "}
                  </p>
                </div>
              </div>
            </div>

            <h2 className="!text-3xl">How can I get started?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="*:text-lg *:md:text-xl">
                <p>
                  Sign up through the button on the right to access the Athena
                  Award website, where you'll be able to:
                </p>
                <ul className="list-inside list-disc">
                  <li>Access programming resources</li>
                  <li>Keep track of the artifacts you've earned</li>
                  <li>Order prizes from the shop</li>
                  <li>Track your progress on completing the Athena Award</li>
                </ul>
                <p>
                  Additionally, you'll be sent an invite to join the Hack Club
                  Slack - a community of high school programmers from all around
                  the world. If you need help on your project and getting
                  started, the Slack is the place to be!
                </p>
              </div>
              <AuthStateButton className="border border-gold" />
            </div>
            <h2 className="!text-3xl">
              Okay, I'm sold. How can I start working on my projects?
            </h2>
            <p>
              First, figure out what you want to make. If you're not sure, or if
              you're carrying over a project from a summer program like
              GirlsWhoCode's self-paced program, start with the{" "}
              <span className="text-gold">Guided Track</span> - for projects
              that you are/were guided through completing.
            </p>
            <p>
              The first one,{" "}
              <a target="_blank" href="https://tribute.athena.hackclub.com">
                Tribute
              </a>
              , will teach you how to make a basic website themed after
              something you like. By the end of the Guided Track, you'll be
              prepared to continue making some awesome, functional webpages!
            </p>
            <p>
              Alternatively, if you already know a little bit of programming -
              feel free to jump in with the{" "}
              <span className="text-gold">Custom Track</span> where you build
              your own custom projects.
            </p>
            <div className="*:border-[#E89368] *:rounded-lg *:border-2 grid grid-cols-1 *:h-full md:grid-cols-2 gap-4 justify-center *:bg-[#E89368]/30 *:p-4 items-center">
              <div>
                <h1>Guided Track</h1>
                <p>
                  Complete the three workshops on web development, designed by
                  the team behind the Athena Award - or submit a project
                  completed from another summer program.{" "}
                </p>
              </div>
              <div>
                <h1>Custom Track</h1>
                <p>
                  Code three of your own projects - for people who know how to
                  code already and want to challenge themselves! Things for work
                  and school don't count for the Athena Award!
                </p>
              </div>
            </div>

            <h2 className="!text-3xl">How do I submit my projects?</h2>
            <p>
              Projects are submitted through the Athena Award portal, which you
              can access by logging in.
            </p>
            <p>Your project needs to meet some criteria before you submit.</p>
            <ul className="list-disc list-inside">
              <li>
                Your project needs to be technical in some way, shape or form.
              </li>
              <li>
                Code needs to be open source. Use a website like{" "}
                <a target="_blank" href="https://github.com">
                  GitHub
                </a>{" "}
                to publish your code. If you're unsure of how to do this, check
                out the guide on{" "}
                <a target="_blank" href="https://tribute.athena.hackclub.com">
                  Tribute
                </a>
                .
              </li>
              <li>
                Your project needs to, well, exist. It doesn't count if you're
                the only one who can access it! For instance, websites need to
                have a public URL, and apps need to be downloadable. This is
                called <span className="!text-gold">deploying</span> your
                project.
              </li>
              <li>
                It needs to be{" "}
                <span className="text-gold">something original</span>, that's
                not for work or school.
              </li>
              <li>
                Make it <span className="text-gold">portfolio-ready</span>! Is
                this project something that you'd be proud to show off to an
                employer or teacher?
              </li>
            </ul>
            <p>
              Once that's done, a member of the team will review and approve
              your project. Your project might be rejected if it doesn't meet
              the criteria, in which case, you're free to resubmit once you fix
              any issues.
            </p>

            <h2 className="!text-3xl">
              How do I track the 30 hours of time spent on my projects?
            </h2>
            <p>
              For Guided Track projects, each workshop has its own set amount of
              hours, and we'll also ask you to self-report hours.
            </p>
            <p>
              For Custom Track projects, we'll ask you to install Wakatime - an
              extension for your code editor that will let us track how long you
              spend making your projects.
            </p>

            <h2 className="!text-3xl">
              What if I've finished 3 projects but haven't spent 30 hours
              coding?
            </h2>
            <p>
              Make and submit another project! You can submit more than 3
              projects, for extra artifacts.
            </p>

            <h2 className="!text-3xl">How do I get prizes/earn artifacts?</h2>
            <p>
              Artifacts are the currency of the Athena Award! For every project
              you submit that gets approved, you'll earn the equivalent number
              of hours you spent coding on it in{" "}
              <span className="text-gold inline">
                artifacts{" "}
                <img
                  className="h-8 inline"
                  src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/44e7d5c7ff189dc439c2bea7483ade38630a1ca5_image.png"
                />
              </span>
              .
            </p>
            <p>
              Once you're logged in on the Athena Award website, you can spend
              these{" "}
              <span className="text-gold inline">
                artifacts{" "}
                <img
                  className="h-8 inline"
                  src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/44e7d5c7ff189dc439c2bea7483ade38630a1ca5_image.png"
                />
              </span>{" "}
              on prizes in the Shop. Click on the icon in the top right corner
              to access the shop.
            </p>
            <h2 className="!text-3xl">I still have more questions!</h2>
            <ul className="list-inside list-disc">
              <li>
                If you're already in the Slack, ask in the{" "}
                <a
                  target="_blank"
                  href="https://app.slack.com/client/T0266FRGM/C06T17NQB0B"
                >
                  #athena-award
                </a>{" "}
                channel.
              </li>
              <li>
                Alternatively, send an email to{" "}
                <a target="_blank" href="mailto:athena@hackclub.com">
                  athena@hackclub.com
                </a>{" "}
                and one of the team will reply to you.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
