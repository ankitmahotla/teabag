import { useParams } from "next/navigation";
import { useGetTeamByIdSync, useTogglePublishTeamSync } from "@/sync/teams";
import { TeamMember } from "../team/team-member";
import { useSessionStore } from "@/store/session";
import { Button } from "../ui/button";
import { DisbandTeamModal } from "./disband-team";
import useSpaceStore from "@/store/space";
import { Member } from "@/types/team";
import { PendingTransferRequests } from "./pending-transfer";
import { PendingRequests } from "./pending-requests";
import { CreateNoticeForm } from "../forms/create-notice";
import { RecentNotices } from "../home/recent-notices";

export const Team = () => {
  const { user } = useSessionStore();
  const { spaceId } = useSpaceStore();
  const { id: teamId } = useParams();
  const { data: team } = useGetTeamByIdSync(teamId as string);
  const { mutate } = useTogglePublishTeamSync(teamId as string);

  const isLeader = team.leaderId === user?.id;
  const isPublished = team.isPublished;

  const handlePublish = () => {
    mutate(team.id);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-10">
          <div className="mb-10">
            <h1 className="text-3xl font-semibold">{team.name}</h1>
            <p className="text-sm text-muted-foreground">{team.description}</p>
          </div>
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Team Members</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {team.members.map((member: Member) => (
                <TeamMember
                  key={member.userId}
                  userId={member.userId}
                  leaderId={team.leaderId}
                />
              ))}
            </div>
          </section>

          <section className="space-y-6 pt-6">
            <RecentNotices teamId={team.id} leaderId={team.leaderId} />
          </section>
        </div>
        {isLeader && (
          <aside className="w-full lg:w-[320px] space-y-8">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Team Controls</h2>
              <Button
                onClick={handlePublish}
                variant={isPublished ? "outline" : "default"}
                className="w-full"
              >
                {isPublished ? "Unpublish Team" : "Publish Team"}
              </Button>
              {spaceId && (
                <DisbandTeamModal teamId={team.teamId} cohortId={spaceId} />
              )}
            </div>
            <div className="space-y-4 border-t pt-6">
              <h2 className="text-lg font-semibold">Post a Notice</h2>
              <CreateNoticeForm teamId={team.id} postedBy={team.leaderId} />
            </div>
            <div className="space-y-4 border-t pt-6">
              <h2 className="text-lg font-semibold">Leadership Transfers</h2>
              <PendingTransferRequests
                leaderId={team.leaderId}
                teamId={team.id}
              />
            </div>
            <div className="space-y-4 border-t pt-6">
              <h2 className="text-lg font-semibold">Join Requests</h2>
              <PendingRequests teamId={team.id} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
