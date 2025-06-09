import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useSessionStore } from "@/store/session";
import { useKickTeamMemberSync } from "@/sync/teams";
import useSpaceStore from "@/store/space";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetUserByIdSync } from "@/sync/user";
import { Skeleton } from "@/components/ui/skeleton";

const kickSchema = z.object({
  reason: z.string().min(1, "A reason is required"),
});

type KickFormValues = z.infer<typeof kickSchema>;

export const UserProfile = ({
  userId,
  readOnly = true,
  team,
}: {
  userId: string;
  readOnly?: boolean;
  team?: any;
}) => {
  const { user } = useSessionStore();
  const { spaceId } = useSpaceStore();
  const { mutate } = useKickTeamMemberSync(spaceId!);
  const { data, isLoading } = useGetUserByIdSync(userId);

  const form = useForm<KickFormValues>({
    resolver: zodResolver(kickSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = (data: KickFormValues) => {
    mutate({ teamId: team.id, teamMemberId: userId, reason: data.reason });
  };

  const recentInteractions = data?.interactions?.slice(0, 10);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            View and manage team member profile.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="font-medium">{data?.user.name || "No name"}</p>
              <p className="text-sm text-muted-foreground">
                {data?.user.email}
              </p>

              {team && (
                <>
                  <p className="font-medium mt-2">Team </p>
                  <p className="text-sm text-muted-foreground">{team.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {team.leaderId === data.user.id ? "Leader" : "Member"}
                  </p>
                </>
              )}
            </div>

            <div>
              <p className="font-semibold text-sm mb-2">Recent Interactions</p>
              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {recentInteractions.length > 0 ? (
                  recentInteractions.map((interaction, index) => (
                    <div
                      key={interaction.id || index}
                      className="border p-2 rounded text-sm"
                    >
                      <div className="font-medium">{interaction.type}</div>
                      {interaction.note && (
                        <div className="text-muted-foreground">
                          {interaction.note}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No recent interactions.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {!readOnly && team.leaderId === user?.id && user?.id !== userId && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogFooter>
                <div className="pt-6 flex flex-col gap-4 w-full">
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter reason..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                    <Button type="submit" variant="destructive">
                      Kick
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
