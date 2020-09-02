import { Injectable, Inject } from '@nestjs/common';
import { Db } from 'mongodb';
import { databaseProviderName } from '../database/database.provider';
import { Joke } from './joke';

@Injectable()
export class JokesService {
    constructor(@Inject(databaseProviderName) private readonly db: Db) {}

    getJokeById = (id: number) => this.db.collection<Joke>('jokes').findOne({ id });

    getMatchingJoke = (text: string, offset: number) =>
        this.db.collection<Joke>('jokes').findOne<Joke>(
            {
                text: {
                    $elemMatch: { $regex: `.*${text}.*`, $options: 'i' }
                }
            },
            { sort: { id: 1 }, skip: offset }
        );

    getNewestJoke = () => this.db.collection<Joke>('jokes').findOne<Joke>({}, { sort: { id: -1 } });

    getOldestJoke = () => this.db.collection<Joke>('jokes').findOne<Joke>({}, { sort: { id: 1 } });
}
