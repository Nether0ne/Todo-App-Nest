import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@users/users.service';
import { UserEntity } from '@users/entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { toUserDto } from '@/shared/mapper';

const user = new UserEntity('', 'oneUser', 'one@email.com');
const registeredUser = new UserEntity(
  'uuid1',
  'username',
  'email@test.com',
  'password',
);

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a user', () => {
      expect(service.create(user)).resolves.toEqual(toUserDto(user));
    });
  });

  describe('findByLogin', () => {
    it('should find the user by email and password', () => {
      expect(
        service.findByLogin({
          email: registeredUser.email,
          password: 'password',
        }),
      ).resolves.toEqual(toUserDto(registeredUser));
    });
  });

  describe('findByPayload', () => {
    it('should find the user by username', () => {
      expect(
        service.findByPayload({ username: registeredUser.username }),
      ).resolves.toEqual(registeredUser);
    });
  });
});
