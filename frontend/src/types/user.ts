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
