# Contribute to Athena Award
Contributions are welcome to this repository!
Step one is to join the `#athena-award` channel on Slack. This can help you stay posted on major changes and also have you contribute to the project in collaboration with other people!

Here's a couple of general things about the project that can help you get up and running quickly:
## Site Contributions
* The `DEVELOPMENT_SETTINGS.ts` file can help to optimize your work. When using Developer Tools in your browser, toggling some of these settings can ease lag.

### Data and Other Contributions
* Stages are added through the file [site/app/STAGE.ts](site/app/STAGE.ts)

You can also create interactive components in the `components/panels/add-ons` directory. Import them the way you would any other React component and use however you'd like!

## `.env` File Explanation

In the `/site` folder, you'll see a file called `.env.example`. When you develop locally, you'll need to fill this out (in `.env`) as appropriate. Here's an explanation of what each environment variable represents.


| Variable name | Description | 
| ------------- | ----------- |
| `AUTH_SECRET` | A randomly generated string that is used to encode user secrets 
| `AUTH_URL`    | [will be updated] A URL where your site is accessible, with "/api/auth" appended |
| `SLACK_CLIENT_ID` | Client ID of the Slack App used for OAuth aka the "Sign in with Slack" function | 
| `SLACK_CLIENT_SECRET` | Client secret of the Slack App used for Oauth aka the "Sign in with Slack" function |  
| `AIRTABLE_API_KEY` | Technically now a PAT (personal access token). The token has to have read and write access to the base corresponding to the `AIRTABLE_BASE_ID` |
| `AIRTABLE_BASE_ID` | ID of the main 'Athena Award' Airtable base[^1] |
| `NEXT_PUBLIC_BASE_URL` | [will be updated] The base URL where your site is accessible |

[^1]: what i would never develop using the production db idk what you're talking about

## Slack Contributions

Note that while the following isn't strictly necessary to get the site up and running locally, a significant proportion of the site is gated behind various forms of authentication and will **not** work should you set this up incorrectly.

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
1. Create a [new Slack app](https://api.slack.com/apps).
2. Copy the provided Client ID and Client Secret, then enter them into your .env file as appropriate.
3. Navigate to `OAuth & Permissions`. Add your ngrok/zrok/other URL as the Redirect URL, then add the `identify` user token scope, as well the as `users:read` and `users:read.email` scopes.
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

