"use client";

import { useSession } from "next-auth/react";

export default function SessionLoader({ children }) {
  const { data: session, status } = useSession();

  if (!session?.user) {
    return     <div className="text-center w-full ">
    <span className={"loading loading-ring loading-lg text-white" }></span>
  </div>;
  }

  return <>{children}</>;
}
