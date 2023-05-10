import { Module } from '@nestjs/common';
import { AvatarService } from './service/avatar.service';
import { AvatarController } from './controller/avatar.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './0-config/multer.config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    UserModule,
  ],

  controllers: [AvatarController],
  providers: [AvatarService],
  exports: [AvatarService],
})
export class AvatarModule {}
