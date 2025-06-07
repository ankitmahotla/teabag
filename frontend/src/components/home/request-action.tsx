import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Button } from "../ui/button";

export const RequestActionModal = ({
  request,
  onClose,
}: {
  request: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    note?: string;
    profileUrl?: string; // Optional: link to their profile
  };
  onClose: () => void;
}) => {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Review Join Request</DialogTitle>
          <DialogDescription>
            Review the request details and take appropriate action.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2 text-sm">
          <div>
            <p className="text-muted-foreground">Name</p>
            <p className="font-medium">{request.name}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Email</p>
            <p>{request.email}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Requested At</p>
            <p>{format(new Date(request.createdAt), "PPPp")}</p>
          </div>

          {request.note && (
            <div>
              <p className="text-muted-foreground">Note</p>
              <p className="italic">“{request.note}”</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-between items-center gap-3">
          <Button
            variant="outline"
            onClick={() => {
              if (request.profileUrl) {
                window.open(request.profileUrl, "_blank");
              }
            }}
            disabled={!request.profileUrl}
          >
            View Profile
          </Button>

          <div className="flex gap-2 ml-auto">
            <Button
              variant="destructive"
              onClick={() => {
                // Reject handler
              }}
            >
              Reject
            </Button>
            <Button
              onClick={() => {
                // Accept handler
              }}
            >
              Accept
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
