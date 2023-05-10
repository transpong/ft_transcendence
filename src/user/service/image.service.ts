import { Injectable, Param, Res } from '@nestjs/common';
import { createWriteStream } from 'fs';
import fetch from 'node-fetch';
import * as path from 'path';
import { Response } from 'express';

@Injectable()
export class ImageService {
  async downloadImageFromUrl(url: string): Promise<string> {
    const imageName: string = this.generateImageName(url);
    const imagePath: string = path.join('./upload', imageName);

    const response = await fetch(url);
    const readStream = response.body;

    const writeStream = createWriteStream(imagePath);

    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
      readStream.pipe(writeStream);
    });

    return imageName;
  }

  getImage(name: string, res: Response): void {
    const imagePath: string = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'upload',
      name,
    );
    res.sendFile(imagePath, {}, (err: Error): void => {
      if (err) {
        console.error(`Erro ao enviar arquivo: ${err.message}`);
        res.sendFile('default.jpeg', { root: 'upload' });
      }
    });
  }

  private generateImageName(url: string): string {
    console.log('url ' + url); // TODO: remove this debug log
    const timestamp: number = new Date().getTime();
    const extension: string = path.extname(url);

    return `${timestamp}${extension}`;
  }
}
