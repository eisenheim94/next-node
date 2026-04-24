import { UserRole } from '../../core/types';
import { AuthTokens } from './auth-tokens.interface';

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    displayName: string;
    role: UserRole;
  };
  tokens: AuthTokens;
}
