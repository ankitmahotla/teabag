"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetUserTeamByCohortSync } from "@/sync/teams";
import { RecentNotices } from "./recent-notices";

export const TeamOverview = ({ spaceId }: { spaceId: string }) => {
  const { data } = useGetUserTeamByCohortSync(spaceId);
  const userTeam = data?.teamDetails;

  if (!userTeam) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <>
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-xl">{userTeam.name}</CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {userTeam.description}
              </p>
            </div>
            <Link href={`teams/${userTeam?.teamId}`}>
              <Button size="sm">Go to Team</Button>
            </Link>
          </CardHeader>
        </Card>
        <RecentNotices teamId={userTeam?.teamId} />
      </>
    </div>
  );
};
