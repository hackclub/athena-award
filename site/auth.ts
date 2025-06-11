import NextAuth from "next-auth";
import SlackProvider from "next-auth/providers/slack";
import { linkUser, getUserRole } from "@/services/addUserToDB";
import type { NextAuthConfig } from "next-auth";

export const config: NextAuthConfig = {
  theme: {
    logo: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/6ea8e84acae378a03d5b5e788a780a853aae4d21_outlined_logo__alt_-cropped.svg",
  },
  debug: true,
  providers: [
    SlackProvider({
      clientId: process.env.SLACK_CLIENT_ID!,
      clientSecret: process.env.SLACK_CLIENT_SECRET!,
      checks: ["nonce"],
      authorization: {
        params: {
          team: "T0266FRGM",
        },
      },
    }),
  ],
  events: {
    async signIn({ user, account, profile }) {
      linkUser(user.email!, account?.access_token!);
    },
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token = Object.assign({}, token, {
          access_token: account.access_token,
          role: await getUserRole(token.email!),
          slack_id: profile!.sub,
        });
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session) {
        session = Object.assign(
          {},
          { ...session },
          { access_token: token.access_token, slack_id: token.slack_id, role: token.role },
        );
      }
      return { ...session };
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
