import Airtable from 'airtable';
import { encryptSession, verifySession } from '@/services/hash'

const airtable = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID!)

// Update all info known about the registered user, including their Slack ID if they're in the Slack
export async function linkUser(emailAddress: string, accessToken: string){
    try {
        const accessTokenJoined = encryptSession(accessToken, process.env.AUTH_SECRET!)
        const response = await fetch(`https://slack.com/api/users.lookupByEmail?email=${emailAddress}`,
            {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + process.env.BOT_USER_OAUTH_TOKEN}
            }
        ).then(res => res.json())
        const id = response["user"]["id"]
        const r = await airtable("Registered Users").select({filterByFormula: `{email} = "${emailAddress}"`}).all()
        if (r.length) { // user exists in DB
            return ("User exists in DB")
        } else { // user is logging on for the first time
            console.log("adding user to database")
            const l = await airtable("Registered Users").create(
                [{
                    fields: {
                "email": emailAddress,
                "slack_id": id,
                "hashed_token": accessTokenJoined,
                            }
            }])            
        return "User added to DB"
        }
} catch(error) {
    throw error
    }
}