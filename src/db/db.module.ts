import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORM_CONFIGS } from 'src/app/shared/configs';

const DB_IMPORTS = [TypeOrmModule.forRootAsync(ORM_CONFIGS)];

@Module({
  imports: DB_IMPORTS
})
export class DbModule {}
