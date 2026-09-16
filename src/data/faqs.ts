import { FAQItem } from '../types';

export const faqs: FAQItem[] = [
  {
    id: 'faq_1',
    question: 'How does BorrowBuddy work?',
    answer: 'BorrowBuddy connects students who need items with those who have them to spare. You can browse listings, request an item, arrange a pickup on campus, and return it when you are done. Lenders can earn a higher Trust Score by sharing items in good condition.',
  },
  {
    id: 'faq_2',
    question: 'Is it really free?',
    answer: 'Yes! Most items on BorrowBuddy are completely free to borrow. Some high-value items might require a small deposit to ensure they are returned safely, which you get back when you return the item.',
  },
  {
    id: 'faq_3',
    question: 'How do I get my items back safely?',
    answer: 'BorrowBuddy relies on a transparent Trust Score system. You can review a borrower\'s score, verified student status, and past reviews before accepting their request. You also set your own borrowing rules and deposit amounts.',
  },
  {
    id: 'faq_4',
    question: 'What happens if an item is damaged or lost?',
    answer: 'If an item is damaged, the borrower is expected to cover the repair or replacement cost, or forfeit the deposit if one was set. Borrowers who fail to return items or return damaged items will have their Trust Score penalized and may be removed from the platform.',
  },
  {
    id: 'faq_5',
    question: 'How is the Trust Score calculated?',
    answer: 'The Trust Score is a transparent metric out of 100, based on on-time returns (40%), verified student status (25%), item condition feedback (20%), and completed transactions (15%).',
  },
  {
    id: 'faq_6',
    question: 'Do I need a university email to join?',
    answer: 'Anyone can browse items, but to borrow or list items you should ideally use your university email (.edu, .ac.uk, etc.) to become a "Verified Student", which significantly boosts your Trust Score and makes others more likely to lend to you.',
  }
];
