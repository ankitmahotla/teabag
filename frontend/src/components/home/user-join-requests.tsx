import useSpaceStore from "@/store/space";
import { useGetUserTeamJoiningRequestsByCohortSync } from "@/sync/user";
import _ from "lodash";
import { AlertCircle, Users } from "lucide-react";
import Link from "next/link";

export const UserPendingRequests = () => {
  const { spaceId } = useSpaceStore();
  const { data } = useGetUserTeamJoiningRequestsByCohortSync(spaceId!);
  const requests = data?.requests || [];

  return (
    <div className="border-t pt-8 space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-lg font-medium">Join Request Status</h3>
      </div>

      <div className="space-y-4">
        {requests.length ? (
          requests.map((req) => {
            const statusColor =
              req.status === "pending"
                ? "text-yellow-700"
                : req.status === "accepted"
                  ? "text-green-700"
                  : "text-red-700";

            return (
              <Link key={req.id} href={`/teams/${req.teamId}`}>
                <div className="flex items-start justify-between rounded-md border p-4">
                  <div>
                    <p className="text-sm font-medium">{req.teamName}</p>
                    <p className="text-xs text-muted-foreground">
                      Request status updated recently
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-md ${statusColor}`}
                  >
                    {_.capitalize(req.status)}
                  </span>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            You haven’t sent any join requests yet.
          </div>
        )}
      </div>
    </div>
  );
};
