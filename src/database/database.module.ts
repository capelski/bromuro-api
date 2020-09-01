import { Module } from '@nestjs/common';
import { DatabaseController } from './database.controller';
import { databaseProvider } from './database.provider';

@Module({
    providers: [databaseProvider],
    controllers: [DatabaseController],
    exports: [databaseProvider]
})
export class DatabaseModule {}
