import { UserRole } from '@prisma/client';

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
  };
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
