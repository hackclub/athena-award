import { cacheGet, cacheSet } from './redis';

const AIRTABLE_CACHE_TTL = 10 * 60;

export async function cachedAirtableSelect(
  table: any,
  selectOptions: any,
  cacheKey: string
) {
  const cached = await cacheGet(cacheKey);
  if (cached) {
    console.log(`Airtable cache hit: ${cacheKey}`);
    return cached;
  }

  console.log(`Airtable cache miss: ${cacheKey}, fetching from API`);
  try {
    const result = await table.select(selectOptions).all();
    await cacheSet(cacheKey, result, AIRTABLE_CACHE_TTL);
    return result;
  } catch (error) {
    console.error('Airtable API error:', error);
    throw error;
  }
}

export function generateAirtableCacheKey(
  tableName: string,
  selectOptions: any,
  slackId: string
): string {
  const optionsStr = JSON.stringify(selectOptions, Object.keys(selectOptions).sort());
  const hash = Buffer.from(optionsStr).toString('base64').slice(0, 16);
  return `airtable:${tableName}:${hash}:${slackId}`;
}
