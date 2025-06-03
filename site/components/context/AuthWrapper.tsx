"use client"

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Unauthenticated, Loading } from "@/components/screens/Modal";

export default function AuthWrapper({ children }: React.PropsWithChildren){
  const unauthedPages = ["/map", "/poster", "/about", "/", ""]
  const pathname = usePathname()
  const isUnauthedPage = unauthedPages.includes(pathname);
  const session = useSession();
  if (session.status === "unauthenticated") {
    if (!isUnauthedPage){
      return <Unauthenticated />;
    }
  } else if (session.status === "loading") {
    return <Loading />
  }

  return <>{children}</>;
};