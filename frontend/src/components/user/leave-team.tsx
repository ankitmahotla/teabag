import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLeaveTeamSync } from "@/sync/teams";
import { useState } from "react";
import { useRouter } from "next/navigation";

type LeaveTeamDialogProps = {
  teamId: string;
};

export function LeaveTeamDialog({ teamId }: LeaveTeamDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const { mutate, isPending } = useLeaveTeamSync(teamId);
  const router = useRouter();

  const handleLeave = async () => {
    mutate({ teamId, reason });
    setReason("");
    setOpen(false);
    router.push("/");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Leave Team</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave Team</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to leave this team? This action cannot be
            undone.
          </p>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <label className="text-sm font-medium" htmlFor="reason">
            Reason
          </label>
          <Textarea
            id="reason"
            placeholder="Let us know why you're leaving..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={handleLeave}
            disabled={!reason.trim() || isPending}
          >
            {isPending ? "Leaving..." : "Leave Team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
