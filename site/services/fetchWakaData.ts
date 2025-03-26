// beta trial
const start_date = "2025-03-24"
const end_date = "2025-03-31"

export async function getWakaTimeData(email: string){
    const response = await fetch(`https://timedump.hackclub.com/api/v1/stats?start_date=${start_date}&user_email=${email}&end_date=${end_date}&api_key=${process.env.HACKATIME_API_KEY}`)
    return (response) 
}
