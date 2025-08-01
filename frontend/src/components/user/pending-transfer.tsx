import { useSessionStore } from "@/store/session";
import {
  usePendingTeamLeadershipTransfersSync,
  useTeamLeadershipTransferResponse,
} from "@/sync/teams";
import { Button } from "@/components/ui/button";

export const PendingTransferRequests = ({
  leaderId,
  teamId,
}: {
  leaderId: string;
  teamId: string;
}) => {
  const { data, isLoading } = usePendingTeamLeadershipTransfersSync();
  const { mutate: respondToTransfer } =
    useTeamLeadershipTransferResponse(teamId);

  const { user } = useSessionStore();
  const isLeader = user?.id === leaderId;

  const req = data?.request;

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Loading...</p>;

  if (!req) return null;

  const isRecipient = user?.id === req?.toUserId;
  const canCancel = isLeader && user?.id === req.fromUserId;

  return (
    <aside className="w-full lg:w-[320px] space-y-4">
      <div className="bg-muted/20 rounded-md p-4">
        <h2 className="text-lg font-semibold mb-3">Leadership Transfers</h2>
        <ul className="space-y-4">
          <li key={req.id} className="text-sm leading-snug">
            <div>
              <strong>{req.fromUserName ?? req.fromUserId.slice(0, 6)}</strong>{" "}
              → <strong>{req.toUserName ?? req.toUserId.slice(0, 6)}</strong>
            </div>
            {req.reason && (
              <p className="text-muted-foreground italic text-xs mt-1">
                {req.reason}
              </p>
            )}

            <div className="flex gap-2 mt-2">
              {isRecipient && (
                <>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() =>
                      respondToTransfer({
                        teamId,
                        transferRequestId: req.id,
                        status: "accepted",
                      })
                    }
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      respondToTransfer({
                        teamId,
                        transferRequestId: req.id,
                        status: "rejected",
                      })
                    }
                  >
                    Reject
                  </Button>
                </>
              )}

              {canCancel && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    respondToTransfer({
                      teamId,
                      transferRequestId: req.id,
                      status: "cancelled",
                    })
                  }
                >
                  Cancel
                </Button>
              )}
            </div>
          </li>
        </ul>
      </div>
    </aside>
  );
};
