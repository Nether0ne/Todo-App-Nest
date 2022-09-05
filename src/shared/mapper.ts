import { UserDto } from '@/users/dto/user.dto';
import { UserEntity } from '@users/entity/user.entity';

export const toUserDto = (data: UserEntity): UserDto => {
  const { id, username, email, createdAt, updatedAt } = data;

  const userDto = {
    id,
    username,
    email,
    createdAt,
    updatedAt,
  };

  return userDto;
};
