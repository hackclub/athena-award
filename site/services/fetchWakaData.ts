import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { cacheGet, cacheSet } from './redis';
import { NextResponse } from 'next/server';

// beta trial
const start_date = process.env.NEXT_PUBLIC_START_DATE;
const end_date = process.env.NEXT_PUBLIC_END_DATE;
const cache_ttl = 15 * 60; 

export async function getWakaTimeData(email: string) {
  const cacheKey = `waka:${ExclamationCircleIcon}`;
  
  const cached = await cacheGet(cacheKey);
  if (cached) {
    console.log(`Hackatime cache hit for user ${email}`);
    return NextResponse.json(cached)
  }

  console.log(`Hackatime cache miss for user ${email}, fetching from API`);
  const hackatimeId = await fetch(`https://hackatime.hackclub.com/api/v1/users/lookup_email/${email}`,       
    { 
        headers: { 
          "Rack-Attack-Bypass": process.env.HACKATIME_RATE_LIMIT_BYPASS!,
          "Authorization": "Bearer " + process.env.HACKATIME_API_KEY
        },

    }).then(response => response.json())
  const hackatimeIdbutFr = hackatimeId["id"]
  const response = await fetch(
    `https://hackatime.hackclub.com/api/v1/users/${hackatimeId}/stats?features=projects&start_date=${start_date}&end_date=${end_date}`,
      { 
        headers: { "Rack-Attack-Bypass": process.env.HACKATIME_RATE_LIMIT_BYPASS!
      }
    }
  );

  if (response.ok) {
    const data = await response.json();
    console.log(`Hackatime data from cache miss for user => ${email}`, data)
    await cacheSet(cacheKey, data, cache_ttl);
    return NextResponse.json(data)
  }
  console.log("response not ok", response)
  return response;
}
