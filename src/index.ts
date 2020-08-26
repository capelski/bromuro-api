import express from 'express';
import { getNewestJoke, getOldestJoke, getJokeByIndex, getMatchingJoke } from './jokes-repository';

const PORT = process.env.PORT || 3000;
const newestJoke = getNewestJoke();
const oldestJoke = getOldestJoke();

const app = express();

app.get('/limits', (_req, res) => {
    res.status(200).json({
        oldest: oldestJoke.id,
        newest: newestJoke.id
    });
});

app.get('/jokes/newest', (_req, res) => {
    res.status(200).json(newestJoke);
});

app.get('/jokes/oldest', (_req, res) => {
    res.status(200).json(oldestJoke);
});

app.get('/jokes/match', (req, res) => {
    if (!req.query.text) {
        res.status(400).json({ message: 'Text query string parameter must be provided' });
    } else {
        const text = String(req.query.text);
        const offset = parseInt(String(req.query.offset), 10) || 0;
        const matchingJoke = getMatchingJoke(text, offset);

        if (matchingJoke) {
            res.status(200).json(matchingJoke);
        } else {
            res.status(404).json({ message: 'There is no such joke' });
        }
    }
});

app.get('/jokes/:id', (req, res) => {
    const { id } = req.params;
    const jokeId = parseInt(id, 10);

    if (!jokeId) {
        res.status(400).json({ message: 'You need to provide a numeric id' });
    } else {
        const joke = getJokeByIndex(jokeId);

        if (joke) {
            res.status(200).json(joke);
        } else {
            res.status(404).json({ message: 'There is no such joke' });
        }
    }
});

app.get(/^\/$/, (_req, res) => {
    res.status(200).send('<h1>Bromuro Api is running here ⚙️</h1>');
});

app.listen(PORT, () => {
    console.log(`Express app running in port ${PORT}`);
});
