import { Controller, Get, Inject } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Db } from 'mongodb';
import { databaseProviderName } from './database.provider';

@Controller('database')
export class DatabaseController {
    constructor(@Inject(databaseProviderName) private readonly db: Db) {}

    @ApiExcludeEndpoint()
    @Get('seed')
    getLimits() {
        // TODO Implement seed method
        return this.db.collection('jokes').insertMany([{ id: 35, text: ['Whats', 'up'] }]);
    }
}
