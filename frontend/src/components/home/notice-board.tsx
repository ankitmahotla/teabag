import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UpdateNoticeForm } from "./update-notice";
import { DeleteNoticeButton } from "./delete-notice";
import { Skeleton } from "../ui/skeleton";
import { useTeamNotices } from "@/sync/notice";

export const TeamNoticesList = ({
  teamId,
  currentUserId,
}: {
  teamId: string;
  currentUserId: string;
}) => {
  const { data, isLoading } = useTeamNotices(teamId);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (isLoading) return <Skeleton className="h-24 w-full rounded" />;

  if (!data?.length)
    return <p className="text-muted-foreground">No notices yet.</p>;

  return (
    <div className="space-y-6">
      {data.map((notice: any) => (
        <div key={notice.id} className="border p-4 rounded-md space-y-2">
          {editingId === notice.id ? (
            <UpdateNoticeForm
              notice={notice}
              postedBy={currentUserId}
              onClose={() => setEditingId(null)}
            />
          ) : (
            <>
              <p className="whitespace-pre-wrap">{notice.message}</p>
              {notice.postedBy === currentUserId && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingId(notice.id)}
                  >
                    Edit
                  </Button>
                  <DeleteNoticeButton
                    noticeId={notice.id}
                    postedBy={currentUserId}
                  />
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};
