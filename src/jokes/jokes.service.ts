import { Injectable, Inject } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { jokesRepositoryName } from '../constants';
import { Joke } from './joke.entity';
import seedJokes from './jokes.json';

// TODO Testing
// https://stackoverflow.com/questions/55366037/inject-typeorm-repository-into-nestjs-service-for-mock-data-testing/55366343

@Injectable()
export class JokesService {
    constructor(
        @Inject(jokesRepositoryName)
        private jokeRepository: Repository<Joke>
    ) {}

    getJokeById(id: number) {
        return this.jokeRepository.findOne(id);
    }

    getMatchingJoke(text: string, offset: number) {
        return this.jokeRepository
            .find({
                where: { text: Like(`%${text}%`) },
                order: {
                    id: 'ASC'
                },
                skip: offset,
                take: 1
            })
            .then((jokes) => {
                console.log(jokes);
                return jokes[0];
            });
    }

    getNewestJoke() {
        return this.jokeRepository.findOne({
            order: {
                id: 'DESC'
            }
        });
    }

    getOldestJoke() {
        return this.jokeRepository.findOne({
            order: {
                id: 'ASC'
            }
        });
    }

    seedDatabase() {
        return this.jokeRepository.find({ select: ['id'] }).then((dbJokes) => {
            const dbJokesId = dbJokes.map((dbJoke) => dbJoke.id);
            const nonExistingJokes = seedJokes
                .map<Joke>((jokeText, jokeIndex) => ({
                    id: jokeIndex + 1,
                    text: jokeText.join('||')
                }))
                .filter((joke) => dbJokesId.indexOf(joke.id) === -1);
            return Promise.all(nonExistingJokes.map((joke) => this.jokeRepository.insert(joke)));
        });
    }
}
