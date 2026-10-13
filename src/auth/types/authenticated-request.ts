import type { Request } from 'express';
import type { User } from '../../user/entities/user.entity.js';

export interface AuthenticatedRequest extends Request {
  user: User;
}
