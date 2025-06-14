import { useTeamNotices } from "@/sync/notice";
import { Notice } from "@/types/notice";
import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import { DeleteNoticeButton } from "../user/delete-notice";
import { useSessionStore } from "@/store/session";
import { UpdateNoticeForm } from "./update-notice";

export const RecentNotices = ({
  teamId,
  leaderId,
}: {
  teamId: string;
  leaderId?: string;
}) => {
  const { user } = useSessionStore();
  const { data } = useTeamNotices(teamId);
  const notices = data || [];

  return (
    <section className="space-y-4 border-t pt-6">
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-lg font-medium">Recent Notices</h3>
      </div>

      <div className="relative space-y-6">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-muted" />

        {notices.length ? (
          notices.map((notice: Notice) => (
            <div key={notice.id} className="relative pl-8">
              <span className="absolute left-2 top-3 w-2 h-2 rounded-full bg-muted-foreground" />

              <div className="bg-muted/40 px-3 py-2 rounded-md text-sm text-muted-foreground space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p>{notice.message}</p>
                    <p className="text-xs text-muted-foreground opacity-70">
                      {formatDistanceToNow(new Date(notice.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {leaderId === user?.id && (
                    <div className="flex gap-2 items-center">
                      <UpdateNoticeForm notice={notice} />
                      <DeleteNoticeButton
                        noticeId={notice.id}
                        postedBy={notice.postedBy}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No recent notices.</p>
        )}
      </div>
    </section>
  );
};
