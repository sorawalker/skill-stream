export type UserRole = 'USER' | 'SUPPORT' | 'MANAGER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date | string;
  updatedAt: Date | string;
}
