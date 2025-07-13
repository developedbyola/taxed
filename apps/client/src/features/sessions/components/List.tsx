import { trpc } from '@/libs/trpc';

export const List = () => {
  const list = trpc.sessions.list.useQuery();

  if (list.status === 'pending') return <div>Loading...</div>;

  if (list.status === 'error') return <div>Error</div>;

  return <div>List</div>;
};
