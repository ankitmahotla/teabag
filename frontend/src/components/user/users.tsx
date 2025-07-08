import { useGetUsersInCohortSync } from "@/sync/user";
import { User } from "@/types/user";
import { formatDistanceToNow } from "date-fns";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export const Users = ({ cohortId }: { cohortId: string }) => {
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetUsersInCohortSync(cohortId);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const users = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">All Users</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pr-2">
        {users.length === 0 ? (
          <div className="col-span-full">
            <p className="text-sm text-muted-foreground">No users found</p>
          </div>
        ) : (
          users.map((user: User, index: number) => (
            <Card
              key={user.id || index}
              className="border-border bg-card/80 transition-shadow hover:shadow-md flex flex-col justify-between h-full cursor-pointer"
              onClick={() => router.push(`/users/${user.id}`)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-foreground break-words">
                  {user.name || "Unnamed User"}
                </CardTitle>
                <p className="text-sm text-muted-foreground break-words">
                  {user.email}
                </p>
              </CardHeader>
              <CardContent className="pt-0 mt-auto flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Joined{" "}
                  {formatDistanceToNow(new Date(user.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </CardContent>
            </Card>
          ))
        )}

        {hasNextPage && (
          <div
            ref={ref}
            className="col-span-full flex justify-center py-2"
            aria-hidden="true"
          >
            {isFetchingNextPage && (
              <p className="text-xs text-muted-foreground">Loading more...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
