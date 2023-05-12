import { Injectable, StreamableFile } from '@nestjs/common';
import { createReadStream, createWriteStream, existsSync } from 'fs';
import fetch from 'node-fetch';
import * as path from 'path';
import { join } from 'path';
import { UserService } from '../../user/service/user.service';
import { UserEntity } from '../../user/entity/user.entity';

@Injectable()
export class AvatarService {
  constructor(private readonly userService: UserService) {}

  async downloadImageFromUrl(url: string): Promise<string> {
    const imageName: string = this.generateImageName(url);
    const imagePath: string = path.join('upload', imageName);

    const response = await fetch(url);
    const readStream = response.body;

    const writeStream = createWriteStream(imagePath);

    await new Promise<void>((resolve, reject): void => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
      readStream.pipe(writeStream);
    });

    return imageName;
  }

  getImage(name: string): StreamableFile {
    const uploadDir = 'upload';
    const filePath: string = join(uploadDir, name);
    const defaultFilePath: string = join(uploadDir, 'default.jpeg');

    if (existsSync(filePath)) {
      const fileStream = createReadStream(filePath);

      return new StreamableFile(fileStream);
    } else {
      console.error(`Erro ao enviar arquivo: Arquivo ${name} não encontrado`); // TODO: remove this debug log
      const defaultFileStream = createReadStream(defaultFilePath);

      return new StreamableFile(defaultFileStream);
    }
  }

  async getImageFromUser(user: string): Promise<string> {
    const userEntity: UserEntity = await this.userService.getUserByFtId(user);

    return userEntity.avatar;
  }

  private generateImageName(url: string): string {
    const timestamp: number = new Date().getTime();
    const extension: string = path.extname(url);

    return `${timestamp}${extension}`;
  }
}
