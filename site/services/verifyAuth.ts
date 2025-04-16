'use server'
import { auth } from "@/auth";
export async function verifyAuth(){
    const session = await auth();
    if (!session){
        return { error: "Unauthed" }
    }
}