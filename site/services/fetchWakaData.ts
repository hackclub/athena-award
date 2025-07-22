// beta trial
const start_date = process.env.NEXT_PUBLIC_START_DATE;
const end_date = process.env.NEXT_PUBLIC_END_DATE;

export async function getWakaTimeData(slackId: string) {
  const response = await fetch(
    `https://hackatime.hackclub.com/api/v1/users/${slackId}/stats?features=projects&start_date=${start_date}&end_date=${end_date}`,
      { 
        headers: { "Rack-Attack-Bypass": process.env.HACKATIME_RATE_LIMIT_BYPASS!
      }
    }
  );
  console.log(response)
  console.log(response.json())
  return response;
}
