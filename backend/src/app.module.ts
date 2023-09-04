import { CloudinaryConfigService } from './config/cloudinary.config';
// import { OrmConfig } from './config/orm.config copy';
import { FakeModule } from './modules/fake/fake.module';
import { Module } from '@nestjs/common';
// config imports
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, type TypeOrmModuleAsyncOptions, type TypeOrmModuleOptions } from '@nestjs/typeorm';

// config imports files
import * as ORMConfig from './config/orm.config';
import serverConfig from './config/server.config';
import swaggerConfig from './config/swagger.config';
import mailConfig from './config/mailConfig';

// Module imports
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import jwtConfig from '@config/jwtConfig';
import { NotesModule } from './modules/notes/notes.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { ChatModule } from './modules/chat/chat.module';
import { AnnouncementsModule } from './modules/announcement/announcement.module';
import { CoinsModule } from './modules/coins/coins.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { async } from 'rxjs';
export const typeOrmConfig: TypeOrmModuleOptions = ORMConfig as any;
export const TypeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return ORMConfig as any;
  },
};
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [serverConfig, jwtConfig, mailConfig, swaggerConfig],
    }),

    TypeOrmModule.forRootAsync(TypeOrmAsyncConfig),

    AuthModule,
    UserModule,
    ChatModule,
    NotesModule,
    AnnouncementsModule,
    SubscriptionsModule,
    FakeModule,
    CoinsModule,
    PaymentsModule,
    GalleryModule,
  ],
  controllers: [],
  providers: [CloudinaryConfigService],
  exports: [CloudinaryConfigService],
})
export class AppModule {}
