import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '@/users/dto/user-create.dto';
import { UserEntity } from '@users/entity/user.entity';
import { LoginUserDto } from '@users/dto/user.login.dto';
import { UserDto } from '@users/dto/user.dto';
import { comparePasswords } from '@shared/utils';
import { toUserDto } from '@shared/mapper';
import { JwtPayload } from '@auth/interfaces/payload.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(userDto: CreateUserDto) {
    const { username, email, password } = userDto;

    const existedUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existedUser) {
      throw new HttpException(
        'User with provided username or email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user: UserEntity = await this.userRepository.create({
      username,
      password,
      email,
    });

    await this.userRepository.save(user);

    return toUserDto(user);
  }

  async findByLogin({ email, password }: LoginUserDto): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new HttpException(
        'User with provided email is not found',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const equalPasswords = await comparePasswords(user.password, password);

    if (!equalPasswords) {
      throw new HttpException(
        'Provided credentials are not valid',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return toUserDto(user);
  }

  async findByPayload({ username }: JwtPayload): Promise<UserDto> {
    return this.userRepository.findOneBy({ username });
  }

  private _sanitizeUser(user: UserEntity) {
    delete user.password;
    return user;
  }
}
