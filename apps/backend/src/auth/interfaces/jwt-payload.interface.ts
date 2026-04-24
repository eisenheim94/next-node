import { UserRole } from '../../core/types';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
