import { NextRequest } from "next/server";
import { Session } from "next-auth";
export async function identifyEmail(request: NextRequest, session: Session){
      const authorization = request.headers.get("Authorization")!;
      const custom_email = request.nextUrl.searchParams.get("email")
      if (authorization && authorization.split(" ")[1] == process.env.REFRESH_API_KEY) {
        return custom_email
      } else {
        return session.user.email!
      }
}