import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useKickTeamMemberSync } from "@/sync/teams";

interface KickMemberDialogProps {
  teamId: string;
  memberId: string;
  memberName: string;
  trigger: React.ReactNode;
}

export const KickMemberDialog = ({
  teamId,
  memberId,
  memberName,
  trigger,
}: KickMemberDialogProps) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const kickMutation = useKickTeamMemberSync(teamId);

  const handleKick = () => {
    kickMutation.mutate({ teamId, teamMemberId: memberId, reason });
    setOpen(false);
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kick {memberName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            Provide a reason for kicking <strong>{memberName}</strong> from the
            team.
          </p>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Inactivity, rule violation..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleKick}
            disabled={!reason.trim() || kickMutation.isPending}
          >
            {kickMutation.isPending ? "Kicking..." : "Confirm Kick"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
