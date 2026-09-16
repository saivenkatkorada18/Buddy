export type Category =
  | 'calculators'
  | 'lab-coats'
  | 'books'
  | 'chargers'
  | 'umbrellas'
  | 'sports'
  | 'tools'
  | 'kitchen'
  | 'stationery'
  | 'decor';

export type Campus =
  | 'Main Library'
  | 'Science Building'
  | 'Student Residence Hall'
  | 'Campus Sports Centre'
  | 'Engineering Block'
  | 'Student Union';

export type Condition = 'New' | 'Like new' | 'Good' | 'Fair';

export interface Lender {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  course: string;
  verifiedEmail: boolean;
  profileVerified: boolean;
  trustScore: number; // 0–100
  onTimeReturns: [number, number]; // [on-time, total]
  avgConditionRating: number; // 0–5
  completedBorrows: number;
  completedLends: number;
  memberSince: string;
}

export interface Item {
  id: string;
  name: string;
  category: Category;
  condition: Condition;
  description: string;
  rules: string[];
  campus: Campus;
  distanceKm: number;
  maxDurationDays: number;
  suggestedDurationDays: number;
  depositEuros: number; // 0 === free
  available: boolean;
  availableFrom: string;
  pickupMethod: string;
  rating: number;
  borrowCount: number;
  lenderId: string;
  addedAt: string;
  imageSeed: string; // drives generated artwork
}

export interface User extends Lender {}

export interface BorrowRequest {
  id: string;
  itemId: string;
  itemName?: string;
  lenderId: string;
  borrowerId?: string;
  borrowerName?: string;
  borrowerTrustScore?: number;
  requestDate: string;
  startDate: string;
  endDate: string;
  message: string;
  status: 'pending' | 'approved' | 'active' | 'returned' | 'rejected' | 'overdue';
}

export interface ActivityItem {
  id: string;
  type: 'borrow' | 'lend' | 'request' | 'review' | 'system';
  title?: string;
  description: string;
  date?: string;
  timestamp?: string;
  isRead?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  course: string;
  initials: string;
  avatarColor: string;
  quote: string;
  hasTrustBadge: boolean;
}

export interface FilterState {
  searchQuery: string;
  category: Category | 'all' | null;
  campus: Campus | 'all' | null;
  availableOnly: boolean;
  maxDuration: number;
  freeOnly: boolean;
  minTrustScore: number;
}

export type SortOption = 'nearest' | 'recent' | 'rating' | 'popularity' | 'highest-rated' | 'popular';

export type View =
  | 'landing'
  | 'explore'
  | 'item-detail'
  | 'item'
  | 'how-it-works'
  | 'trust-safety'
  | 'dashboard'
  | 'not-found';
