// beta trial
const start_date = "2025-03-24"
const end_date = "2025-03-31"

export async function getWakaTimeData(slackId: string){
    const response = await fetch(`https://timedump.hackclub.com/api/v1/users/${slackId}/stats?features=projects&start_date=${start_date}&end_date=${end_date}`)
    return (response) 
}
