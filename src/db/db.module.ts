import { Module } from '@nestjs/common';
import { ORM_CONFIGS } from './configs';
import { TypeOrmModule } from '@nestjs/typeorm';

const DB_IMPORTS = [TypeOrmModule.forRootAsync(ORM_CONFIGS)];

@Module({
  imports: DB_IMPORTS
})
export class DbModule {}
