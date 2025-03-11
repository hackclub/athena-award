import NextAuth from "next-auth"
import SlackProvider from "next-auth/providers/slack"

import type { NextAuthConfig } from "next-auth"

export const config = {
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
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)