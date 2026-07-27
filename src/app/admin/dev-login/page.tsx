"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDevLogin() {
  const router = useRouter();

  useEffect(() => {
    // Set dev admin role and mark account created, then redirect to /admin
    window.localStorage.setItem("joelink-account-role", "admin");
    window.localStorage.setItem("joelink-account-created", "true");
    window.dispatchEvent(new Event("joelink-account-updated"));
    router.replace("/admin");
  }, [router]);

  return <div className="min-h-screen flex items-center justify-center">Signing in as admin...</div>;
}
