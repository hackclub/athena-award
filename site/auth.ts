import NextAuth from "next-auth";
import SlackProvider from "next-auth/providers/slack";
import CredentialsProvider from "next-auth/providers/credentials";
import { linkUser, getUserRole } from "@/services/addUserToDB";
import type { NextAuthConfig } from "next-auth";
import Airtable from "airtable";

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

async function getAirtableUser(email: string) {
  const records = await airtable("Registered Users")
    .select({
      filterByFormula: `{email} = "${email}"`,
      maxRecords: 1,
      fields: ["email", "slack_id", "display_name", "profile_picture"],
    })
    .all();
  if (records.length === 0) return null;
  const fields = records[0].fields;
  return {
    email: fields["email"] as string,
    slack_id: fields["slack_id"],
    display_name: fields["display_name"],
    profile_picture: fields["profile_picture"],
  };
}


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

  CredentialsProvider({
    name: "email",
    credentials: {
      email: { label: "Email", type: "email" }, otp: {label: "OTP", type: "number"},
    },
    async authorize(credentials) {
      const email = credentials?.email;
      const otp = credentials?.otp;
      console.log(credentials)
      if (!email || !otp) return null;

      // Check Airtable for Verification Codes record with matching email and otp and isUsed true
      try {
      const records = await airtable('Verification Codes')
        .select({
          filterByFormula: `AND({email} = '${email}', {OTP} = '${otp}')`,
          fields: ["isUsed"],
          sort: [{ field: "createdAt", direction: "desc" }],
          maxRecords: 1
        })
        .firstPage();
      console.log("AAAAAA" + records)
            if (records.length > 0 && records[0].get("isUsed") === true) {
        return { email: email as string };
      } 
      } catch (error) {
        console.log(error)
      }
      return null;
    },
  }),


  ],
  events: {
    async signIn({ user, account, profile }) {
      linkUser(user.email!);
    },
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      console.log("jwt callback is being triggered!")
      if (account && token.email) {
        const userInfo = await getAirtableUser(token.email);
        if (userInfo) {
          console.log("ALERT" + userInfo)
          token.email = userInfo.email;
          token.slack_id = userInfo.slack_id;
          token.display_name = userInfo.display_name;
          token.profile_picture = userInfo.profile_picture;
        }
      }
      return token;
    },    
    async session({ session, token }) {
      console.log("session is beingcalled ")
      if (!token || !token.email) {
          return session; // or return null
      }
      // Populate session.user with Airtable info
      session.user = {
        ...(session.user || {}),
        email: token.email!,
        slack_id: token.slack_id as string,
        display_name: token.display_name as string,
        profile_picture: token.profile_picture as string,
      } as typeof session.user;
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
