import { GenericsService } from '@/generics/service';
import { Injectable } from '@nestjs/common/decorators';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Payload } from './interfaces/payload';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService extends GenericsService<User, CreateAuthDto, UpdateUserDto> {
  constructor(
    @InjectRepository(User) userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
    super(userRepository);
  }

  async create(createDto: CreateAuthDto): Promise<User> {
    const isUsernameTaken = await this.repository.findOneBy({ username: createDto.username });
    if (isUsernameTaken) {
      throw new BadRequestException('Username already taken');
    }

    const isEmailTaken = await this.repository.findOneBy({ email: createDto.email });
    if (isEmailTaken) {
      throw new BadRequestException('Email already taken');
    }

    const user = this.repository.create(createDto);
    const userResponse = await this.repository.save(user);
    return this.userWithoutPassword(userResponse);
  }

  async login(username: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.repository.findOneBy({ username });
    if (user && (await bcrypt.compare(password, user.password)))
      return {
        user: this.userWithoutPassword(user),
        token: this.signPayload({ id: user.id, email: user.email }),
      };

    throw new UnauthorizedException('Invalid credentials');
  }

  userWithoutPassword(user: User): User {
    delete user.password;
    return user;
  }

  signPayload(payload: Payload) {
    return this.jwtService.sign(payload);
  }
}
