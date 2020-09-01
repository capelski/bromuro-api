import { Injectable, Inject } from '@nestjs/common';
import { Db } from 'mongodb';
import { databaseProviderName } from '../database/database.provider';
import source from '../jokes.json';
import { Joke } from './joke';

// TODO Finish database repository implementation

const jokes: Joke[] = source.map((text, index) => ({
    id: index + 1,
    text
}));

@Injectable()
export class JokesService {
    constructor(@Inject(databaseProviderName) private readonly db: Db) {}

    getJokeById = (id: number) => this.db.collection('jokes').findOne({ id });

    getMatchingJoke = (text: string, offset: number) => {
        const parsedText = this.parseSearchText(text);
        return jokes.filter((joke) =>
            joke.text.find((paragraph) => this.parseSearchText(paragraph).indexOf(parsedText) > -1)
        )[offset];
    };

    getNewestJoke = () => jokes[jokes.length - 1];

    getOldestJoke = () => jokes[0];

    private parseSearchText = (text: string) =>
        text
            .toLowerCase()
            .replace(/á/g, 'a')
            .replace(/é/g, 'e')
            .replace(/í/g, 'i')
            .replace(/ó/g, 'o')
            .replace(/ú/g, 'u');
}
