export type Session = {
  id: string;
  userId: string;
  userAgent: string;
  ipAddress: string;
  createdAt: string;
  lastActiveAt: string;
  isCurrent: boolean;
  revoked: boolean;
};
