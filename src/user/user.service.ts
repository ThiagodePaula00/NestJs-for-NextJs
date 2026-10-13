import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto.js';
import { HashingService } from '../common/hashing/hashing.service.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async create(dto: CreateUserDto) {
    const exists = await this.userRepository.exists({
      where: { email: dto.email },
    });

    if (exists) {
      throw new ConflictException('E-mail já existe');
    }

    const password = await this.hashingService.hash(dto.password);
    const user = await this.userRepository.save(
      this.userRepository.create({
        name: dto.name,
        email: dto.email,
        password,
      }),
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      forceLogout: user.forceLogout,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  save(user: User) {
    return this.userRepository.save(user);
  }
}