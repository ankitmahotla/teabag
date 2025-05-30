"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { redirect } from "next/navigation";
import { useSessionStore } from "@/store/session";
import { Spinner } from "@/components/spinner";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, hasHydrated } = useSessionStore();
  const hasExpiredToken = useSessionStore(
    (state) => state.expiresAt !== null && Date.now() > state.expiresAt,
  );

  if (!hasHydrated) return <Spinner />;

  if (hasExpiredToken) {
    // mutate({
    //   refresh_token: tokens?.RefreshToken as string,
    // });
    // Todo: refresh token
  }

  if (!isAuthenticated) return redirect("/auth");

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
