import { IsNotEmpty, IsEmail, IsDate } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsDate()
  createdAt?: Date;

  @IsDate()
  updatedAt?: Date;
}
