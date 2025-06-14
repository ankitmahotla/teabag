import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateNotice } from "@/sync/notice";

export const CreateNoticeForm = ({
  teamId,
  postedBy,
}: {
  teamId: string;
  postedBy: string;
}) => {
  const [message, setMessage] = useState("");
  const { mutate: createNotice, isPending } = useCreateNotice();

  const handleSubmit = () => {
    if (!message.trim()) return;
    createNotice({ teamId, postedBy, message });
    setMessage("");
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Write a new team notice..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={isPending}>
        {isPending ? "Posting..." : "Post Notice"}
      </Button>
    </div>
  );
};
