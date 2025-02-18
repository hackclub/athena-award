// requires that public data is enabled


export async function getWakaTimeData(userID: string){
    const response = await fetch(`https://waka.hackclub.com/api/compat/wakatime/v1/users/${userID}/stats/last_6_months`)
    return response
}