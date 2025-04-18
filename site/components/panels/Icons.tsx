import { useContext } from "react";
import { UXEventContext } from "@/components/context/UXStages";
import { useSession } from "next-auth/react";

export default function Icons() {
    const [_, setUXEvent] = useContext(UXEventContext)
    const session = useSession();
    return (
      <>
        <div className = "absolute right-8 top-8 sm:right-16 sm:top-16 mb-5 flex flex-col items-center gap-4 text-white">
          <button onClick={() => {
              setUXEvent("profile");
            }} id="profile">
              {/* <img src="" width={48} height={48} alt="Profile details" /> */}
              <span className="ml-auto size-10 rounded-full bg-cover bg-no-repeat bg-center block" style={{
                backgroundImage: `url('${session.data!.user.image ? session.data!.user.image : "https://th.bing.com/th/id/OIP.eC3EaX3LZiyZlEnZmQjhngHaEK?w=318&h=180&c=7&r=0&o=5&dpr=2&pid=1"}')`
              }}></span>
          </button>
          <button onClick={() => {
            setUXEvent("info");
          }} id = "info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
          </button>
          <button onClick={() => {
            setUXEvent("shop");
          }} id = "shop">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
          </svg>
          </button>

          <button onClick={() => {
            setUXEvent("leaderboard");
          }} id = "leaderboard">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.242 5.992h12m-12 6.003H20.24m-12 5.999h12M4.117 7.495v-3.75H2.99m1.125 3.75H2.99m1.125 0H5.24m-1.92 2.577a1.125 1.125 0 1 1 1.591 1.59l-1.83 1.83h2.16M2.99 15.745h1.125a1.125 1.125 0 0 1 0 2.25H3.74m0-.002h.375a1.125 1.125 0 0 1 0 2.25H2.99" />
            </svg>
          </button>
        </div>
      </>
    )
  }