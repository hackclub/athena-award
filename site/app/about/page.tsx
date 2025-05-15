import { Header } from "@/components/panels/Header";
import { AuthStateButton } from "@/components/panels/Header";
export default function About(){
    return (
    <>
        <Header skipWelcomeModal={true}/>
        <img className = "object-cover w-screen h-[50vh]" src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/390b6fa1417d3af121ebf065b59e7ad25052c811_image.png"/>

        <div className = "flex flex-col w-screen p-16 min-h-screen bg-hc-primary-dull bg-[url(/bg.svg)]">
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
          <div className = "py-4 *:text-white *:text-xl  flex flex-col gap-4">
            <h2 className = "!text-3xl">Welcome, acolytes, to the Athena Award.</h2>
            <p>The Athena Award is a program run by Hack Club for girls and gender minorities looking to get into programming, coding, and building technical projects of any kind.</p>
            <p>In collaboration with:</p>
            <ul className = "list-inside list-disc">
                <li>MIT Beaverworks</li>
                <li>GitHub</li>
                <li>GirlsWhoCode</li>
                <li>Girl Scouts of Greater New York</li>
            </ul>
            <h2 className = "!text-3xl">What's in it for me?</h2>
            <p>Build three projects (or more!) in 30 hours, and you'll be invited to a <span className = "font-bold !text-gold">three-day hackathon</span> running November 14th - November 16th in the <span className = "!text-gold">heart of New York City</span>.{' '}
            Travel stipends provided for the top 70 programmers.</p>
            
            <p>Can't make it to New York City? No stress - for every hour you code during the Athena Award, you'll be rewarded with one <span className = "!text-gold">artifact</span>.</p>
            <p>Artifacts can be redeemed in our shop for <span className = "!text-gold font-bold">laptops, hoodies, headphones</span> and more, to help you keep on hacking!</p>
          
            <p>Additionally, all successful recipients of the Athena Award will be sent a certificate - available in digital and physical form - to certify their technical skills. </p>
            <h2 className = "!text-3xl">How can I get started?</h2>
            <AuthStateButton/>
            <p>Sign up here to access the Athena Award website, where you'll be able to:</p>
            <ul className = "list-inside list-disc">
                <li>Access programming resources</li>
                <li>Keep track of the artifacts you've earned</li>
                <li>Order prizes from the shop</li>
                <li>Track your progress on completing the Athena Award</li>
            </ul>
            <p>Additionally, you'll be sent an invite to join the Hack Club Slack - a community of high school programmers from all around the world. If you need help on your project and getting started, the Slack is the place to be!</p>
        
            <h2 className = "!text-3xl">Okay, I'm sold. How can I start working on my projects?</h2>
            <p>First, figure out what you want to make. If you're a complete beginner, start with the Beginner Track - three project ideas that we guide you through completing.</p>
            <p>The first one, <a target = "_blank" href = "https://tribute.hackclub.com">Tribute</a>, will teach you how to make a basic website themed after something you like. By the end of the Beginner Track, you'll be prepared to continue making some awesome, functional webpages!</p>
            <p>Alternatively, if you already know a little bit of programming - feel free to jump in with the Advanced Track.</p>
            <div className = "*:border-[#E89368] *:rounded-lg *:border-2 flex flex-col *:flex-1 md:flex-row gap-4 *:basis-1/3 *:grow justify-center *:bg-[#E89368]/30 *:p-4 items-center">
                <div>
                    <h1>Beginner Track</h1>
                    <p>Complete the three beginner workshops on web development, designed by the team behind the Athena Award.</p>
                </div>
                <div>
                    <h1>Advanced Track</h1>
                    <p>Build three of your own projects - for people who want to challenge themselves! Things for work and school don't count for the Athena Award!</p>
                </div>
            </div>
            <h2 className = "!text-3xl">How do I submit my projects?</h2>
            <p>Your project needs to meet some criteria before you submit.</p>
            <ul className = "list-disc list-inside">
                <li>Code needs to be open source. Use a website like <a target = "_blank" href = "https://github.com">GitHub</a> to publish your code.</li>
                <li>Your project needs to, well, exist. It doesn't count if you're the only one who can access it! For instance, websites need to have a public URL, and apps need to be downloadable. This is called <span className = "!text-gold">deploying</span> your project.</li>
                <li>It needs to be something original, that's not for work or school. Also - come on, you can do better than using AI to write your entire project for you.</li>
            </ul>
            <p>Once that's done, a member of the team will review and approve your project. Your project might be rejected if it doesn't meet the criteria, in which case, you're free to resubmit once you fix any issues.</p>
          </div>
          </div>
        </div>

    </>
    )
}