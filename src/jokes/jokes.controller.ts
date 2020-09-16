import { Controller, Get, Res, Query, HttpStatus, Param, Post } from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiTags,
    ApiParam,
    ApiExcludeEndpoint
} from '@nestjs/swagger';
import { Response } from 'express';
import { Joke } from './joke.entity';
import { JokesService } from './jokes.service';

const jokeToDto = (joke: Joke) => ({
    id: joke.id,
    text: joke.text.split('||')
});

@ApiTags('Jokes')
@Controller('jokes')
export class JokesController {
    constructor(private readonly jokesService: JokesService) {}

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
        return Promise.all([
            this.jokesService.getOldestJoke(),
            this.jokesService.getNewestJoke()
        ]).then(([oldestJoke, newestJoke]) => {
            return {
                oldest: oldestJoke!.id,
                newest: newestJoke!.id
            };
        });
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
            const text = query.text;
            const offset = parseInt(query.offset, 10) || 0;
            this.jokesService.getMatchingJoke(text, offset).then((matchingJoke) => {
                if (matchingJoke) {
                    res.status(HttpStatus.OK).json(jokeToDto(matchingJoke));
                } else if (offset) {
                    res.status(HttpStatus.NOT_FOUND).json({
                        message: `No hay más bromas con "${text}"`
                    });
                } else {
                    res.status(HttpStatus.NOT_FOUND).json({
                        message: `No hay bromas con "${text}"`
                    });
                }
            });
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
            this.jokesService.getJokeById(jokeId).then((joke) => {
                if (joke) {
                    res.status(HttpStatus.OK).json(jokeToDto(joke));
                } else {
                    res.status(HttpStatus.NOT_FOUND).json({ message: 'Esta broma no existe' });
                }
            });
        }
    }

    @ApiExcludeEndpoint()
    @Post('seed')
    seedDatabase() {
        return this.jokesService
            .seedDatabase()
            .then((insertedJokes) => `${insertedJokes.length} new jokes created!`);
    }
}
