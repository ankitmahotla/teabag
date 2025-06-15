import { useGetUserByIdSync } from "@/sync/user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useSessionStore } from "@/store/session";
import { KickMemberDialog } from "../user/kick-user";
import { Button } from "../ui/button";

export const TeamMember = ({
  userId,
  leaderId,
  teamId,
}: {
  userId: string;
  leaderId?: string;
  teamId?: string;
}) => {
  const { user: currentUser } = useSessionStore();
  const { data, isLoading } = useGetUserByIdSync(userId);

  if (isLoading || !data?.user) {
    return (
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>
    );
  }

  const user = data.user;
  const isLeader = currentUser?.id === leaderId;
  const isSelf = currentUser?.id === user.id;

  return (
    <div className="flex items-center justify-between p-4 border rounded-md">
      <Link href={`/user/${user.id}`} className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{user.name?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">
            {isSelf ? "You" : user.name}
            {leaderId === user.id && (
              <span className="text-green-500"> (Leader)</span>
            )}
          </p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </Link>
      {!isSelf && teamId && isLeader && (
        <KickMemberDialog
          teamId={teamId}
          memberId={userId}
          memberName={user.name}
          trigger={
            <Button variant="destructive" size="sm">
              Kick
            </Button>
          }
        />
      )}
    </div>
  );
};
