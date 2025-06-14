export type JoinRequest = {
  id: string;
  userId: string;
  name: string;
  teamId: string;
  status: string;
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type LeadershipTransferRequest = {
  id: string;
  teamId: string;
  fromUserId: string;
  toUserId: string;
  status: string;
  reason: string;
  createdAt: string;
  respondedAt: string;
  fromUserName: string;
  toUserName: string;
};
