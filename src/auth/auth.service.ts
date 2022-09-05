import { UserDto } from '@users/dto/user.dto';
import { UsersService } from '@/users/users.service';
import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegistrationStatus } from './interfaces/register-status.interface';
import { CreateUserDto } from '@/users/dto/user-create.dto';
import { LoginUserDto } from '@/users/dto/user.login.dto';
import { LoginStatus } from './interfaces/login-status.interface';
import { JwtPayload } from './interfaces/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'User successfully registered',
    };

    try {
      await this.usersService.create(registerUserDto);
    } catch (e: unknown) {
      if (e instanceof Error) {
        status.message = e.message;
        status = {
          success: false,
          message: e.message,
        };
      } else {
        status.message = 'Unknown error has occurred';
      }
    }

    return status;
  }

  async login(LoginUserDto: LoginUserDto): Promise<LoginStatus> {
    const user = await this.usersService.findByLogin(LoginUserDto);
    const authorization: Authorization = this._createToken(user);

    return { username: user.username, ...authorization };
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private _createToken({ username }: UserDto): Authorization {
    const expiresIn = process.env.EXPIRES_IN;
    const user: JwtPayload = { username };
    const accessToken = this.jwtService.sign(user);

    return { accessToken, expiresIn };
  }
}
