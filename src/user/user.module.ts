import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserService } from './service/user.service';
import { AvatarModule } from '../avatar/avatar.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), AvatarModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
