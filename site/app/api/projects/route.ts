import Airtable from 'airtable';
import { NextResponse } from 'next/server';

const airtable = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

function fuzzLatLng(lat: number, lng: number, radiusKm: number) {
    const radiusInDegrees = radiusKm / 111;
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radiusInDegrees;
    const dLat = distance * Math.cos(angle);
    const dLng = distance * Math.sin(angle) / Math.cos(lat * Math.PI / 180);
    return {
        lat: lat + dLat,
        lng: lng + dLng,
    };
}

async function geocodeAddress(address: string): Promise<{lat: number, lng: number} | null> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'athena-award/1.0' } });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
        return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
        };
    }
    return null;
}

export async function GET() {
    try {
        const records = await airtable('Projects').select({
            filterByFormula: 'AND({status} = "approved", {user_consent})'
        }).all();
        const projects = [];
        for (const record of records) {
            const fields = record.fields;
            const address = fields['address_joined_no_name (from form_submitted_project)'] as string | undefined;
            let latLng = null;
            let country = undefined;
            const slack_id = fields['slack_id'];
            if (address) {
                latLng = await geocodeAddress(address[0].replace("\n", ""));
                const addressParts = address[0].split("\n")[address[0].split("\n").length - 1]
                country = addressParts;
                if (latLng) {
                    latLng = fuzzLatLng(latLng.lat, latLng.lng, 30);
                }
            }
            const project_name = fields['project_name'];
            const playable_url = fields['playable_url'];
            const code_url = fields['code_url'];
            if (latLng) {
                projects.push({
                    lat: latLng.lat,
                    long: latLng.lng,
                    label: [{
                        project_name,
                        playable_url,
                        code_url,
                        country,
                        slack_id 
                    }]
                });
            }
        }
        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch projects', details: String(error) }, { status: 500 });
    }
}
