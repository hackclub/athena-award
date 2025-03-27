// TO DO: add fancy shmancy transitions when text shows up
"use client"
import { Header } from "@/components/panels/Header"
import { useSession } from "next-auth/react";
import { Loading, Unauthenticated } from "@/components/screens/Modal";
import { useRouter } from "next/navigation";

const steps = [
    {
        "step": "1. Build a project",
        "description": "Code some technical projects that challenge you. Things for school and work don't count!"
    },
    {
        "step": "2. Ship your project",
        "description": "What's the point of making a project if no one else can use it? Demo it to other teenage coders online in the Hack Club Slack!"
    },
    {
        "step": "3. Repeat",
        "description": "Do this three times (or more, as needed). Earn artifacts - our currency - with each project shipped."
    },
    {
        "step": "4. Code for 30 hours",
        "description": "We'll help you track the time you spend working on your projects. Once you hit 30 hours, we'll mail you a kickass certificate to certify your technical skills."
    }
]

export default function Page(){
    const session = useSession();
    const router = useRouter();
    async function registerUser() {
        const res = await fetch('/api/user',  
          {
            method: "POST", 
            body: JSON.stringify({
                email: session.data!.user.email,
              }),
            headers: { Authorization: "Bearer " + btoa(session.data!.access_token! + ":" + process.env.AUTH_SECRET!)}
      }).then(r => r.json())
        return res
      }
 return (
    <>
    {session.status === "authenticated" ? 
    <main className="w-screen h-full relative flex flex-col justify-center items-center">
        <div className="w-screen h-screen fixed top-0 left-0 z-[1] overflow-hidden bg-[url(/ponte-salario.jpg)] bg-cover blur-sm brightness-50 after:absolute after:inset-0 after:bg-hc-primary/80 after:mix-blend-soft-light"/>
        <div className="relative z-10">
        <Header/>

        <div className="flex flex-col w-screen h-full lg:h-screen items-center justify-center p-16 sm:p-24 gap-6 text-hc-secondary">
            <h1 className="text-3xl sm:text-5xl text-center">Welcome to the <i>Athena Award</i></h1>
            <div className="text-left pt-8 mx-auto flex flex-col gap-4">
                { steps.map((step, index) => 
                <div key={index} className="pb-2">
                    <h1 className="text-2xl sm:text-4xl text-left">{step.step}</h1>
                    <p className="text-left text-lg py-1 sm:text-xl">{step.description}</p>
                </div>) }
            </div>
            <button onClick={()=> {registerUser(); router.push("/map")}} className="text-hc-secondary no-underline text-right ml-auto"><h1 className="text-2xl">ready? -{'>'}</h1></button>
            </div>
        </div>
    </main>
    : session.status === "loading" 
    ? <Loading/>
    : <Unauthenticated/>
                    }
    </>
 )

}