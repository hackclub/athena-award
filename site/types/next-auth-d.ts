import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {} & DefaultSession["user"];
    access_token?: string;
    slack_id?: string;
    role?: string
  }
}
