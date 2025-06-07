import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSessionStore } from "@/store/session";
import { useGetUserByIdSync } from "@/sync/user";
import _ from "lodash";

type MemberProp = {
  members: {
    membershipId: string;
    userId: string;
  }[];
};

export const TeamMembers = ({ members }: MemberProp) => {
  console.log(members);
  return (
    <section>
      <h2 className="text-lg font-medium mb-3">Team Members</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {members.map(({ membershipId, userId }) => (
          <Member key={membershipId} userId={userId} />
        ))}
      </div>
    </section>
  );
};

const Member = ({ userId }: { userId: string }) => {
  const { user } = useSessionStore();
  const { data } = useGetUserByIdSync(userId);
  return (
    <div className="p-3 border rounded-md text-center text-sm">
      <Avatar className="mx-auto mb-2 h-10 w-10">
        <AvatarFallback>
          {" "}
          {user?.id === userId
            ? "You"
            : _.capitalize(data?.user.name?.slice(0, 1) ?? "T")}
        </AvatarFallback>
      </Avatar>
      <p> {user?.id === userId ? "You" : data?.user.name} </p>
    </div>
  );
};
