import * as cors from 'cors';
import { Handler, Context } from "aws-lambda";
import { Server } from "http";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import { ExpressAdapter } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { INestApplication } from "@nestjs/common";
import { error } from "console";
import { NestExpressApplication } from '@nestjs/platform-express';

const express = require('express');

const binaryMimeTypes: string[] = [];

let cachedServer: Server;

process.on('unhandledRejection', (reason) => {
    throw error(reason);
});
process.on('uncaughtException', (reason) => {
    throw error(reason);
})

/**
 * Enable Swagger
 * 
 * @param {INestApplication} app
 */
function setupSwagger(app: INestApplication, isServerless: boolean = false) {

    const serverUrl = isServerless ? '/dev' : '/';

    const config = new DocumentBuilder()
    .setTitle('Employees Management APIs')
    .setDescription('Employees API description')
    .setVersion('1.0')
    .addServer(serverUrl)
    .addBearerAuth()
    .addOAuth2()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('swagger', app, document);
}

async function boostrapServer(): Promise<Server> {  
    if(!cachedServer) {
        try {
            const expressApp = express();

            // Serve static files from the 'public' directory (you can change this path as needed)
            // expressApp.use(express.static(join(__dirname, 'tmp/public')));

            const nestApp = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(expressApp));

            nestApp.use(cors());
            nestApp.use(eventContext());

            //Enable Swagger
            setupSwagger(nestApp, true);
            await nestApp.init();
            cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
        } catch (error) {
            return Promise.reject(error);
        }
    }
    return cachedServer;
}

export const handler: Handler = async (event: any, context: Context) => {
    if(event.path === '/swagger') {
        event.path = '/swagger/';
    }
    event.path = event.path.includes('swagger-ui') ? `/swagger${event.path}` : event.path;

    cachedServer = await boostrapServer();
    return proxy(cachedServer, event, context, 'PROMISE').promise;
}