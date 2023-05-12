import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import * as path from 'path';

@Injectable()
export class AvatarPipe implements PipeTransform<Express.Multer.File> {
  private readonly allowedExtensions: string[] = ['.jpg', '.jpeg', '.png'];

  transform(
    value: Express.Multer.File,
    metadata: ArgumentMetadata,
  ): Express.Multer.File {
    const file: Express.Multer.File = value;

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (file.size > 2 * 1024 * 1024) {
      throw new BadRequestException('File size should not exceed 2MB');
    }

    const fileExt: string = path.extname(file.originalname).toLowerCase();
    if (!this.allowedExtensions.includes(fileExt)) {
      throw new BadRequestException(
        'Invalid file format. Only JPG, JPEG, and PNG files are allowed.',
      );
    }

    return file;
  }
}
