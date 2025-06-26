import { Separator } from "../ui/separator";
import { Activity } from "./activity";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useGetUserByIdSync } from "@/sync/user";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useGetUserTeamByCohortSync } from "@/sync/teams";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const Profile = ({ spaceId }: { spaceId: string }) => {
  const params = useParams();
  const userId = params.id as string;
  const { data } = useGetUserByIdSync(userId);
  const user = data?.user;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="sm:text-right">
          <p className="text-sm text-muted-foreground">Team</p>
          <Suspense fallback={null}>
            <ErrorBoundary fallback={null}>
              <UserTeam spaceId={spaceId} userId={userId} />
            </ErrorBoundary>
          </Suspense>
        </div>
      </div>
      <Separator />
      <Activity />
    </div>
  );
};

const UserTeam = ({
  spaceId,
  userId,
}: {
  spaceId: string;
  userId?: string;
}) => {
  const { data: userTeam } = useGetUserTeamByCohortSync(spaceId, userId);

  const isLeader = userTeam.teamDetails.leaderId === userId;

  return (
    <Link href={`/teams/${userTeam.teamDetails.teamId}`}>
      <p className="text-base font-medium leading-tight hover:underline">
        {userTeam.teamDetails.name}
        <span className="text-muted-foreground">
          · {isLeader ? "Leader" : "Member"}
        </span>
      </p>
    </Link>
  );
};
