import { useGetUserByIdSync } from "@/sync/user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export const TeamMember = ({ userId }: { userId: string }) => {
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

  return (
    <Link href={`/user/${user.id}`}>
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{user.name?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
    </Link>
  );
};
