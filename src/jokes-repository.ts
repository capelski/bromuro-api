import source from './jokes.json';

// TODO Implement database repository

interface Joke {
    id: number;
    text: string[];
}

const jokes: Joke[] = source.map((text, index) => ({
    id: index + 1,
    text
}));

export const getJokeByIndex = (index: number) => jokes[index - 1];

export const getMatchingJoke = (text: string, offset: number) => {
    const parsedText = parseSearchText(text);
    return jokes.filter((joke) =>
        joke.text.find((paragraph) => parseSearchText(paragraph).indexOf(parsedText) > -1)
    )[offset];
};

export const getNewestJoke = () => jokes[jokes.length - 1];

export const getOldestJoke = () => jokes[0];

const parseSearchText = (text: string) =>
    text
        .toLowerCase()
        .replace(/á/g, 'a')
        .replace(/é/g, 'e')
        .replace(/í/g, 'i')
        .replace(/ó/g, 'o')
        .replace(/ú/g, 'u');
