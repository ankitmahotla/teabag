import { Separator } from "../ui/separator";
import { Activity } from "./activity";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useGetUserByIdSync } from "@/sync/user";
import { useParams } from "next/navigation";
import Link from "next/link";

export const Profile = () => {
  const params = useParams();
  const userId = params.id as string;
  console.log(userId);
  const { data } = useGetUserByIdSync(userId);
  const user = data?.user;
  console.log(user);
  const isTeamLeader = userId === user?.teamLeaderId;

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
          <Link href={`/teams/${user.teamId}`}>
            <p className="text-base font-medium leading-tight hover:underline">
              {user.teamName}
              <span className="text-muted-foreground">
                {" "}
                · {isTeamLeader ? "Leader" : "Member"}
              </span>
            </p>
          </Link>
        </div>
      </div>
      <Separator />
      <Activity />
    </div>
  );
};
