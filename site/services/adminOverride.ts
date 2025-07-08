import { NextRequest } from "next/server";
import { Session } from "next-auth";
export async function identifySlackId(request: NextRequest, session: Session){
      const authorization = request.headers.get("Authorization")!;
      const slack_id = request.nextUrl.searchParams.get("slack_id")
      if (authorization && authorization.split(" ")[1] == process.env.REFRESH_API_KEY) {
        return slack_id
      } else {
        return session.slack_id!
      }
}