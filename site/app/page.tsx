import Background from "@/components/landscape/Background"
import Layers from "@/components/landscape/Layers"
import WelcomeModal from "@/components/welcome/WelcomeModal"

export default async function Index() {
  // const session = await auth()

  return (
    <main className="w-screen h-[200vh] relative flex flex-col justify-center items-center">
      <div className="w-screen h-screen fixed top-0 left-0 z-[0] overflow-hidden">
        <Background />
      </div>
      <div className="relative z-10">
        <div className="flex flex-col w-screen h-screen justify-center items-center gap-6">
          {/* hero section, check auth for ongoing session and this will say continue hacking instead of start, otherwise you'll have to scroll to the bottom to start hacking (or something like that) */}
          <h1 className="text-7xl font-bold drop-shadow">Athena Award</h1>
          <WelcomeModal />
        </div>
        <div className="w-screen h-screen bg-hc-secondary">
          {/* to do: a blurb about days of service, think something like the counter from the gwynne shotwell site: https://gwynne.hackclub.dev */}
        </div>
      </div>
    </main>
  )
}

