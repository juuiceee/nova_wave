import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesModule } from 'src/files/files.module';
import { User } from 'src/users/users.model';
import { UsersModule } from 'src/users/users.module';
import { PostsController } from './posts.controller';
import { Post } from './posts.model';
import { PostsService } from './posts.service';

@Module({
  providers: [PostsService],
  controllers: [PostsController],
  imports: [
    SequelizeModule.forFeature([User, Post]),
    FilesModule,
    forwardRef(() => UsersModule),
  ],
  exports: [
    PostsService
  ]
})
export class PostsModule { }
