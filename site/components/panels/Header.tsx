"use client"
import { useSession } from "next-auth/react";
export default function Header({children}: {children?: React.ReactNode}){
    const session = useSession();
    return (
      <div className = "absolute top-0 flex justify-end sm:justify-between px-10 w-full">
        <a className="hidden sm:inline" href = "https://hackclub.com">
          <img className = " w-32" src = "https://assets.hackclub.com/flag-orpheus-top.svg"/>
        </a>

        { session.status === "authenticated"
            ? <a className = "no-underline" href = {`${process.env.NEXT_PUBLIC_BASE_URL}/map`}><h2 className = "italic my-2 text-base sm:text-xl text-hc-secondary">already started? -{'>'}</h2></a>
            : null
        }

      </div>
    )
  }
  