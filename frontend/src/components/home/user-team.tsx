import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useSpaceStore from "@/store/space";
import {
  useGetUserTeamByCohortSync,
  useTogglePublishTeamSync,
} from "@/sync/teams";
import { format } from "date-fns";
import { useSessionStore } from "@/store/session";
import { TeamMembers } from "./team-members";
import { TeamNotFound } from "./team-notfound";
import { PendingRequests } from "./pending-requests";
import { DisbandTeamModal } from "./disband-team";
import { PendingTransferRequests } from "./pending-transfer";
import TeamNotices from "./team-notices";
import { CreateNoticeForm } from "./create-notice";
import { TeamNoticesList } from "./notice-board";

export const UserTeam = () => {
  const { user } = useSessionStore();
  const { spaceId } = useSpaceStore();
  const { data: userTeam } = useGetUserTeamByCohortSync(spaceId!);
  const { mutate } = useTogglePublishTeamSync();

  if (!userTeam?.teamDetails) {
    return <TeamNotFound />;
  }

  const team = userTeam.teamDetails;
  const isLeader = team.leaderId === user?.id;
  const isPublished = team.isPublished;

  const handlePublish = () => {
    mutate(team.teamId);
  };

  return (
    <section className="flex flex-col gap-12 lg:flex-row lg:items-start">
      <div className="flex-1 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 text-xl">
              <AvatarFallback>{team.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-semibold">{team.name}</h1>
              <p className="text-sm text-muted-foreground">
                Team ID: {team.teamId.slice(0, 8)}...
              </p>
              <p className="text-sm text-muted-foreground">
                Created: {format(new Date(team.createdAt), "PPPp")}
              </p>
            </div>
          </div>
          {isLeader && (
            <div className="flex  gap-4">
              <Button
                onClick={handlePublish}
                variant={isPublished ? "outline" : "default"}
              >
                {isPublished ? "Unpublish" : "Publish"}
              </Button>
              {spaceId && (
                <DisbandTeamModal teamId={team.teamId} cohortId={spaceId} />
              )}
            </div>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          <strong>Leader:</strong>{" "}
          {isLeader ? (
            <span className="text-primary">You</span>
          ) : (
            team.leaderId.slice(0, 8) + "..."
          )}
          <br />
          <strong>Status:</strong>
          {isPublished ? " Published" : " Not Published"}
        </div>

        <div className="space-y-4">
          <TeamMembers team={team} />
        </div>

        <div className="space-y-4">
          {isLeader && (
            <CreateNoticeForm teamId={team.teamId} postedBy={user?.id} />
          )}
          <TeamNoticesList teamId={team.teamId} userId={user?.id} />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <PendingTransferRequests leaderId={team.leaderId} teamId={team.id} />
        {isLeader && (
          <aside className="w-full lg:w-[320px] space-y-4">
            <div className="bg-muted/20 rounded-md p-4">
              <h2 className="text-lg font-semibold mb-3">Join Requests</h2>
              <PendingRequests teamId={team.teamId} />
            </div>
          </aside>
        )}
      </div>
    </section>
  );
};
