import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

// TO DO:
// add a scrolling list of point-giving initiatives (including completed stages for later)

export function Progress({profileIsOpen}: {profileIsOpen: boolean}){
    const session = useSession();
    const [ points, setPoints ] = useState("")
    
    async function fetchPoints(){
        const response = fetch(`/api/user/${session.data!.slack_id}/points`, {
          method: 'GET'
        }).then(r => r.json()).then(data => {setPoints(  data["message"] ? data["message"]: 0 )})
        return response
      }
    
        useEffect(() => {
          if (session.status === "authenticated"){
            fetchPoints()
          }
        }, [profileIsOpen])

    return (
        <>
        <h2 className="text-2xl text-hc-primary py-2"> {Number(points)}% of the way toward the Athena Award</h2>
        <div className="rounded-xl w-full h-8 bg-gray-200 my-3">
          <div className= "rounded-xl h-8 bg-hc-primary" style= {{width: Number(points) + "%"}}/>
        </div>
        <p>You can get points by completing <b>stages</b> or through certain <b>achievements.</b> Once you get enough points, you're automatically eligible for prizes.</p>

        </>
    )
} 