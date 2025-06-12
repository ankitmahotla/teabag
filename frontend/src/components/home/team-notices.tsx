import { CreateNoticeForm } from "./create-notice";
import { TeamNoticesList } from "./notice-board";

const TeamNotices = ({
  teamId,
  userId,
}: {
  teamId: string;
  userId: string;
}) => {
  return (
    <div className="space-y-6">
      <CreateNoticeForm teamId={teamId} postedBy={userId} />
      <TeamNoticesList teamId={teamId} currentUserId={userId} />
    </div>
  );
};

export default TeamNotices;
