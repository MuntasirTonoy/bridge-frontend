"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/?mode=signup");
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ fontWeight: "600" }}>Redirecting...</div>
    </div>
  );
}
