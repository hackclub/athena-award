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
        </div>
      </>
    )
  }