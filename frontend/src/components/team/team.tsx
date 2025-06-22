import { useParams } from "next/navigation";
import {
  useGetTeamByIdSync,
  useGetTeamRequestStatusSync,
  useRequestToJoinTeamSync,
  useWithdrawTeamJoiningRequestSync,
} from "@/sync/teams";
import { TeamMember } from "./team-member";
import { useSessionStore } from "@/store/session";
import useSpaceStore from "@/store/space";
import { useState } from "react";
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

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";
import { Member } from "@/types/team";

const joinSchema = z.object({
  note: z.string().min(1, "Note is required"),
});

export const Team = () => {
  const { user } = useSessionStore();
  const { spaceId } = useSpaceStore();
  const { id: teamId } = useParams();
  const { data: team } = useGetTeamByIdSync(teamId as string);
  const { data: requestStatus } = useGetTeamRequestStatusSync(teamId as string);
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
      teamId: teamId as string,
      note: values.note,
      cohortId: spaceId!,
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

      {!isMember && (
        <section>
          {requestStatus?.hasRequested ? (
            requestStatus?.canWithdraw ? (
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
      )}
    </div>
  );
};
