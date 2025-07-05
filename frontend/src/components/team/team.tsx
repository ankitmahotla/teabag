import { useParams } from "next/navigation";
import {
  useGetTeamByIdSync,
  useGetTeamRequestStatusSync,
  useGetUserTeamByCohortSync,
  useRequestToJoinTeamSync,
  useWithdrawTeamJoiningRequestSync,
  useTogglePublishTeamSync,
} from "@/sync/teams";
import { TeamMember } from "./team-member";
import { useSessionStore } from "@/store/session";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import _ from "lodash";
import { z } from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";
import { Member } from "@/types/team";
import { ErrorBoundary } from "react-error-boundary";
import { CreateNoticeForm } from "../forms/create-notice";
import { RecentNotices } from "../home/recent-notices";
import { DisbandTeamModal } from "../user/disband-team";
import { PendingTransferRequests } from "../user/pending-transfer";
import { PendingRequests } from "../user/pending-requests";
import { LeaveTeamDialog } from "../user/leave-team";
const joinSchema = z.object({
  note: z.string().min(1, "Note is required"),
});

type TeamProps = {
  spaceId: string;
};

export const Team = ({ spaceId }: TeamProps) => {
  const { id: teamId } = useParams();

  const { user } = useSessionStore();
  const { data: team } = useGetTeamByIdSync(teamId as string);

  const { data: userTeam } = useGetUserTeamByCohortSync(spaceId);

  const isMember = team.members.some(
    (member: Member) => member.userId === user?.id,
  );
  const isLeader = team.leaderId === user?.id;
  const isPublished = team.isPublished;

  const { mutate: togglePublish } = useTogglePublishTeamSync(teamId as string);
  const handlePublish = () => togglePublish(team.id);

  const { data: requestStatus } = useGetTeamRequestStatusSync(teamId as string);
  const { mutate: requestToJoinTeam } = useRequestToJoinTeamSync(
    teamId as string,
  );
  const { mutate: withdrawTeamJoiningRequest } =
    useWithdrawTeamJoiningRequestSync();
  const [showNoteInput, setShowNoteInput] = useState(false);

  const form = useForm<z.infer<typeof joinSchema>>({
    resolver: zodResolver(joinSchema),
    defaultValues: { note: "" },
  });

  const onSubmit = (values: z.infer<typeof joinSchema>) => {
    requestToJoinTeam({
      teamId: teamId as string,
      note: values.note,
      cohortId: spaceId,
    });
    setShowNoteInput(false);
    form.reset();
  };

  const handleJoin = () => {
    if (!showNoteInput) setShowNoteInput(true);
    else form.handleSubmit(onSubmit)();
  };

  const handleWithdraw = () => withdrawTeamJoiningRequest(teamId as string);

  const canRequestToJoin = !isMember && !userTeam;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-10">
          <div className="mb-10">
            <h1 className="text-3xl font-semibold">{team.name}</h1>
            <p className="text-sm text-muted-foreground">{team.description}</p>
            <div className="mt-6">
              {isMember && !isLeader && (
                <LeaveTeamDialog cohortId={spaceId} teamId={team.id} />
              )}
            </div>
          </div>
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Team Members</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {team.members.map((member: Member) => (
                <TeamMember
                  key={member.userId}
                  teamId={team.id}
                  userId={member.userId}
                  leaderId={team.leaderId}
                />
              ))}
            </div>
          </section>

          {isMember && (
            <section className="space-y-6 pt-6">
              <RecentNotices teamId={team.id} leaderId={team.leaderId} />
            </section>
          )}

          {canRequestToJoin && (
            <Suspense fallback={<div>Checking status...</div>}>
              <ErrorBoundary
                fallback={
                  <JoinRequestButton
                    requestStatus={requestStatus}
                    showNoteInput={showNoteInput}
                    form={form}
                    handleJoin={handleJoin}
                    handleWithdraw={handleWithdraw}
                  />
                }
              >
                <Button disabled={true}>Can&apos;t Join</Button>
              </ErrorBoundary>
            </Suspense>
          )}
        </div>

        {(isLeader || isMember) && (
          <aside className="w-full lg:w-[320px] space-y-8">
            <div className="space-y-4 pb-6">
              <PendingTransferRequests
                leaderId={team.leaderId}
                teamId={team.id}
              />
            </div>
            {isLeader && (
              <div className="space-y-8">
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
                    <DisbandTeamModal
                      cohortId={spaceId}
                      teamId={teamId as string}
                    />
                  )}
                </div>
                <div className="space-y-4 border-t pt-6">
                  <h2 className="text-lg font-semibold">Join Requests</h2>
                  <PendingRequests teamId={team.id} />
                </div>
                <div className="space-y-4 border-t pt-6">
                  <h2 className="text-lg font-semibold">Post a Notice</h2>
                  <CreateNoticeForm teamId={team.id} postedBy={team.leaderId} />
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
};

type JoinRequestProps = {
  requestStatus: {
    request: {
      id: string;
      status: string;
    };
    hasRequested: boolean;
    canWithdraw: boolean;
  };
  showNoteInput: boolean;
  form: UseFormReturn<z.infer<typeof joinSchema>>;
  handleJoin: () => void;
  handleWithdraw: () => void;
};

const JoinRequestButton = ({
  requestStatus,
  showNoteInput,
  form,
  handleJoin,
  handleWithdraw,
}: JoinRequestProps) => {
  return (
    <>
      {showNoteInput && (
        <Form {...form}>
          <form className="space-y-8">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add a note..." {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the note attached with the request.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      )}
      <section>
        {requestStatus?.hasRequested ? (
          requestStatus?.request.status === "accepted" ? (
            <Button variant="outline" disabled>
              {_.capitalize(requestStatus?.request.status)}
            </Button>
          ) : requestStatus?.canWithdraw ? (
            <Button onClick={handleWithdraw} variant="outline">
              Withdraw Request
            </Button>
          ) : (
            <>
              <Button variant="outline" disabled>
                Join Request Sent
              </Button>
              <p className="text-xs text-slate-300 mt-2">
                * User can withdraw request after 24 hours
              </p>
            </>
          )
        ) : (
          <Button variant="default" size="sm" onClick={handleJoin}>
            Request to Join
          </Button>
        )}
      </section>
    </>
  );
};
