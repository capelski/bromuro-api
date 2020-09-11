import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { JokesController } from './jokes.controller';
import { jokesProvider } from './jokes.provider';
import { JokesService } from './jokes.service';

@Module({
    imports: [DatabaseModule],
    controllers: [JokesController],
    providers: [jokesProvider, JokesService]
})
export class JokesModule {}
