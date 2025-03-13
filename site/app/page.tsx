import Background from "@/components/landscape/Background"
import WelcomeModal from "@/components/welcome/WelcomeModal"
import { signIn } from "next-auth/react"
import { Header, AuthStateButton } from "@/components/panels/Header"
import { useSession } from "next-auth/react";
import Marquee from "react-fast-marquee";
import Painting from "@/components/panels/Painting";

const steps = [
  {title: "Build three projects 💻",
    description: "Spend 30 hours hacking on cool technical projects! Examples: building a blogging website, coding an app, or creating a video game."
  },
  {title: "Ship your projects ⛵",
    description: "Share your projects with our community of teen makers. Sign in with the Hack Club Slack and ship them! Earn artifacts for each project shipped to the gallery."
  },
  {title: "Earn a fully-paid flight to New York City 🎁",
    description: "Unlock awesome prizes as you earn artifacts, including a chance to participate in a fully-funded hackathon in New York!"
  }
]

const stats = [
  {
    number: 40000000,
    description: "participants"
  },
  {
    number: 20390239,
    description: "dollars in prizes distributed"
   },
  {
    number: 23092039,
    description: "projects shipped"
  },
  {
    number: 43594385,
    description: "useless statistics"
  },
  {
    number: 8395849,
    description: "more useless stats"
  }, 

  {
    number: 38492, 
    description: "even more useless stats"
  }
]

const FAQ = [
  {
    question: "Is this actually real?",
    answer: "yea"
  },
  {
    question: "Who can participate?",
    answer: "If you are a high school student and a gender minority, you're eligible to complete the Athena Award."
  },
  {
    question: "Why do I have to verify my ID?",
    answer: "We have to make sure you're not an adult trying to get stuff for free! In the past, Hack Club has given away hundreds of thousands of dollars of prizes to technical teenagers across the world."
  },
  {
    question: "How do prizes work?",
    answer: "As you earn artifacts by completing the requirements of the Athena Award, you'll become automatically eligible for prizes along the way."
  },
  {
    question: "How does the trip to New York work?",
    answer: "Those who complete the Athena Award will become eligible for a travel stipend (subject to availability) to cover their flights to the hackathon in New York."
  },
  {
    question: "How can I get help on my projects?",
    answer: "Join the Hack Club Slack!"
  }
]

const prizes = [
  {
    image: "https://cloud-c1gqq7ttf-hack-club-bot.vercel.app/0sticker_pile_2.png",
   description: "Stickers"
  },
  {
    image: "https://cloud-c1gqq7ttf-hack-club-bot.vercel.app/0sticker_pile_2.png",
   description: "2 Stickers 2 Furious"
  },
  {
    image: "https://cloud-c1gqq7ttf-hack-club-bot.vercel.app/0sticker_pile_2.png",
   description: "The 3 Sticker Problem"
  },
  {
    image: "https://cloud-c1gqq7ttf-hack-club-bot.vercel.app/0sticker_pile_2.png",
   description: "Stickers 4 U"
  },
  {
    image: "https://cloud-c1gqq7ttf-hack-club-bot.vercel.app/0sticker_pile_2.png",
   description: "5ticker5"
  },
]


function Polaroid({image, caption, props}: {image: string, caption: string, props?: string}){
  return (
    <div className = {`bg-white w-full h-max p-3 ${props}`}>
      <img className = "object-cover" src = {image}/>
      <p className="text-center">{caption}</p>
    </div>
  )
}


export default async function Index() {

  return (
    <main className="w-screen h-full relative flex flex-col justify-center items-center bg-hc-primary-dull">
      <div className="pointer-events-none w-screen h-screen fixed top-0 left-0 z-[0] overflow-hidden blur-sm brightness-75 after:absolute after:inset-0 after:bg-hc-primary/80 after:mix-blend-soft-light after:pointer-events-none">
        <Background shouldAnimate />
      </div>
      <div className="relative z-10 pointer-events-none">
        <Header/>
        <div className="pointer-events-none flex flex-col w-screen h-screen justify-center items-center px-8 gap-6 text-hc-secondary italic">
          <div className="grow"/> {/* i cbf finding a better solution */}
          <div className = "grow">
            <img className = "my-auto mx-auto" src = "/logo.svg"/>
            {/* hero section, check auth for ongoing session and this will say continue hacking instead of start, otherwise you'll have to scroll to the bottom to start hacking (or something like that) */}
            <p className="text-xl text-center">Venture forth into the unknown...</p>
            <div className = "pointer-events-auto">
              <AuthStateButton/>
            </div>
          </div>
          <div>
            <h2 className="text-hc-secondary">get started</h2><br/><br/>
            <h1 className="text-hc-secondary rotate-90 text-3xl">-{'>'}</h1>
          </div>  

        </div>
        <div className="w-screen h-max bg-hc-primary-dull p-12 sm:p-16 flex flex-col gap-10 lg:flex-row">
          {/* to do: a blurb about days of service, think something like the counter from the gwynne shotwell site: https://gwynne.hackclub.dev */}
          <div>
            <h1 className = "text-hc-secondary text-5xl">How this works:</h1>
            <div className = "flex flex-col md:flex-row">
              <div className = "grid grid-cols-8 w-full lg:w-10/12 text-hc-secondary py-8">
                  { steps.map((step, index) =>
                  <>
                  <h1 key={`${index}_number`} className = "col-span-1 text-6xl md:text-8xl">{index+1}</h1>
                  <div key={`${index}_step`} className = "col-span-7 py-4">
                    <h1 className="text-2xl md:text-4xl py-2">{step.title}</h1>
                    <p>{step.description}</p>
                  </div>
                  </> 
                )}
              </div>
            </div>
          </div>
          <div className = "relative sm:pr-12 md:pr-24 pt-12">
            <Polaroid image = "https://cdn.hackclubber.dev/slackcdn/e20a8569d31870caf1f0cb8d4aa97b7b.png" caption = "code on websites..." props="rotate-[345deg] md:w-96"/>
            <Polaroid image = "https://cdn.hackclubber.dev/slackcdn/e20a8569d31870caf1f0cb8d4aa97b7b.png" caption = "...earn rewards" props="absolute lg:relative rotate-[12deg] top-0 sm:right-10 md:w-96"/>
          </div>
        </div>
        <div className="w-screen h-full sm:h-screen p-12 sm:p-16 flex flex-col items-center justify-center">
              <h1 className = "text-hc-secondary text-5xl md:text-7xl text-center">
                Last time we did this:
              </h1>
              <div className = "grid grid-cols-1 sm:grid-cols-3 gap-12 my-10">
              {stats.map((stat, index) => 
                <div key={index} className = "col-span-1 text-hc-secondary text-center">
                  <h1 className = "text-4xl">
                    {stat.number}
                  </h1>
                  <p className="text-lg">{stat.description}</p>
                </div>
                )}
              </div>
        </div>

        <div className="w-screen h-screen py-12 sm:py-16 bg-hc-primary-dull flex flex-col">
          <h1 className = "text-hc-secondary text-5xl sm:text-7xl text-center">
                  Prizes
          </h1>
          <Marquee className = "my-8 grow" pauseOnHover={true}>
            {prizes.map((prize, index) => 
              <Painting key={index} image={prize.image} description={prize.description}/>
            )}
          </Marquee>
        </div>

        <div className="w-screen h-full p-12 sm:p-16">
          <h1 className = "text-hc-secondary text-5xl sm:text-7xl text-center">
                  Frequently Asked Questions
          </h1>
          <div className = "grid grid-cols-1 md:grid-cols-2 py-4">
            {FAQ.map((q, index) => 
                  <div key={index} className = "col-span-1 text-hc-secondary text-left m-3 p-5 bg-hc-primary-dull/50 ">
                    <h1 className = "text-2xl">
                      {q.question}
                    </h1>
                    <p className="text-lg">{q.answer}</p>
                  </div>
                  )}
          </div>
        </div>

        <div className="w-screen h-screen p-16 sm:p-24 bg-hc-primary-dull">
          <h1 className = "text-hc-secondary text-3xl text-left">
                  <i>brought to you by</i>
          </h1>
          <h1 className = "text-hc-secondary text-7xl text-left">
            Athena
          </h1>
          <div className = "py-16">
            <img className="w-48" src = "https://assets.hackclub.com/flag-standalone-wtransparent.svg"/>
            <p className ="text-hc-secondary">insert more partners</p>
          </div>
        </div>
        <div className="w-screen h-full sm:h-screen p-12 sm:p-16 flex flex-col gap-8 items-center justify-center">
          <h1 className = "text-hc-secondary text-2xl sm:text-4xl text-center grow">
            3 projects. 30 hours.
          </h1>
          <h1 className = "text-hc-secondary text-5xl sm:text-7xl text-center grow italic">
            What will you build?
          </h1>
          <div className="pointer-events-auto"><AuthStateButton/></div>
          </div>    
      </div>
  
    </main>
  )
}

