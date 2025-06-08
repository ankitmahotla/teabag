import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useDisbandTeamSync } from "@/sync/teams";

interface DisbandTeamDialogProps {
  teamId: string;
  cohortId: string;
}

export const DisbandTeamModal = ({
  teamId,
  cohortId,
}: DisbandTeamDialogProps) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const { mutate: disbandTeam } = useDisbandTeamSync(cohortId);

  const handleDisband = () => {
    if (!reason.trim()) return;

    disbandTeam({ teamId, reason: reason.trim() });
    setOpen(false);
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Disband</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disband Team</DialogTitle>
          <DialogDescription>
            This action will remove all members from the team and archive the
            group. You must provide a reason for disbanding.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          placeholder="Enter the reason for disbanding..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDisband}
            disabled={!reason.trim()}
          >
            Confirm Disband
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
