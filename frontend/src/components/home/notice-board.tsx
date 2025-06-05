import { format } from "date-fns";

export const NoticeBoard = () => {
  return (
    <section>
      <h2 className="text-lg font-medium mb-3">Notice Board</h2>
      <div className="space-y-3">
        {/* Replace this with real notices */}
        {[
          {
            id: 1,
            message: "Kickoff call tomorrow at 10am",
            postedAt: "2025-06-04T16:00:00Z",
          },
          {
            id: 2,
            message: "Submit weekly update by Friday",
            postedAt: "2025-06-02T12:30:00Z",
          },
        ].map((notice) => (
          <div key={notice.id} className="p-4 border rounded-md bg-muted/50">
            <p className="text-sm">{notice.message}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Posted: {format(new Date(notice.postedAt), "PPPp")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
