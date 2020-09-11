import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

const PORT = process.env.PORT || 3000;

NestFactory.create(AppModule)
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
