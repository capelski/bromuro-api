import { Response } from 'express';
import { Controller, Get, Res, Query, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiTags, ApiParam } from '@nestjs/swagger';
import { JokesService, Joke } from './jokes.service';

// TODO Localize error messages

@ApiTags('Jokes')
@Controller('jokes')
export class JokesController {
    private readonly newestJoke: Joke;
    private readonly oldestJoke: Joke;

    constructor(private readonly jokesService: JokesService) {
        this.newestJoke = jokesService.getNewestJoke();
        this.oldestJoke = jokesService.getOldestJoke();
    }

    @Get('limits')
    @ApiOperation({
        summary:
            'Returns the id of the oldest and newest joke (e.g. for random ids computation purposes)'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The ids of the oldest and the newest joke'
    })
    getLimits() {
        return {
            oldest: this.oldestJoke.id,
            newest: this.newestJoke.id
        };
    }

    @Get('newest')
    @ApiOperation({
        summary: 'Returns the latest joke added to the application'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The latest joke added to the application'
    })
    getNewestJoke() {
        return this.newestJoke;
    }

    @Get('oldest')
    @ApiOperation({
        summary: 'Returns the first joke that was ever added to the application'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The first joke that was ever added to the application'
    })
    getOldestJoke() {
        return this.oldestJoke;
    }

    @Get('match')
    @ApiQuery({
        name: 'text',
        type: 'string',
        description: 'The text to be contained in the joke',
        example: 'negro'
    })
    @ApiQuery({
        name: 'offset',
        type: 'numeric',
        description: 'The number of matching jokes to skip. 0 by default',
        required: false,
        example: 2
    })
    @ApiOperation({
        summary:
            'Returns a joke matching the provided text if any. The optional offset parameter can be used to skip jokes when more than one joke matches the provided text'
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Returned when no text query string parameter is provided'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'A joke matching the provided text'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description:
            'Returned when no joke matches the provided text or when the offset is greater or equal to the number of matching jokes'
    })
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
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'The id of the joke to be returned',
        example: '35'
    })
    @ApiOperation({
        summary: 'Returns the joke identified by id'
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Returned when a non-numeric id is provided'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The joke identified by id'
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Returned when there is no joke identified by the provided id'
    })
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
