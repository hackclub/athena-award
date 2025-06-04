# Contribute to Athena Award
This is a monorepo containing the source code of the Athena Award project.
Contributions and bug reports are welcome - in fact, are encouraged! -  to this repository!
Step one is to join the `#athena-award` channel on Slack. This can help you stay posted on major changes and also have you contribute to the project in collaboration with other people!

Here's a couple of general things about the project that can help you get up and running quickly:

### Data and Other Contributions
Stages are added through the file [site/app/STAGES.ts](/site/app/STAGES.ts)

You can also create interactive components in the `components` directory. Import them the way you would any other React component and use however you'd like!

## Site & Slack Contributions

Note that while the following isn't strictly necessary to get the site up and running locally, literally all of the site is gated behind various forms of authentication and will **not** work should you set this up incorrectly.

In order to test Slack OAuth, you will need a public-facing `https` URL to enter as the redirect URL (Slack requires this!). You can use any of the following two methods to obtain one for development, or another that works for you. 

### 1. ngrok

ngrok allows you to access your locally running development environment from the web.

1. Create an [ngrok account](https://download.ngrok.com/) and follow the instructions to install it on your device. 
2. Complete the onboarding stage and deploy your app on a static domain. The command you run should look something like this:
    ```ngrok http --url=<your ngrok static provided domain> 3000```
3. Add your ngrok URL into your .env file as appropriate. You can now access your app from that domain, as well as `localhost`.

### 2. zrok

Zrok is similar to ngrok, but has more lenient traffic restrictions than ngrok.

1. Create a [zrok account](https://docs.zrok.io/docs/getting-started/) on the public zrok instance.
2. Download and install [zrok](https://docs.zrok.io/docs/getting-started/#installing-the-zrok-command) for your device.
3. Create a reserved share for this project by running the following:
    ```
    zrok reserve public 3000 --unique-name "insert a name of your choice"
    ```
4. Add your zrok URL into your .env file as appropriate. You can now access your app from that domain, as well as `localhost`.

### Creating the Slack app
1. Create a [new Slack app](https://api.slack.com/apps) using the provided [manifest.yml](/manifest.yml) file. This app is used for both Slack OAuth on the Athena Award website and for bot functionality in the Slack.
2. Copy the provided Client ID and Client Secret, then enter them into your .env file as appropriate.
3. Navigate to `OAuth & Permissions`. Add your ngrok/zrok/other URL as the Redirect URL.
4. Finally, install the app to the Slack.

When testing Slack OAuth, make sure you have both the local dev environment and the ngrok/zrok/other instance running.

## Airtable Contributions

Obtain the Airtable API key and base ID and enter them into your .env file as appropriate (If you're involved in this project, DM @phthallo on the Hack Club Slack for help with this)

### Project Review
When a user submits a project for a specific stage, it is added to the centralised Athena Award Airtable where it is then manually reviewed. Projects can be either rejected, approved, pending, or unreviewed. 

`rejected` - project was submitted through the form and was deemed insufficient.
`approved` - project was submitted through the form and was deemed sufficient.
`pending` - project has been selected on the Athena Award website but not submitted through the form yet.
`unreviewed` - project was submitted through the form and has not been manually reviewed yet.

Users are prompted to resubmit projects if it is initially rejected. Projects are then tied to their record (slackId_projectNumber), to keep track of what has been submitted to what stage.

## Bot Contributions

The [bot](/bot) is currently used for welcoming new users and messaging users on Slack when their projects receive a status update. As it contains a flow for upgrading multichannel guests to full users, it needs a Slack admin token to run.

| Variable | Description | 
| `SLACK_BROWSER_TOKEN` | [xoxc token](https://gist.github.com/maxwofford/5779ea072a5485ae3b324f03bc5738e1) of a Slack workspace admin. |
| `SLACK_COOKIE` | xoxd token of a Slack workspace admin, sourced from browser cookies under the key 'd'. |  
| `SLACK_APP_TOKEN` | xapp token of the Slack bot. |
| `SLACK_BOT_TOKEN` | xoxb token of the Slack bot user. |
| `SLACK_SIGNING_SECRET` | Signing secret of the Slack app. |
| `AIRTABLE_API_KEY` | Airtable PAT with access to the Athena Award base. |
| `AIRTABLE_BASE_ID` | ID of the Athena Award base. |

Build and run it using the provided `Dockerfile.bot`.