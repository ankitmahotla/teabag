"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateNotice } from "@/sync/notice";
import { useState } from "react";
import { Pencil } from "lucide-react";

type UpdateNoticeFormProps = {
  notice: { id: string; message: string; postedBy: string };
};

export const UpdateNoticeForm = ({ notice }: UpdateNoticeFormProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(notice.message);
  const { mutate: updateNotice, isPending } = useUpdateNotice();

  const handleSubmit = () => {
    if (!message.trim()) return;
    updateNotice(
      { id: notice.id, message, postedBy: notice.postedBy },
      {
        onSuccess: () => setOpen(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8"
          title="Edit notice"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Notice</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Keep your team informed. Edit the notice content and click save to
          apply your changes.
        </DialogDescription>
        <div className="space-y-4 pt-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Update your message..."
            rows={4}
          />
        </div>

        <DialogFooter className="pt-4">
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
