import { Testimonial } from '../types';

export const testimonials: Testimonial[] = [
  {
    id: 't_1',
    name: 'Sarah Jenkins',
    course: 'Mathematics',
    initials: 'SJ',
    avatarColor: 'bg-indigo-100 text-indigo-700',
    quote: 'My calculator died right before finals. Someone lent me their Casio within 30 minutes of me posting a request. Life saver!',
    hasTrustBadge: true,
  },
  {
    id: 't_2',
    name: 'Tom Roberts',
    course: 'Chemistry',
    initials: 'TR',
    avatarColor: 'bg-teal-100 text-teal-700',
    quote: 'I only needed a lab coat for one semester. Borrowing it instead of buying saved me ₹500 and it felt great not wasting money on something I’d never wear again.',
    hasTrustBadge: true,
  },
  {
    id: 't_3',
    name: 'Emily Chen',
    course: 'Sports Science',
    initials: 'EC',
    avatarColor: 'bg-amber-100 text-amber-700',
    quote: 'I have a tennis racket I barely use, so I put it on BorrowBuddy. It\'s been borrowed five times this term, and it always comes back perfect.',
    hasTrustBadge: true,
  }
];
