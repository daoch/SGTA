"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLoading from "@/components/loading/app-loading";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return <AppLoading />;
}
