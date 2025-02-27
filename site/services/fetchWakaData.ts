// requires that public data is enabled

export async function getWakaTimeData(userID: string){
    const response = await fetch(`https://waka.hackclub.com/api/compat/wakatime/v1/users/${userID}/stats/last_6_months?category=coding`)
    return (response) // UPDATE THIS TO USE /compat/wakatime/v1/users/{userid}/summaries ? would make life easier
}

export async function getWakaTimeProjects(userID: string){
    const response = await fetch(`https://waka.hackclub.com/api/compat/wakatime/v1/users/${userID}/projects`)
    return response
}