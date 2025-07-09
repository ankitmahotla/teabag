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
import {
  useDisbandTeamSync,
  useGetTeamMembersSync,
  useTeamLeaderShipTransferRequestSync,
} from "@/sync/teams";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSessionStore } from "@/store/session";
import { Member } from "@/types/team";
import { useRouter } from "next/navigation";

interface DisbandTeamDialogProps {
  cohortId: string;
  teamId: string;
}

export const DisbandTeamModal = ({
  cohortId,
  teamId,
}: DisbandTeamDialogProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [action, setAction] = useState<"disband" | "transfer">("disband");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { user } = useSessionStore();
  const { data } = useGetTeamMembersSync(teamId);
  const teamMembers =
    data?.members?.filter((member: Member) => member.userId !== user?.id) ?? [];

  const { mutate: disbandTeam } = useDisbandTeamSync(
    cohortId,
    teamId,
    user?.id,
  );
  const { mutate: transferLeadership } = useTeamLeaderShipTransferRequestSync();

  const handleAction = () => {
    if (!reason.trim()) return;

    if (action === "disband") {
      disbandTeam(
        { teamId, reason: reason.trim() },
        {
          onSuccess: () => {
            router.push("/");
          },
        },
      );
    }

    if (action === "transfer") {
      if (!selectedUserId) return;
      transferLeadership({
        teamId,
        receiverId: selectedUserId,
        reason: reason.trim(),
      });
    }

    setOpen(false);
    setReason("");
    setSelectedUserId(null);
    setAction("disband");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="destructive">
          Disband
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disband or Transfer Leadership</DialogTitle>
          <DialogDescription>
            You can either disband this team or transfer leadership to another
            member. A reason is required.
          </DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={action}
          onValueChange={(value) => setAction(value as "disband" | "transfer")}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="disband" id="disband" />
            <Label htmlFor="disband">Disband the team</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="transfer" id="transfer" />
            <Label htmlFor="transfer">Transfer leadership</Label>
          </div>
        </RadioGroup>

        {action === "transfer" && (
          <div className="space-y-2">
            <Label>Select team member to transfer leadership to:</Label>
            <Select
              onValueChange={(val) => setSelectedUserId(val)}
              value={selectedUserId ?? ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member: Member) => (
                  <SelectItem key={member.userId} value={member.userId}>
                    {member?.name ?? member.userId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Textarea
          placeholder="Enter the reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleAction}
            disabled={
              !reason.trim() || (action === "transfer" && !selectedUserId)
            }
          >
            {action === "disband" ? "Confirm Disband" : "Initiate Transfer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
