import { useContext, useEffect } from "react";
import { UXEventContext } from "@/components/context/UXStages";
import Modal from "@/components/panels/layout/PopUpModal";
import { FaXmark } from "react-icons/fa6";
import { Action } from "@/components/panels/add-ons/Callout";


const PRIZEFAQ = [{
    question: "How do I earn prizes?",
    answer: "Work on a technical project that challenges you for each stage, track your time with Hackatime, and submit it. We (a team of teen coders like you!) will review it — approved projects earn artifacts!"
}, 
{
    question: "How many artifacts does each prize cost?",
    answer: "Think of it like an arcade! For every approved hour you log, you get 1 artifact to 'spend' on prizes (only for original projects — not pre-existing YSWS projects, which are part of Hack Club’s 'You Ship, We Ship' series where you build something and get rewarded)."
},
{
    question: "What's the final prize?",
    answer: "Complete 3 original projects and log 30 approved coding hours, and you can win a fully-covered flight (depending on where you're from) to a NYC hackathon for Athena Award alumni. Hack Club has hosted dozens of hackathons like these before — covered travel, stay, food — all of it."
},
{
    question: "Can I earn more artifacts? What if I want more prizes?",
    answer: "Yep! Just keep submitting projects and stacking up artifacts."
}]

const PROJECTFAQ = [{
    question: "What counts for a project?",
    answer: `
        Any technical project that's NOT for school, work, or copied tutorials — it should be unique and have real functionality. 
        Build a blog, design a <a href='https://hackpad.hackclub.com/guide'>mini keyboard</a>, anything creative you want! 
        <span class='py-2'>
            <img style='width: 50%' class='mx-auto' src='https://github.com/user-attachments/assets/3ec939e7-5c2f-4628-91d5-7aeafd76d2bc'/>
            <span class='block italic text-sm text-center w-full'>Nigiri sushi + cat-themed macropad by Jeslyn from Houston. See it <a href='https://github.com/se1yu/NigiriPad'>here</a>.</span>
        </span>`
},
{
    question: "What do I need to submit?",
    answer: `
        Two main things:
        <br>1) Your project needs to work! People should be able to easily use it through a link or download and run it without issues.
        <br>2) It also needs to be open source. Your code should be public on GitHub (or a similar site).
        <br><br>Bonus points: include a good README to explain what your project is and how to use it! 
        <br><br>If anything's unclear or missing, we'll reach out and help you fix it!`
},
]



export default function InfoModal(){
    const [uxEvent, setUXEvent] = useContext(UXEventContext)
    return (
        <Modal customHeader={{icon: "person", heading: "Info"}} uxEventName = "info" uxEvent={uxEvent} setUXEvent={setUXEvent} className="overflow-auto">
            <div className = "flex flex-col gap-3">
            <Action title = "Question not answered here?">Send a message in the <a href = "https://app.slack.com/client/T0266FRGM/C06T17NQB0B">#athena-award</a> channel on the Hack Club Slack to get help.</Action>

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
