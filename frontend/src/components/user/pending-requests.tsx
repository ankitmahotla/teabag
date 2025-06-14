import { useState } from "react";
import { useGetPendingTeamJoinRequestsSync } from "@/sync/teams";
import { format } from "date-fns";
import { RequestActionModal } from "./request-action";
import { JoinRequest } from "@/types/request";

export const PendingRequests = ({ teamId }: { teamId: string }) => {
  const { data } = useGetPendingTeamJoinRequestsSync(teamId);
  const requests = data?.requests || [];

  const [selectedRequest, setSelectedRequest] = useState<
    null | (typeof requests)[0]
  >(null);

  return (
    <>
      {requests.length > 0 ? (
        <div className="space-y-3">
          {requests.map((req: JoinRequest) => (
            <div
              key={req.id}
              className="bg-muted rounded-md p-3 hover:bg-muted/70 transition cursor-pointer"
              onClick={() => setSelectedRequest(req)}
            >
              <div className="font-medium">{req.name}</div>
              <p className="text-xs text-muted-foreground">
                {format(new Date(req.createdAt), "PPPp")}
              </p>
              <p className="text-sm text-muted-foreground italic mt-1">
                “{req.note}”
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No pending requests.</p>
      )}

      {selectedRequest && (
        <RequestActionModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </>
  );
};
