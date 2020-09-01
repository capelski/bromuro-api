import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { JokesModule } from './jokes/jokes.module';

const PORT = process.env.PORT || 3000;

NestFactory.create(JokesModule)
    .then((app) => {
        const options = new DocumentBuilder()
            .setTitle('Bromuro Api')
            .setDescription('Nestjs application providing jokes through a web Api')
            .setVersion('1.0')
            .build();
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup('', app, document);

        return app;
    })
    .then((app) => app.listen(PORT))
    .then(() => console.log(`Express app running in port ${PORT}`));
