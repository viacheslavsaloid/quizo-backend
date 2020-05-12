import { Repository, EntityRepository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { User } from 'src/db/entities/user';
import { getSalt, getHashedPassword, comparePasswords } from 'src/app/utils/bcrypt/bcrypt.helper';
import { UserDto } from 'src/app/dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
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
      throw new ConflictException(error);
    }
  }

  async signIn(dto: UserDto): Promise<User> {
    try {
      const { name, password } = dto;

      const user = await this.findOne({ name });

      const errorCode = !user ? '1001' : !(await comparePasswords(password, user.salt, user.password)) && '1002';

      if (errorCode) {
        throw new Error(errorCode);
      }

      return user;
    } catch (error) {
      throw new ConflictException({
        code: error.message
      });
    }
  }
}
