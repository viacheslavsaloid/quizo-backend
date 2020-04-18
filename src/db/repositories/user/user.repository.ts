import { Repository, EntityRepository } from 'typeorm';
import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { getHashedPassword, getSalt } from 'src/shared';
import { User } from 'src/db/entities';
import { UserDto } from 'src/db/dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  logger = new Logger('Company Repository');

  async signUp(dto: UserDto): Promise<User> {
    try {
      const { name, password, role } = dto;

      const user = new User();
      user.name = name;
      user.role = role;
      user.salt = await getSalt();
      user.password = await getHashedPassword(password, user.salt);

      await user.save();
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException({
          code: 1000
        });
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(dto: UserDto): Promise<User> {
    try {
      const { name, password } = dto;

      const company = await this.findOne({ name });

      if (!company) {
        throw new Error('1001');
      } else if (!(await company.validatePassword(password))) {
        throw new Error('1002');
      }
      return company;
    } catch (error) {
      switch (error.message) {
        case '1001':
        case '1002':
          throw new ConflictException({
            code: error.message
          });
      }
      throw new InternalServerErrorException();
    }
  }
}
