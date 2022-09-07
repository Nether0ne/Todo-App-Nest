import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@auth/auth.service';
import { UsersService } from '@users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@users/entity/user.entity';
import { RegistrationStatus } from '@auth/interfaces/register-status.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';

const user = new UserEntity('', 'oneUser', 'one@email.com');
const registeredUser = new UserEntity(
  'uuid1',
  'username',
  'email@test.com',
  'password',
);
const registerResponse: RegistrationStatus = {
  success: true,
  message: 'User successfully registered',
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('SECRET_KEY') || 'test',
            signOptions: {
              expiresIn: configService.get<string>('EXPIRES_IN') || 86400000,
            },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [
        AuthService,
        JwtModule,
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([registeredUser]),
            findOne: jest.fn().mockResolvedValue(null),
            findOneBy: jest.fn().mockResolvedValue(registeredUser),
            create: jest.fn().mockReturnValue(user),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', () => {
      expect(service.register(user)).resolves.toEqual(registerResponse);
    });
  });

  describe('login', () => {
    it('should login the user and return access token with expire time', () => {
      expect(
        service.login({ email: registeredUser.email, password: 'password' }),
      ).resolves.toMatchObject({
        username: registeredUser.username,
      });
    });
  });

  describe('validateUser', () => {
    it('should validate user by JWT token and return username', async () => {
      const { accessToken } = await service.login({
        email: registeredUser.email,
        password: 'password',
      });

      expect(service.validateUser(accessToken)).resolves.toMatchObject(
        registeredUser,
      );
    });
  });
});
