export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  isActive: boolean;
  createdAt: number;
  lastLoginAt: number | null;
  loginCount: number;
}

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalLessons: number;
  totalQuizzes: number;
  averageScore: number;
  uptime: number;
}

export interface UserFilters {
  role?: 'student' | 'teacher' | 'admin';
  isActive?: boolean;
  search?: string;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
