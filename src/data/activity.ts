import { ActivityItem, BorrowRequest } from '../types';

export const recentActivity: ActivityItem[] = [
  {
    id: 'act_1',
    type: 'borrow',
    title: 'You borrowed a Lab Coat',
    description: 'You returned the Lab Coat to Elena Ruiz on time.',
    date: '2026-09-14T10:30:00Z',
    isRead: true,
  },
  {
    id: 'act_2',
    type: 'review',
    title: 'New Review',
    description: 'Elena Ruiz rated your condition care 5 stars.',
    date: '2026-09-14T11:00:00Z',
    isRead: true,
  },
  {
    id: 'act_3',
    type: 'lend',
    title: 'Your Yoga Mat was returned',
    description: 'Clara Gómez returned your Yoga Mat.',
    date: '2026-09-10T14:15:00Z',
    isRead: true,
  },
  {
    id: 'act_4',
    type: 'system',
    title: 'Trust Score Increased',
    description: 'Your trust score went up by 2 points to 88!',
    date: '2026-09-14T11:05:00Z',
    isRead: false,
  }
];

export const requests: BorrowRequest[] = [
  {
    id: 'req_1',
    itemId: 'i_1',
    lenderId: 'l_sofia',
    borrowerId: 'u_alex',
    requestDate: '2026-09-15T09:00:00Z',
    startDate: '2026-09-17T00:00:00Z',
    endDate: '2026-09-19T00:00:00Z',
    message: 'Hey Sofia, I have a physics exam on the 18th. Could I borrow your calculator?',
    status: 'pending',
  },
  {
    id: 'req_2',
    itemId: 'i_7',
    lenderId: 'u_alex',
    borrowerId: 'l_lucas',
    requestDate: '2026-09-15T14:20:00Z',
    startDate: '2026-09-16T00:00:00Z',
    endDate: '2026-09-18T00:00:00Z',
    message: 'Hey Alex, my bike pedal is loose. Could I borrow your tool kit for a couple days?',
    status: 'approved',
  }
];
