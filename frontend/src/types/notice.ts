export type Notice = {
  createdAt: string;
  id: string;
  message: string;
  postedBy: string;
  teamId: string;
};

export type PaginatedNoticesResponse = {
  data: Notice[];
  nextCursor: string | null;
};
