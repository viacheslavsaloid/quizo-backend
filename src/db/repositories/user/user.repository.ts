import { Repository, EntityRepository } from 'typeorm';
import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { UserDto } from 'src/app/shared/dto';
import { getHashedPassword, getSalt, comparePasswords } from 'src/app/shared/helpers';
import { User } from 'src/db/entities/user';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  logger = new Logger('User Repository');

  async signUp(dto: UserDto): Promise<User> {
    try {
      const user = new User();

      user.salt = await getSalt();

      for (const key in dto) {
        if (dto.hasOwnProperty(key)) {
          user[key] = key === 'password' ? await getHashedPassword(dto[key], user.salt) : dto[key];
        }
      }

      await user.save();

      return user;
    } catch (error) {
      const returnError = error.code === '23505' ? { code: '1000' } : error;
      throw new ConflictException(returnError);
    }
  }

  async signIn(dto: UserDto): Promise<User> {
    try {
      const { name, password } = dto;

      const user = await this.findOne({ name });

      if (!user) {
        throw new Error('1001');
      } else if (!(await comparePasswords(password, user.salt, user.password))) {
        throw new Error('1002');
      }
      return user;
    } catch (error) {
      throw new ConflictException({
        code: error.message
      });
    }
  }
}
