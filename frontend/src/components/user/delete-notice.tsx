import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteNotice } from "@/sync/notice";
import { Trash } from "lucide-react";

export const DeleteNoticeButton = ({
  noticeId,
  postedBy,
}: {
  noticeId: string;
  postedBy: string;
}) => {
  const { mutate: deleteNotice, isPending } = useDeleteNotice();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    deleteNotice({ id: noticeId, postedBy });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete this notice?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. The notice will be permanently removed
            for all team members.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Confirm"}
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
