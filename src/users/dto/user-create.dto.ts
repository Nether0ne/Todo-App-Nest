import { IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(8, 32, {
    message: 'Username must contain at least 8 characters but no more than 32',
  })
  username: string;

  @IsNotEmpty()
  @Length(5, 64, {
    message: 'Email must contain at least 5 characters but no more than 64',
  })
  email: string;

  @IsNotEmpty()
  @Length(6, 32, {
    message: 'Password must contain at least 5 characters but no more than 32',
  })
  password: string;
}
