import { useParams } from "next/navigation";
import {
  useGetTeamByIdSync,
  useGetTeamRequestStatusSync,
  useGetUserTeamByCohortSync,
  useRequestToJoinTeamSync,
  useWithdrawTeamJoiningRequestSync,
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";
import { Member, TEAM } from "@/types/team";
import { ErrorBoundary } from "react-error-boundary";

const joinSchema = z.object({
  note: z.string().min(1, "Note is required"),
});

export const Team = ({ spaceId }: { spaceId: string }) => {
  const { id: teamId } = useParams();
  const { data: team } = useGetTeamByIdSync(teamId as string);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold">{team.name}</h1>
        <p className="text-muted-foreground">{team.description}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Members</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {team.members.map((member: Member) => (
            <TeamMember key={member.userId} userId={member.userId} />
          ))}
        </div>
      </section>
      <Suspense fallback={<div>Checking status...</div>}>
        <ErrorBoundary
          fallback={
            <JoinRequestButton
              teamId={teamId as string}
              spaceId={spaceId}
              team={team}
            />
          }
        >
          <UserTeam spaceId={spaceId} />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
};

const UserTeam = ({ spaceId }: { spaceId: string }) => {
  const { data } = useGetUserTeamByCohortSync(spaceId);
  if (data) return <Button disabled={true}>Can't Join</Button>;
  return null;
};

type JoinRequestButtonProps = {
  teamId: string;
  spaceId: string;
  team: TEAM & {
    members: Member[];
  };
};

const JoinRequestButton = ({
  teamId,
  spaceId,
  team,
}: JoinRequestButtonProps) => {
  const { user } = useSessionStore();

  const { data: requestStatus } = useGetTeamRequestStatusSync(teamId);
  const { mutate: requestToJoinTeam } = useRequestToJoinTeamSync(
    teamId as string,
  );
  const { mutate: withdrawTeamJoiningRequest } =
    useWithdrawTeamJoiningRequestSync();

  const [showNoteInput, setShowNoteInput] = useState(false);

  const form = useForm<z.infer<typeof joinSchema>>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      note: "",
    },
  });

  const onSubmit = (values: z.infer<typeof joinSchema>) => {
    requestToJoinTeam({
      teamId: teamId,
      note: values.note,
      cohortId: spaceId,
    });
    setShowNoteInput(false);
    form.reset();
  };

  const handleJoin = () => {
    if (!showNoteInput) {
      setShowNoteInput(true);
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  const handleWithdraw = () => {
    withdrawTeamJoiningRequest(teamId as string);
  };

  const isMember = team.members.some(
    (member: Member) => member.userId === user?.id,
  );

  if (isMember) return null;

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
