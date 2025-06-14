export type TEAM_CREATE = {
  name: string;
  description?: string;
  cohortId: string;
};

export type TEAM = {
  id: string;
  name: string;
  description?: string;
  cohortId: string;
  leaderId: string;
  isPublished: boolean;
  createdAt: Date;
  disbandedAt: Date | null;
  memberCount: number;
};

export type Member = {
  membershipId: string;
  name: string;
  userId: string;
};
