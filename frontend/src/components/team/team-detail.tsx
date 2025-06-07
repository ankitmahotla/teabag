import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSessionStore } from "@/store/session";
import {
  useGetTeamByIdSync,
  useGetTeamRequestStatusSync,
  useRequestToJoinTeamSync,
  useWithdrawTeamJoiningRequestSync,
} from "@/sync/teams";
import { useGetUserByIdSync } from "@/sync/user";
import { Crown, Loader } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export const TeamDetail = ({
  teamId,
  cohortId,
  open,
  setOpen,
  isJoinable,
}: {
  teamId: string;
  cohortId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  isJoinable: boolean;
}) => {
  const { data: team } = useGetTeamByIdSync(teamId);
  const { data: requestStatus } = useGetTeamRequestStatusSync(teamId);
  const { mutate: requestToJoinTeam } = useRequestToJoinTeamSync();
  const { mutate: withdrawTeamJoiningRequest } =
    useWithdrawTeamJoiningRequestSync();

  const [showNoteField, setShowNoteField] = useState(false);
  const [note, setNote] = useState("");

  const request = requestStatus?.request;
  const status = request?.status;
  const withdrawnAt = request?.withdrawnAt
    ? new Date(request.withdrawnAt)
    : null;

  const now = Date.now();
  const canReapply =
    withdrawnAt && now - withdrawnAt.getTime() >= 1000 * 60 * 60 * 24;

  const handleJoinTeamClick = () => {
    if (!showNoteField) {
      setShowNoteField(true);
    } else {
      requestToJoinTeam({ teamId, note, cohortId });
      resetDialogState();
    }
  };

  const handleWithdraw = () => {
    withdrawTeamJoiningRequest(teamId);
    resetDialogState();
  };

  const resetDialogState = () => {
    setOpen(false);
    setShowNoteField(false);
    setNote("");
  };

  const renderActionButton = () => {
    if (status === "pending") {
      return (
        <Button disabled={!requestStatus.canWithdraw} onClick={handleWithdraw}>
          {requestStatus.canWithdraw ? "Withdraw" : "Wait 24h"}
        </Button>
      );
    }

    if (status === "accepted") return null;

    if (status === "rejected") {
      return (
        <Button variant="destructive" disabled className="cursor-default">
          Rejected
        </Button>
      );
    }

    if (status === "withdrawn") {
      return (
        <Button
          onClick={handleJoinTeamClick}
          disabled={!canReapply}
          className={!canReapply ? "cursor-default" : ""}
        >
          {canReapply
            ? showNoteField
              ? "Send Request"
              : "Join Team"
            : "Wait 24h"}
        </Button>
      );
    }

    if (!status && isJoinable) {
      return (
        <Button onClick={handleJoinTeamClick}>
          {showNoteField ? "Send Request" : "Join Team"}
        </Button>
      );
    }

    return null;
  };

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
                  {team.description?.trim() || "No description provided"}
                </span>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-lg font-medium">Members</h3>
              {team.members.length > 0 ? (
                <ul className="pl-4 list-disc text-sm space-y-1">
                  {team.members.map((member) => (
                    <Member
                      key={member.membershipId}
                      userId={member.userId}
                      isLeader={member.userId === team.leaderId}
                    />
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No members found.
                </p>
              )}
            </section>

            {showNoteField && (
              <Textarea
                placeholder="Write a note to the team (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full"
              />
            )}

            <div className="flex justify-end">{renderActionButton()}</div>
          </div>
        ) : (
          <div className="flex justify-center items-center py-8">
            <Loader className="h-6 w-6 animate-spin" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Member = ({
  userId,
  isLeader,
}: {
  userId: string;
  isLeader: boolean;
}) => {
  const { user } = useSessionStore();
  const { data } = useGetUserByIdSync(userId);

  return (
    <li key={userId} className="break-all">
      <p className="flex items-center gap-2">
        {user?.id === userId ? "You" : data?.user[0].name}{" "}
        {isLeader && <Crown size={12} color="white" />}
      </p>
    </li>
  );
};
