/* eslint-disable prettier/prettier */
import { Injectable, PipeTransform } from '@nestjs/common';
import { accessSync } from 'node:fs';
import { parse, join } from 'path';
import * as sharp from 'sharp';

@Injectable()
export class ImagePipe
  implements PipeTransform<Express.Multer.File, Promise<any>>
{
  async transform(image: Express.Multer.File): Promise<any> {
    const pathToSave = 'public/images';

    console.log('image', image);

    try {
      accessSync(pathToSave); // will either "throw an error" or return "undefined"
      const imageType = image.mimetype.split('/')[1]; // will get the filetype extension
      console.log('image path parse', parse(image.originalname));
      const originalName = parse(image.originalname).name;
      const filename = Date.now() + '-' + originalName + `.${imageType}`;

      // where the magic happens
      await sharp(image.buffer)
        .resize({
          width: 200,
          height: 200,
          fit: 'fill',
        })
        .toFile(join(pathToSave, filename));

      return filename;
    } catch (err) {
      console.error('Error', err);
    }
  }
}
