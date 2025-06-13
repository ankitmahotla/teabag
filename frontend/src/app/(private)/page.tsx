"use client";

import { TeamOverview } from "@/components/home/team-overview";
import { UserPendingRequests } from "@/components/home/user-join-requests";
import { Button } from "@/components/ui/button";
import { Loader, Rocket } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function HomePage() {
  return (
    <Suspense fallback={<Loader className="h-6 w-6 animate-spin" />}>
      <ErrorBoundary fallbackRender={errorFallback}>
        <TeamOverview />
      </ErrorBoundary>
    </Suspense>
  );
}

const errorFallback = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Rocket className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">You&apos;re not in a team yet</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          To participate in projects and collaborate with peers, you’ll need to
          join or create a team.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link href="/teams/create">
            <Button>Create Team</Button>
          </Link>
          <Link href="/teams">
            <Button variant="outline">Explore Teams</Button>
          </Link>
        </div>
      </div>
      <UserPendingRequests />
    </div>
  );
};
