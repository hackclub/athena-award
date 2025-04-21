'use client'
import { useState, useEffect } from 'react';

export default function Loading(){
    const [ message, setMessage ] = useState("")
    const loadingMessages = [
        "Searching for hidden treasure...",
        "Seeking land!",
        "Hunting dragons 🐉",
        "Going overboard 🚢",
        "All aboard!",
        "Searching for gold...",
        "Battling monsters 👹",
        "Discovering secrets..."
    ]
    useEffect(() => {
        setMessage(loadingMessages[Math.floor(Math.random()*loadingMessages.length)])
    }, [])

    return (
        <div className = "bg-black w-screen h-screen flex flex-col items-center justify-center">
            <h1 className="text-white text-2xl">Loading...</h1>
            <p className="mt-2 text-white text-base">{message}</p>
        </div>
    )
}