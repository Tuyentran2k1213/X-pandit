import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cors from 'cors';

async function bootstrap() {
  const port: number = parseInt(`${process.env.PORT}`) || 3000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Employees Management APIs')
    .setDescription('Employees API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addOAuth2()
    .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
    app.use(cors());
    await app.listen(port);
}
bootstrap();
