export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  total_books: string;
  shelf_id: number;
}

export interface Shelves {
  category: string;
  total_books: number;
  shelf_id: number;
}
