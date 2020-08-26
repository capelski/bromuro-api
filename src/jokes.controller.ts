import { Response } from 'express';
import { Controller, Get, HttpCode, Res, Query, HttpStatus, Param } from '@nestjs/common';
import { JokesService, Joke } from './jokes.service';

@Controller('jokes')
export class JokesController {
    // TODO Get from the jokesService
    private readonly newestJoke: Joke;
    private readonly oldestJoke: Joke;

    constructor(private readonly jokesService: JokesService) {
        this.newestJoke = jokesService.getNewestJoke();
        this.oldestJoke = jokesService.getOldestJoke();
    }

    @Get('limits')
    @HttpCode(HttpStatus.OK)
    getLimits() {
        return {
            oldest: this.oldestJoke.id,
            newest: this.newestJoke.id
        };
    }

    @Get('newest')
    @HttpCode(HttpStatus.OK)
    getNewestJoke() {
        return this.newestJoke;
    }

    @Get('oldest')
    @HttpCode(HttpStatus.OK)
    getOldestJoke() {
        return this.oldestJoke;
    }

    @Get('match')
    getMatchingJoke(@Query() query: { [key: string]: string }, @Res() res: Response) {
        if (!query.text) {
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Text query string parameter must be provided'
            });
        } else {
            const text = String(query.text);
            const offset = parseInt(String(query.offset), 10) || 0;
            const matchingJoke = this.jokesService.getMatchingJoke(text, offset);

            if (matchingJoke) {
                res.status(HttpStatus.OK).json(matchingJoke);
            } else {
                res.status(HttpStatus.NOT_FOUND).json({ message: 'There is no such joke' });
            }
        }
    }

    @Get(':id')
    getJokeById(@Param() params: { [key: string]: string }, @Res() res: Response) {
        const { id } = params;
        const jokeId = parseInt(id, 10);

        if (!jokeId) {
            res.status(HttpStatus.BAD_REQUEST).json({
                message: 'You need to provide a numeric id'
            });
        } else {
            const joke = this.jokesService.getJokeByIndex(jokeId);

            if (joke) {
                res.status(HttpStatus.OK).json(joke);
            } else {
                res.status(HttpStatus.NOT_FOUND).json({ message: 'There is no such joke' });
            }
        }
    }
}
