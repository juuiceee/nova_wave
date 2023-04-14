import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommentsModule } from 'src/comments/comments.module';
import { FilesModule } from 'src/files/files.module';
import { PostsModule } from 'src/posts/posts.module';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User]),
    FilesModule,
    forwardRef(() => PostsModule),
    forwardRef(() => CommentsModule)
  ],
  exports: [
    UsersService,
  ]
})
export class UsersModule { }
