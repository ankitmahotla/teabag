"use client";

import { useParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { formatDistanceToNow } from "date-fns";
import { useEffect } from "react";
import { useGetUserInteractionsPaginated } from "@/sync/user";
import { UserInteraction } from "@/types/user";

export const Activity = () => {
  const params = useParams();
  const userId = params.id as string;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGetUserInteractionsPaginated(userId);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading)
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  if (isError)
    return (
      <p className="text-sm text-muted-foreground">
        Error loading interactions.
      </p>
    );

  const interactions = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Activity Timeline</h2>
      <div className="max-h-60 overflow-y-auto pr-2 space-y-4">
        {interactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity</p>
        ) : (
          interactions.map((event: UserInteraction, index: number) => (
            <div
              key={event.id || index}
              className="flex justify-between items-start"
            >
              <p className="text-sm">{event.note ?? event.type}</p>
              <p className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(event.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          ))
        )}

        {hasNextPage && (
          <div ref={ref} className="h-6" aria-hidden="true">
            {isFetchingNextPage && (
              <p className="text-xs text-muted-foreground">Loading more...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
