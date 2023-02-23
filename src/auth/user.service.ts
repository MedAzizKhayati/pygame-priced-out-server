import { Injectable } from '@nestjs/common/decorators';
import { FindAllOptions, GenericsService } from '@/generics/service';
import { CreateAuthDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class UserService extends GenericsService<User, CreateAuthDto, UpdateUserDto> {
  constructor(@InjectRepository(User) userRepository: Repository<User>, private readonly authService: AuthService) {
    super(userRepository);
  }

  create(createDto: CreateAuthDto): Promise<User> {
    return this.authService.create(createDto);
  }

  async findAll(options?: FindAllOptions): Promise<User[]> {
    const users = await super.findAll(options);
    return users.map((user) => this.authService.userWithoutPassword(user));
  }

  async buyStorage(user: User, { storage }: UpdateUserDto): Promise<UpdateResult> {
    const credits = user.credit - storage * 10;
    if (credits < 0) {
      throw new UnauthorizedException('Not enough credits');
    }
    return await this.update(user.id, {
      credit: credits,
      storage: user.storage + storage,
    } as UpdateUserDto);
  }
}
