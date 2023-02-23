import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsEmail()
  email: string;

  @MinLength(3)
  @MaxLength(30)
  username: string;

  @MinLength(8)
  @MaxLength(20)
  password: string;
}
