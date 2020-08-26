import { NestFactory } from '@nestjs/core';
import { JokesModule } from './jokes.module';

const PORT = process.env.PORT || 3000;

NestFactory.create(JokesModule)
    .then((app) => app.listen(PORT))
    .then(() => console.log(`Express app running in port ${PORT}`));

// TODO Add swagger-ui
// app.get(/^\/$/, (_req, res) => {
//     res.status(200).send('<h1>Bromuro Api is running here ⚙️</h1>');
// });
