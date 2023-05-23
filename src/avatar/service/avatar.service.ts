import { Injectable, StreamableFile } from '@nestjs/common';
import {
  createReadStream,
  createWriteStream,
  existsSync,
  unlinkSync,
} from 'fs';
import fetch from 'node-fetch';
import * as path from 'path';
import { join } from 'path';

@Injectable()
export class AvatarService {
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
      const defaultFileStream = createReadStream(defaultFilePath);

      return new StreamableFile(defaultFileStream);
    }
  }

  async upload(file: Express.Multer.File): Promise<string> {
    const imageName: string = this.generateImageName(file.originalname);
    const imagePath: string = path.join('upload', imageName);

    const writeStream = createWriteStream(imagePath);

    await new Promise<void>((resolve, reject): void => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
      writeStream.write(file.buffer);
      writeStream.end();
    });

    return imageName;
  }

  deleteImage(imageName: string): void {
    const imagePath: string = path.join('upload', imageName);
    const defaultImages: string[] = ['default.jpeg', 'guest.png'];

    if (existsSync(imagePath) && !defaultImages.includes(imageName)) {
      unlinkSync(imagePath);
    }
  }

  private generateImageName(url: string): string {
    const timestamp: number = new Date().getTime();
    const extension: string = path.extname(url);

    return `${timestamp}${extension}`;
  }
}
