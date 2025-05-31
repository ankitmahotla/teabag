"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { redirect } from "next/navigation";
import { useSessionStore } from "@/store/session";
import { Spinner } from "@/components/spinner";
import { useRefreshTokensSync } from "@/sync/auth";
import { useEffect } from "react";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, hasHydrated, expiresAt } = useSessionStore();
  const { mutate, isPending } = useRefreshTokensSync();

  const hasExpiredToken = expiresAt !== null && Date.now() > expiresAt;

  useEffect(() => {
    if (hasExpiredToken && !isPending) {
      mutate();
    }
  }, [hasExpiredToken, isPending, mutate]);

  if (!hasHydrated || isPending) return <Spinner />;

  if (!isAuthenticated) redirect("/auth");

  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
