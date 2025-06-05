"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { redirect, usePathname } from "next/navigation";
import { useSessionStore } from "@/store/session";
import { Spinner } from "@/components/spinner";
import { useRefreshTokensSync } from "@/sync/auth";
import { Suspense, useEffect } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import _ from "lodash";
import { SpaceSelect } from "@/components/space-select";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, hasHydrated, expiresAt } = useSessionStore();
  const { mutate, isPending } = useRefreshTokensSync();
  const pathname = usePathname();
  const paths = pathname.split("/").filter((substring) => substring !== "");

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
      <SidebarInset>
        <header className="flex h-16 shrink-0 justify-between items-center pr-4 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {paths.map((path) => (
                  <span
                    key={path}
                    className="inline-flex justify-center items-center"
                  >
                    <BreadcrumbSeparator className="hidden md:block mr-2" />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href={`/${path}`} replace>
                          {_.capitalize(path)}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </span>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <SpaceSelect />
          </Suspense>
        </header>
        <Separator />
        <main className="p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
