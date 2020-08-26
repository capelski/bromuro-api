import { Injectable } from '@nestjs/common';
import source from './jokes.json';

// TODO Implement database repository

export interface Joke {
    id: number;
    text: string[];
}

const jokes: Joke[] = source.map((text, index) => ({
    id: index + 1,
    text
}));

@Injectable()
export class JokesService {
    getJokeByIndex = (index: number) => jokes[index - 1];

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
