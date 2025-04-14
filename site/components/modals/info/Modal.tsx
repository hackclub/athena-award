import { useContext, useEffect } from "react";
import { UXEventContext } from "@/components/context/UXStages";
import Modal from "@/components/panels/layout/PopUpModal";
import { FaXmark } from "react-icons/fa6";
import { Action } from "@/components/panels/add-ons/Callout";


const PRIZEFAQ = [{
        question: "How do I earn prizes?",
        answer: "Spend time working on a technical project that challenges you for each stage, while tracking your time with Hackatime, then submit it. We'll then review it. We'll (a team of teenage coders, just like you!) then review your project. Approved projects earn 'artifacts'!"
    }, 
    {
        question: "How many artifacts does each prize cost?",
        answer: "Semi-trick question! You don't actually spend your artifacts - when you complete a project for a stage, you're eligible to select one prize from that stage. The prizes for each stage are different. Artifacts help you track how close you are to the final prize."
    },
    {
        question: "What's the final prize?",
        answer: "When you achieve 100 artifacts, and have 30 hours logged of coding, you become eligible for a fully-covered flight (dependent on location) to a hackathon hosted in New York City for all Athena Awards alumni. Hack Club has hosted dozens of hackathons before and will cover accommodation, meals and help with other logistics."
    },
    {
        question: "Can I earn more artifacts? What if I want more prizes?",
        answer: "Sure can! Keep on submitting projects to get more artifacts."
    },
]

const PROJECTFAQ = [{
    question: "What counts for a project?",
    answer: `
        Any technical project that is NOT for school or for a job, that's unique to you, and that has functionality. 
        No assignments done for your computer science class or following tutorials exactly - we want you to be creative! 
        Go on, build that blog or design that cute <a href = 'https://hackpad.hackclub.com/guide'>mini keyboard</a> for your desk. 
        <span class = 'py-2' ><img style = 'width: 50%' class = "mx-auto" src = 'https://github.com/user-attachments/assets/3ec939e7-5c2f-4628-91d5-7aeafd76d2bc'/><span class = 'block italic text-sm text-center w-full'>Nigiri sushi and cat-themed macropad built by Jeslyn from Houston, Texas. View the design <a href = 'https://github.com/se1yu/NigiriPad'>here</a>.</span></span>`
},
{
    question: "What do I need to submit?",
    answer: "<p>Your project needs to work, first of all - and it needs to work for everyone! This means people should be able to use your project from a link, or be able to download it and run it easily on their own device. Secondly, your project needs to be open source. This means your code needs to be public on a website such as GitHub.</p> <p>Those are the main two - we'll reach out if there are any issues with your project.</p>"
},
]

export default function InfoModal(){
    const [uxEvent, setUXEvent] = useContext(UXEventContext)
    return (
        <Modal uxEventName = "info" uxEvent={uxEvent} setUXEvent={setUXEvent} className="overflow-auto">
            <div className = "flex flex-col gap-3">
            <div className="self-start *:align-middle flex gap-3 w-full align-middle md:sticky">
                <div className="*:align-middle h-fit w-full bg-black/25 p-2 rounded flex gap-4 grow">
                    <img src="https://icons.hackclub.com/api/icons/hackclub-red/person" className="size-[32px] self-center align-middle" alt="info" />
                    <div className="self-center align-middle text-xl sm:text-3xl playfair-display font-bold italic">Info</div>
                </div>
                <button className="" onClick={() => setUXEvent('map')}>
                    <FaXmark className="size-8 md:size-14 text-white" />
                </button>
            </div>
            <Action title = "Question not answered here?">Send a message in the <a href = "https://app.slack.com/client/T0266FRGM/C06T17NQB0B">#athena-awards</a> channel on the Hack Club Slack to get help.</Action>

            <div className = "flex flex-col gap-3">
                <div className="text-white font-bold text-2xl uppercase">Technical Stuff</div>
                <h2 className = "text-lg sm:text-2xl bg-white/10 text-white p-2 rounded">Hackatime</h2>
                <div className = "grid md:grid-cols-2 gap-3">
                    <div className = "col-span-1">
                        <p><a target="_blank" href = "https://hackatime.hackclub.com">Hackatime</a> is what we use to track how much time you spend coding on your projects. Before you start working on your projects, you will need to set this up.</p>
                        <ul className = "list-decimal list-inside py-2">
                                <li>To set up Hackatime, head to <a target="_blank"href = "https://hackatime.hackclub.com/">Hackatime</a>, and sign in with Slack. </li>
                                <li>Install the Wakatime code extension in your editor. For example, if you use Vscode, you can install it from <a target="_blank" href="https://marketplace.visualstudio.com/items?itemName=WakaTime.vscode-wakatime">here</a>.</li>
                                <li>Type a bit in your code editor, then check Hackatime again to see your data appear.</li>
                        </ul>
                        <p className = "font-bold">Still confused? Watch these videos to see how to set it up.</p>
                        <a href = "https://www.youtube.com/watch?v=fX9tsiRvzhg">Windows set-up guide</a> | <a href = "https://www.youtube.com/watch?v=QTwhJy7nT_w">Mac/Linux set-up guide</a>
                    </div>
                    <img className = "col-span-1 aspect-video cover" src = "https://hc-cdn.hel1.your-objectstorage.com/s/v3/3057e5a387b8e8ce117e4cb86965525aa5e03d5b_image.png"/>    
                    </div>
                <h2 className = "text-lg sm:text-2xl bg-white/10 text-white p-2 rounded">Programming</h2>
                <span>
                    <p className = "font-bold">
                        I don't really know how to code!
                    </p>
                    <p>That's okay. Hack Club is a community of 55000+ teenagers from all over the world who love coding. Check out some of our <a target="_blank" href = "https://jams.hackclub.com/">introductory guides</a>, or ask a few questions in the <a href = "https://hackclub.slack.com/">Hack Club Slack</a> if you need help.</p>
                </span>
                </div>

                <div className="text-white font-bold text-2xl uppercase">Logistical Stuff</div>
                <h2 className = "text-lg sm:text-2xl bg-white/10 text-white p-2 rounded">Prizes</h2>
                {PRIZEFAQ.map((query, index) => 
                <span key = {index}>
                    <p className = "font-bold">{query.question}</p>
                    <p>{query.answer}</p>
                </span>)}
                <h2 className = "text-lg sm:text-2xl bg-white/10 text-white p-2 rounded">Projects</h2>
                {PROJECTFAQ.map((query, index) => 
                <span key = {index}>
                    <p className = "font-bold">{query.question}</p>
                    <p dangerouslySetInnerHTML={{__html: query.answer}}/>
                </span>)}
            </div>
        </Modal>
    )
}