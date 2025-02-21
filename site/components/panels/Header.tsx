"use client"
import { useSession } from "next-auth/react";
import { Tooltip } from "react-tooltip";
import { useRouter } from "next/navigation";
import WelcomeModal from "../welcome/WelcomeModal";

export function AuthStateButton(){
  const session = useSession();
  const router = useRouter();
  return (
    <div className = "flex items-center">
      { session.status === "authenticated" ? 
         <button onClick={() => router.push("/map")} className="m-5 p-5 bg-hc-primary-dull rounded-xl text-center mx-auto">
            <h1 className="text-2xl">enter the gallery</h1>
        </button>
       : <WelcomeModal/>
      }
      </div>
  )
}
export function Header({children}: {children?: React.ReactNode}){
    const session = useSession();
    return (
      <div className = "absolute top-0 flex justify-end sm:justify-between px-6 w-full">
        <a className="hidden sm:inline" href = "https://hackclub.com">
          <img className = "w-32" src = "https://assets.hackclub.com/flag-orpheus-top.svg"/>
        </a>

        { session.status === "authenticated"
        
            ? 
            <div>
                <Tooltip id="profile_picture" place="left" className="z-10"/>
            <a data-tooltip-id="profile_picture" data-tooltip-content="You're logged in! Click here to skip to the map." className = "hidden sm:flex no-underline items-center justify-center" href = {`${process.env.NEXT_PUBLIC_BASE_URL}/map`}>
                <span className=" sm:inline-block ml-auto size-10 m-6 rounded-full bg-cover bg-no-repeat bg-center" style={{
                backgroundImage: `url('${session.data!.user.image ? session.data!.user.image : "https://th.bing.com/th/id/OIP.eC3EaX3LZiyZlEnZmQjhngHaEK?w=318&h=180&c=7&r=0&o=5&dpr=2&pid=1"}')`
              }}/><h2 className = "italic -ml-4 text-base sm:text-xl text-hc-secondary inline-block"> -{'>'}</h2></a>
            </div>
            : null
        }

      </div>
    )
  }
  