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

const kickSchema = z.object({
  reason: z.string().min(1, "A reason is required"),
});

type KickFormValues = z.infer<typeof kickSchema>;

export const UserProfile = ({
  userId,
  readOnly = true,
  teamId,
}: {
  userId: string;
  readOnly?: boolean;
  teamId: string;
}) => {
  const { user } = useSessionStore();
  const { spaceId } = useSpaceStore();
  const { mutate } = useKickTeamMemberSync(spaceId!);

  const form = useForm<KickFormValues>({
    resolver: zodResolver(kickSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = (data: KickFormValues) => {
    mutate({ teamId, teamMemberId: userId, reason: data.reason });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will remove this user from the
            team.
          </DialogDescription>
        </DialogHeader>

        {!readOnly && user?.id !== userId && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogFooter>
                <div className="flex flex-col gap-4 w-full">
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
