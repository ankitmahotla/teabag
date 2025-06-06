import { Badge } from "@/components/ui/badge";
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
import { NoticeBoard } from "./notice-board";
import { TeamNotFound } from "./team-notfound";

export const UserTeam = () => {
  const { user } = useSessionStore();
  const { spaceId } = useSpaceStore();
  const { data: userTeam } = useGetUserTeamByCohortSync(spaceId ?? "");
  const { mutate } = useTogglePublishTeamSync();

  if (!userTeam?.teamDetails?.length) {
    return <TeamNotFound />;
  }

  const team = userTeam.teamDetails[0];
  const isLeader = team.leaderId === user?.id;
  const isPublished = team.isPublished;

  const handlePublish = () => {
    mutate(team.teamId);
  };

  return (
    <>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 text-xl">
              <AvatarFallback>{team.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-semibold">{team.name}</h1>
              <p className="text-sm text-muted-foreground">
                Team ID: {team.teamId.slice(0, 8)}...
              </p>
            </div>
          </div>
          {isLeader && (
            <Button
              onClick={handlePublish}
              variant={isPublished ? "outline" : "default"}
            >
              {isPublished ? "Unpublish Team" : "Publish Team"}
            </Button>
          )}
        </div>

        <div className="text-sm text-muted-foreground space-y-1">
          <p>
            <strong>Leader:</strong>{" "}
            {isLeader ? (
              <span className="text-primary">You</span>
            ) : (
              team.leaderId.slice(0, 8) + "..."
            )}
          </p>
          <p>
            <strong>Created:</strong> {format(new Date(team.createdAt), "PPPp")}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <Badge variant={isPublished ? "default" : "outline"}>
              {isPublished ? "Published" : "Not Published"}
            </Badge>
          </p>
        </div>
      </section>
      <TeamMembers members={team.members} />
      <NoticeBoard />
    </>
  );
};
