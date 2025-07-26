export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  description: string;
  coverUrl: string;
  rating: number;
  totalRatings: number;
  publishedYear: number;
  pages: number;
  isAvailable: boolean;
  dueDate?: string;
  isFavorite?: boolean;
  readingProgress?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  booksRead: number;
  booksCheckedOut: number;
  favoriteGenre: string;
  joinDate: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  icon: string;
  color: string;
}