import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetTeamByIdSync } from "@/sync/teams";
import { Loader } from "lucide-react";

export const TeamDetail = ({
  teamId,
  open,
  setOpen,
}: {
  teamId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { data: team } = useGetTeamByIdSync(teamId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Team Details
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            A summary of the team and its members.
          </DialogDescription>
        </DialogHeader>
        {team ? (
          <div className="mt-4 space-y-6">
            <section className="space-y-2">
              <h3 className="text-lg font-medium">Overview</h3>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="font-medium text-muted-foreground">Name:</span>
                <span className="col-span-2">{team.name}</span>

                <span className="font-medium text-muted-foreground">
                  Description:
                </span>
                <span className="col-span-2">
                  {team.description?.trim() !== ""
                    ? team.description
                    : "No description provided"}
                </span>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-lg font-medium">Members</h3>
              {team.members.length > 0 ? (
                <ul className="pl-4 list-disc text-sm space-y-1">
                  {team.members.map(
                    (member: { membershipId: string; userId: string }) => (
                      <li key={member.membershipId} className="break-all">
                        {member.userId}
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No members found.
                </p>
              )}
            </section>
          </div>
        ) : (
          <Loader className="h-6 w-6 animate-spin" />
        )}
      </DialogContent>
    </Dialog>
  );
};
