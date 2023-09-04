import { ConfigEnum, type IServerConfig, type ISwaggerConfig } from '@lib/types';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { UserService } from './modules/user/user.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const logger = new Logger('Bootstrap');
  const userService = app.get<UserService>(UserService);
  await userService.createAdmin();
  // await userService.createAdminFake();
  await userService.mockData();
  // await userService.demoUsers();

  const configService = app.get<ConfigService>(ConfigService);

  const { port: SERVER_PORT } = configService.get<IServerConfig>(ConfigEnum.SERVER);

  const swaggerConfig = configService.get<ISwaggerConfig>(ConfigEnum.SWAGGER);
  // swagger configuration
  const swaggerConfigDoc = new DocumentBuilder()

    .setTitle(swaggerConfig.title)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfigDoc);
  SwaggerModule.setup('api', app, swaggerDocument);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(SERVER_PORT);
  logger.log(`Server is running on: ${await app.getUrl()}`);
}
bootstrap();
