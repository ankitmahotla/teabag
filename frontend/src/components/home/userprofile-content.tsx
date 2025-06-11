import { useGetUserByIdSync } from "@/sync/user";
import { Skeleton } from "../ui/skeleton";

export const UserProfileContent = ({ userId }: { userId: string }) => {
  const { data, isLoading } = useGetUserByIdSync(userId);
  const recentInteractions = data?.interactions?.slice(0, 10);

  return (
    <div className="space-y-4 mt-4 border-t pt-4">
      {isLoading ? (
        <Skeleton className="h-4 w-1/2" />
      ) : (
        <>
          {/* <p className="font-medium">{data?.user.name}</p>
          <p className="text-sm text-muted-foreground">{data?.user.email}</p> */}

          <p className="font-semibold text-sm mt-4">Recent Interactions</p>
          <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
            {recentInteractions?.length ? (
              recentInteractions.map((interaction, index) => (
                <div key={index} className="border p-2 rounded text-sm">
                  <div className="font-medium">{interaction.type}</div>
                  {interaction.note && (
                    <div className="text-muted-foreground">
                      {interaction.note}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent interactions.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
