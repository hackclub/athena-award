import NextAuth from "next-auth"
import SlackProvider from "next-auth/providers/slack"
import { linkUser } from "@/services/addUserToDB"
import type { NextAuthConfig } from "next-auth"

export const config: NextAuthConfig = {
  theme: {
    logo: "/logo.svg",
  },
  debug: true,
  providers: [
    SlackProvider({
      clientId: process.env.SLACK_CLIENT_ID!,
      clientSecret: process.env.SLACK_CLIENT_SECRET!,
      checks: ['nonce'],
      authorization: {
        params: {
          team: "T0266FRGM"
        }
      }
    }),
  ],
  events: {
    async signIn({user, account, profile}) {
      console.log()
      linkUser(user.email!, account?.access_token!)

  }},
  callbacks: {
    async jwt({token, account, profile}) {
      if (account) {
        token = Object.assign({}, token, { access_token: account.access_token, slack_id: profile!.sub });
      }
      return token
    },
    async session({session, token, user}) {
    if(session) {
      session = Object.assign({}, { ...session }, {access_token: token.access_token, slack_id: token.slack_id})
      }
    return { ...session }
    }
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)