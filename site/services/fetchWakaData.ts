import { cacheGet, cacheSet } from './redis';
import { NextResponse } from 'next/server';

// beta trial
const start_date = process.env.NEXT_PUBLIC_START_DATE;
const end_date = process.env.NEXT_PUBLIC_END_DATE;
const cache_ttl = 15 * 60; 

export async function getWakaTimeData(slackId: string) {
  const cacheKey = `waka:${slackId}`;
  
  const cached = await cacheGet(cacheKey);
  if (cached) {
    console.log(`Hackatime cache hit for user ${slackId}`);
    return NextResponse.json(cached)
  }

  console.log(`Hackatime cache miss for user ${slackId}, fetching from API`);
  const response = await fetch(
    `https://hackatime.hackclub.com/api/v1/users/${slackId}/stats?features=projects&start_date=${start_date}&end_date=${end_date}`,
      { 
        headers: { "Rack-Attack-Bypass": process.env.HACKATIME_RATE_LIMIT_BYPASS!
      }
    }
  );

  if (response.ok) {
    const data = await response.json();
    console.log(`Hackatime data from cache miss for user => ${slackId}`, data)
    await cacheSet(cacheKey, data, cache_ttl);
    return NextResponse.json(data)
  }
  console.log("response not ok", response)
  return response;
}
