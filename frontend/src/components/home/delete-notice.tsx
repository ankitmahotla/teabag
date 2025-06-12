import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useDeleteNotice } from "@/sync/notice";

export const DeleteNoticeButton = ({
  noticeId,
  postedBy,
}: {
  noticeId: string;
  postedBy: string;
}) => {
  const { mutate: deleteNotice, isLoading } = useDeleteNotice();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    deleteNotice({ id: noticeId, postedBy });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <p>Are you sure you want to delete this notice?</p>
        <div className="flex gap-2">
          <Button onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Confirm"}
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
