import { Connection } from 'typeorm';
import { databaseProviderName, jokesRepositoryName } from '../constants';
import { Joke } from './joke.entity';

export const jokesProvider = {
    provide: jokesRepositoryName,
    useFactory: (connection: Connection) => connection.getRepository(Joke),
    inject: [databaseProviderName]
};
