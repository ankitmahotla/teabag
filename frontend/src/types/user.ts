export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedUsersResponse = {
  data: User[];
  nextCursor: string | null;
};

export type UserInteraction = {
  id: string;
  userId: string;
  type: string;
  note: string | null;
  createdAt: string;
};

export type PaginatedInteractionsResponse = {
  data: UserInteraction[];
  nextCursor: string | null;
};
