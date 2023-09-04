import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryConfigService {
  constructor() {
    v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
  }

  async uploadImage(file, folderName: string) {
    //  console.log(object) file.mimetype.split('/')[1];
    return new Promise((resolve, reject) => {
      const streamify = new Readable();
      streamify._read = () => {
        streamify.push(file.buffer);
        streamify.push(null);
      };
      const uploadOptions = {
        folder: `zizle/${folderName}`,
      };
      streamify.pipe(
        v2.uploader.upload_stream(uploadOptions, (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        })
      );
    });
  }

  async getFolderImagesUrls(folderName: string) {
    try {
      const result = await v2.search
        .expression(`folder:${folderName}`)
        .max_results(30) // Set the maximum number of results to retrieve
        .execute();

      const images = result.resources.map((resource) => resource.secure_url);

      return images;
    } catch (error) {
      console.error('Error fetching images from folder:', error);
      throw new Error('Error fetching images from folder');
    }
  }

  async uploadFile(fileBuffer, folderName) {
    return new Promise((resolve, reject) => {
      const streamify = new Readable();
      streamify._read = () => {
        streamify.push(fileBuffer);
        streamify.push(null);
      };
      const uploadOptions = {
        folder: `zizle/${folderName}`,
      };
      streamify.pipe(
        v2.uploader.upload_stream(uploadOptions, (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        })
      );
    });
  }
}
