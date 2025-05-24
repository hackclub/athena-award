require('dotenv').config();
const { App, LogLevel } = require('@slack/bolt');
const Airtable = require('airtable');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
});

async function getSlackIdByEmail(email) {
  const userResult = await app.client.users.lookupByEmail({
    token: process.env.SLACK_BOT_TOKEN,
    email: email,
  });
  return userResult.user.id;
}

async function openConversationWithEmail(email) {
  const userId = await getSlackIdByEmail(email)

  const convo = await app.client.conversations.open({
    token: process.env.SLACK_BOT_TOKEN,
    users: userId,
  });
  return convo.channel.id; 
}

async function upgradeUser(email) {
  // stolen from toriel lol
  const userProfile = await app.client.users.lookupByEmail({
    token: process.env.SLACK_BOT_TOKEN,
    email: email,
  });
  const team_id = userProfile.user.team_id
  const userId = userProfile.user.id;

  if (
    !userProfile.user.is_restricted &&
    !userProfile.user.is_ultra_restricted
  ) {
    console.log(`User ${userId} is already a full user - skipping`)
    return null
  }
  console.log(`Attempting to upgrade user ${userId}`)

  const cookieValue = `d=${process.env.SLACK_COOKIE}`

  const headers = new Headers()

  headers.append('Cookie', cookieValue)
  headers.append('Content-Type', 'application/json')
  headers.append('Authorization', `Bearer ${process.env.SLACK_BROWSER_TOKEN}`)

  const form = JSON.stringify({
    userId,
    team_id,
  })
  await fetch(
    `https://slack.com/api/users.admin.setRegular?slack_route=${team_id}&user=${userId}`,
    {
      headers,
      method: 'POST',
      body: form,
    }
  )
    .then((r) => {
      r.json()
    })
    .catch((e) => {
      app.logger.error(`Upgrading <@${userId}> from a multi channel user to a regular user has failed.`,
      )
    })

}



const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

setInterval(async () => {
  try {
    const records = await base('Email Slack Invites').select({filterByFormula: "AND(NOT({dm_error}), NOT({welcome_message_sent}))"}).all();
    for (const record of records) {
      const email = record.get('email');
      if (!email) continue;
      try {
        const channelId = await openConversationWithEmail(email);
        await app.client.chat.postMessage({
          token: process.env.SLACK_BOT_TOKEN,
          channel: channelId,
          blocks:  [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `
                *Hi <@${await getSlackIdByEmail(email)}>! Welcome to the Athena Award!* :hyper-dino-wave:
I'm Orpheus. :orpheus-love: You might be wondering what you're doing here...

The Hack Club Slack is a community of high school programmers from all over the world.

You can meet others completing the Athena Award in the #athena-award channel. You can also meet other *girls and gender diverse programmers* in the #days-of-service channel.

Here's where you are right now:

1. Join the Hack Club Slack  :tw_white_check_mark: 
2. Hack on projects ← _You are here_
3. Earn cool prizes and your invite for the NYC hackathon. :tw_statue_of_liberty:`
              }
            }, 
            {
              "type": "actions",
              "elements": [
                {
                  "type": "button",
                  "text": {
                    "type": "plain_text",
                    "emoji": true,
                    "text": "Continue"
                  },
                  "style": "primary",
                  "action_id": "upgrade"
                }]}
          ],
          username: 'Athena Award',
          text: 'Welcome to the Athena Award!'
        });
        await base('Email Slack Invites').update([
          {
            id: record.id,
            fields: { welcome_message_sent: true },
          },
        ]);
        app.logger.info(`Sent welcome message to ${email} and marked as sent.`);
      } catch (err) {
        await base('Email Slack Invites').update([
          {
            id: record.id,
            fields: { dm_error: String(err) },
          },
        ]);
        app.logger.error(`Failed to message ${email}:`, err);
      }

      
    }
    
  } catch (err) {
    app.logger.info('Airtable fetch error:', err);
  }

  try {
    const records = await base('YSWS Project Submission').select({filterByFormula: `AND(NOT({status_change_dm_sent}), {status_change_reason}, OR({status} = "approved", {status} = "rejected"))`}).all();
    for (const record of records) {
      const email = record.get('Email');
      const project = record.get('Project Name')
      const project_name_override = record.get('project_name_override')
      const status = record.get('status')
      const reason = record.get('status_change_reason')
      app.logger.info(email, project, status, reason)
      if (!email) continue;
      try {
        const channelId = await openConversationWithEmail(email);
        await app.client.chat.postMessage({
          token: process.env.SLACK_BOT_TOKEN,
          channel: channelId,
          blocks:  [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `\n*Hey <@${await getSlackIdByEmail(email)}>!*\n\nYour project '${project_name_override || project}' has had a status update! It's now *${status}*.\nThe reason given was:\n\n>${reason}\n\nIf you have questions, send a message in #athena-award.\n                `
              }
            }, 
          ],
          username: 'Athena Award',
        });
        await base('YSWS Project Submission').update([
          {
            id: record.id,
            fields: { status_change_dm_sent: true },
          },
        ]);
        app.logger.info(`Sent status change update to ${email} and marked as sent.`);
      } catch (error) { 
        app.logger.info(`Failed to message ${email}`)
      }
    }
  } catch (err) {
    app.logger.info("Airtable fetch error:", err);
  }


  //try {
  //  const records = await base('Email Slack Invites').select({filterByFormula: "NOT({registered_user})"}).all();
  //  for (const record of records){
  //    const email = record.get("email")
  //    const userInRegisteredUsers = await base('Registered Users').select({filterByFormula: `AND({email} = "${email}"`}).all();
  //    app.logger.info(`Searched for invited user ${email} in Registered Users`)
  //    if (userInRegisteredUsers.length && userInRegisteredUsers[0].get("record_id")){
  //      await base("Email Slack Invites").update([{
  //        id: record.id,
  //        fields: { registered_user: [userInRegisteredUsers[0].get("record_id")]}
  //      }])
  //      app.logger.info(`Linked ${email} to their record in Registered Users.`);
  //
  //    }
  //  }
  //} catch (err) {
  //  app.logger.info("Airtable fetch error:", err);
  //}
}, 10000);

app.action('upgrade', async ({ ack, body }) => {
  await ack();
  let email;
  try {
    const userInfo = await app.client.users.info({
      token: process.env.SLACK_BOT_TOKEN,
      user: body.user.id,
    });
    email = userInfo.user.profile.email;
  } catch (e) {
    app.logger.error('Could not fetch user email for upgrade:', e);
    return;
  }
  await upgradeUser(email);
  const channelId = await openConversationWithEmail(email);
  await app.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    channel: channelId,
    blocks:  [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `To keep on hacking, return to <https://athena.hackclub.com/awards|the Athena Award> and sign in from the button in the top right corner.`
        }
      }
    ],
    username: 'Athena Award',
    text: 'Continue on Athena Award'
  });
});


(async () => {
  await app.start();
  console.log('Slack Bolt app is running!');
})();
