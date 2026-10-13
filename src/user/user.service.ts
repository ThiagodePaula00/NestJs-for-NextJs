import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
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

    return user;
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: string, dto: UpdateUserDto) {
    if (dto.name === undefined && dto.email === undefined) {
      throw new BadRequestException('Dados não enviados');
    }

    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (dto.name !== undefined) {
      user.name = dto.name;
    }

    if (dto.email !== undefined && dto.email !== user.email) {
      const emailExists = await this.userRepository.exists({
        where: { email: dto.email },
      });

      if (emailExists) {
        throw new ConflictException('E-mail já existe');
      }

      user.email = dto.email;
      user.forceLogout = true;
    }

    return this.save(user);
  }

  save(user: User) {
    return this.userRepository.save(user);
  }
}
