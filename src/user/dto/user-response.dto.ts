import type { User } from '../entities/user.entity.js';

export class UserResponseDto {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly forceLogout: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.forceLogout = user.forceLogout;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
