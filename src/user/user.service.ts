import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { HashingService } from '../common/hashing/hashing.service.js';
import { UpdatePasswordDto } from './dto/update-password.dto.js';

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

  async findOneByOrFail(criteria: Partial<User>) {
    const user = await this.userRepository.findOneBy(criteria);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
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

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const user = await this.findOneByOrFail({ id });

    const isCurrentPasswordValid = await this.hashingService.compare(
      dto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Senha atual inválida');
    }

    user.password = await this.hashingService.hash(dto.newPassword);
    user.forceLogout = true;

    return this.save(user);
  }

  async remove(id: string) {
    const user = await this.findOneByOrFail({ id });
    await this.userRepository.delete({ id });
    return user;
  }

  save(user: User) {
    return this.userRepository.save(user);
  }
}
