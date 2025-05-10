export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  roles: string[];
}

export type UserWithoutPassword = Omit<User, 'password'>;