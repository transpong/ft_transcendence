import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { UserService } from './service/user.service';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '../0-config/multer.config';
import { ImageService } from './service/image.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [UserController],
  providers: [UserService, ImageService],
  exports: [UserService],
})
export class UserModule {}
