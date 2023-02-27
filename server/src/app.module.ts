import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { PostsModule } from './posts/posts.module';
import { RolesModule } from './roles/roles.module';
import { User } from './users/users.model';
import { UsersModule } from './users/users.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRESS_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRESS_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User],
      autoLoadModels: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'localstorage')
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    PostsModule,
    FilesModule,
  ],
})

export class AppModule { }
