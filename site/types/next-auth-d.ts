import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
    profile_picture?: string;
    display_name?: string;
    slack_id?: string;
    role?: string;
  }

  interface Session {
    user: {} & DefaultSession["user"];
    access_token?: string;
    slack_id?: string;
    role?: string
  }
  
}
