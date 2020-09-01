import { Controller, Inject, Post } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Db } from 'mongodb';
import jokes from '../jokes.json';
import { Joke } from '../jokes/joke';
import { databaseProviderName } from './database.provider';

@Controller('database')
export class DatabaseController {
    constructor(@Inject(databaseProviderName) private readonly db: Db) {}

    @ApiExcludeEndpoint()
    @Post('seed')
    getLimits() {
        return this.db
            .collection('jokes')
            .find()
            .map((joke: Joke) => joke.id)
            .toArray()
            .then((jokesId: number[]) => {
                const nonExistingJokes = jokes
                    .map<Joke>((jokeText, jokeIndex) => ({
                        id: jokeIndex + 1,
                        text: jokeText
                    }))
                    .filter((joke) => jokesId.indexOf(joke.id) === -1);

                return nonExistingJokes.length
                    ? this.db
                          .collection('jokes')
                          .insertMany(nonExistingJokes)
                          .then((result) => result.insertedCount)
                    : 0;
            })
            .then((insertedCount) => `${insertedCount} new jokes created!`);
    }
}
