import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as uuid from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import * as AWS from 'aws-sdk';
import { MemoryStoredFile } from 'nestjs-form-data';
import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';

@Injectable()
export class FileService {
  constructor(private config: ConfigService) {}

  AWS_S3_BUCKET = this.config.get<string>('AWS_S3_BUCKET');
  logger: Logger = new Logger('FileService');

  private get S3() {
    return new AWS.S3({
      accessKeyId: this.config.get<string>('AWS_S3_ACCESS_KEY'),
      secretAccessKey: this.config.get<string>('AWS_S3_KEY_SECRET'),
    });
  }

  private decodeFile(
    directory: string,
    file,
  ): { fileName: string; filePath: string; isImage: boolean } {
    let fileExtension = '';
    let isImage = false;

    if (file?.originalName) {
      fileExtension = file.originalName.split('.').pop();
      if (file.busBoyMimeType.startsWith('image')) isImage = true;
    } else {
      fileExtension = file.originalname.split('.').pop();
      if (file.mimetype.startsWith('image')) isImage = true;
    }
    const fileName = `${uuid.v4()}.${fileExtension}`;
    const filePath = path.resolve(__dirname, '..', '..', 'static', directory);

    return { fileName, filePath, isImage };
  }

  async createFile(
    directory: string,
    file: Express.Multer.File | MemoryStoredFile,
  ): Promise<string> {
    try {
      const { filePath, fileName, isImage } = this.decodeFile(directory, file);
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      // Check if the file is an image (based on MIME type)
      if (isImage) {
        // Convert image to WebP format using sharp
        const webpFileName = `${fileName.split('.')[0]}.webp`;
        await sharp(file.buffer)
          .webp({ effort: 5 })
          .toFile(path.resolve(filePath, webpFileName));
        return `${directory}/${webpFileName}`;
      }

      // If it's not an image, just save it with the original extension
      fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);
      return `${directory}/${fileName}`;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  removeFile(fileName, throwOnError = true) {
    const filePath = path.resolve(__dirname, '..', '..', 'static', fileName);
    if (!fs.existsSync(filePath) && throwOnError) {
      throw new HttpException(
        { message: `The file "${fileName}" does not exist` },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath);
    }
  }

  async createS3File(
    directory: string,
    file: Express.Multer.File | MemoryStoredFile,
  ): Promise<string> {
    try {
      const { fileName, isImage } = this.decodeFile(directory, file);

      // Check if the file is an image (based on MIME type)
      if (isImage) {
        // Convert image to WebP format using sharp
        const webpFileName = `${fileName.split('.')[0]}.webp`;
        const webpBuffer = await sharp(file.buffer)
          .webp({ effort: 5 })
          .toBuffer();
        await this.s3Upload(webpBuffer, webpFileName, directory, 'image/webp');
        return `${directory}/${webpFileName}`;
      }

      // If it's not an image, just save it with the original extension
      await this.s3Upload(file.buffer, fileName, directory, file.mimetype);
      return `${directory}/${fileName}`;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async s3Upload(
    file: Buffer,
    fileName: string,
    filePath: string,
    mimetype: string,
  ) {
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: `${filePath}/${fileName}`,
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };
    return new Promise((resolve, reject) => {
      this.S3.upload(params, (err, data) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  async removeS3File(path: string) {
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: path,
    };
    return new Promise((resolve, reject) => {
      this.S3.deleteObject(params, (err, data) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }
}
