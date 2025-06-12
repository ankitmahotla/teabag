import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateNotice } from "@/sync/notice";

export const UpdateNoticeForm = ({
  notice,
  postedBy,
  onClose,
}: {
  notice: { id: string; message: string };
  postedBy: string;
  onClose?: () => void;
}) => {
  const [message, setMessage] = useState(notice.message);
  const { mutate: updateNotice, isPending } = useUpdateNotice();

  const handleSubmit = () => {
    if (!message.trim()) return;
    updateNotice({ id: notice.id, message, postedBy });
    onClose?.();
  };

  return (
    <div className="space-y-4">
      <Textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      <div className="flex gap-2">
        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </Button>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};
