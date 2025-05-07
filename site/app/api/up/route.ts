// this is for coolify
import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ message: "up" }, { status: 200 });
}
