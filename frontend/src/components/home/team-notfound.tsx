import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CreateTeam } from "../team/create-team";
import { useGetUserTeamJoiningRequestsByCohortSync } from "@/sync/user";
import useSpaceStore from "@/store/space";
import { formatDistanceToNowStrict, isAfter, subHours } from "date-fns";
import { useState } from "react";
import { TeamDetail } from "../team/team-detail";

export const TeamNotFound = () => {
  const { spaceId } = useSpaceStore();
  const { data } = useGetUserTeamJoiningRequestsByCohortSync(spaceId!);
  const requests = data?.requests || [];

  const router = useRouter();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const handleWithdraw = (requestId: string) => {
    console.log("Withdraw request:", requestId);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 py-10 space-y-10">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-semibold text-foreground">
          You&apos;re not part of a team yet
        </h2>
        <p className="text-sm text-muted-foreground">
          Join an existing team or create your own to get started.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Button variant="outline" onClick={() => router.push("/teams")}>
            Browse Teams
          </Button>
          <CreateTeam />
        </div>
      </div>

      <div className="w-full max-w-2xl">
        <h3 className="text-lg font-medium mb-4 text-foreground">
          Your Team Join Requests
        </h3>

        <div className="border border-muted rounded-lg max-h-64 overflow-y-auto bg-background p-2 space-y-2">
          {requests.length > 0 ? (
            requests.map((req) => {
              const isPending = req.status === "pending";
              const createdAt = new Date(req.createdAt);
              const canWithdraw =
                isPending && isAfter(subHours(new Date(), 24), createdAt);

              return (
                <div
                  key={req.requestId}
                  onClick={() => setSelectedTeamId(req.teamId)}
                  className="flex items-center justify-between bg-white dark:bg-muted rounded-md p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold uppercase text-sm">
                      {req.teamName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-base">{req.teamName}</p>
                      <p className="text-xs text-muted-foreground">
                        Status: <span className="capitalize">{req.status}</span>
                        • {formatDistanceToNowStrict(createdAt)} ago
                      </p>
                    </div>
                  </div>

                  {isPending && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!canWithdraw}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWithdraw(req.requestId);
                      }}
                    >
                      {canWithdraw ? "Withdraw" : "Wait 24h"}
                    </Button>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground px-2 py-1">
              You haven&apos;t submitted any team join requests yet.
            </p>
          )}
        </div>
      </div>

      {selectedTeamId && (
        <TeamDetail
          teamId={selectedTeamId}
          cohortId={spaceId!}
          open={!!selectedTeamId}
          isJoinable={false}
          setOpen={(open: boolean) => {
            if (!open) setSelectedTeamId(null);
          }}
        />
      )}
    </div>
  );
};
